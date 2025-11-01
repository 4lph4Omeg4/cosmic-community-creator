import { supabase } from './supabaseClient';

const BUCKET_NAME = 'starnation-images';

export interface ImageStorage {
    saveImage(userId: string, starId: string, imageData: string): Promise<string>;
    getImage(userId: string, starId: string): Promise<string[]>;
    deleteImage(userId: string, starId: string, imageIndex?: number): Promise<void>;
}

/**
 * Converts base64 data URL to blob
 */
function dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/**
 * Gets file extension from data URL
 */
function getExtensionFromDataURL(dataURL: string): string {
    const mime = dataURL.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
    const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
    };
    return mimeToExt[mime] || 'jpg';
}

export const imageStorage: ImageStorage = {
    /**
     * Save an image to Supabase Storage
     * Returns the public URL of the saved image
     */
    async saveImage(userId: string, starId: string, imageData: string): Promise<string> {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 9);
            const ext = getExtensionFromDataURL(imageData);
            const fileName = `${userId}/${starId}/${timestamp}-${randomStr}.${ext}`;
            
            // Convert base64 to blob
            const blob = dataURLtoBlob(imageData);
            
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, blob, {
                    contentType: blob.type,
                    upsert: false,
                });
            
            if (error) {
                console.error('Error uploading image to Supabase:', error);
                throw error;
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);
            
            if (!urlData?.publicUrl) {
                throw new Error('Failed to get public URL for uploaded image');
            }
            
            console.log('Image saved to Supabase:', urlData.publicUrl);
            return urlData.publicUrl;
        } catch (err) {
            console.error('Error in saveImage:', err);
            throw err;
        }
    },
    
    /**
     * Get all images for a star
     * Returns array of public URLs
     */
    async getImage(userId: string, starId: string): Promise<string[]> {
        try {
            const folderPath = `${userId}/${starId}/`;
            
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .list(folderPath, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });
            
            if (error) {
                console.error('Error listing images from Supabase:', error);
                // Return empty array instead of throwing - allows graceful degradation
                return [];
            }
            
            if (!data || data.length === 0) {
                return [];
            }
            
            // Get public URLs for all files
            const imageUrls = data
                .filter(file => file.name && !file.name.endsWith('/'))
                .map(file => {
                    const { data: urlData } = supabase.storage
                        .from(BUCKET_NAME)
                        .getPublicUrl(`${folderPath}${file.name}`);
                    return urlData?.publicUrl || '';
                })
                .filter(url => url !== '');
            
            console.log(`Loaded ${imageUrls.length} images from Supabase for ${starId}`);
            return imageUrls;
        } catch (err) {
            console.error('Error in getImage:', err);
            return [];
        }
    },
    
    /**
     * Delete an image or all images for a star
     */
    async deleteImage(userId: string, starId: string, imageIndex?: number): Promise<void> {
        try {
            const folderPath = `${userId}/${starId}/`;
            
            if (imageIndex !== undefined) {
                // Delete specific image
                const { data: files } = await supabase.storage
                    .from(BUCKET_NAME)
                    .list(folderPath);
                
                if (files && files[imageIndex]) {
                    const fileName = `${folderPath}${files[imageIndex].name}`;
                    const { error } = await supabase.storage
                        .from(BUCKET_NAME)
                        .remove([fileName]);
                    
                    if (error) {
                        throw error;
                    }
                }
            } else {
                // Delete all images for this star
                const { data: files } = await supabase.storage
                    .from(BUCKET_NAME)
                    .list(folderPath);
                
                if (files && files.length > 0) {
                    const filePaths = files.map(file => `${folderPath}${file.name}`);
                    const { error } = await supabase.storage
                        .from(BUCKET_NAME)
                        .remove(filePaths);
                    
                    if (error) {
                        throw error;
                    }
                }
            }
        } catch (err) {
            console.error('Error in deleteImage:', err);
            throw err;
        }
    },
};

