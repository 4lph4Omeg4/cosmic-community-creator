import { supabase } from './supabaseClient';

const BUCKET_NAME = 'starnation-videos';

export interface VideoStorage {
    saveVideo(userId: string, starId: string, videoBlob: Blob): Promise<string>;
    getVideo(userId: string, starId: string): Promise<string | null>;
    deleteVideo(userId: string, starId: string): Promise<void>;
}

export const videoStorage: VideoStorage = {
    /**
     * Save a video to Supabase Storage
     * Returns the public URL of the saved video
     */
    async saveVideo(userId: string, starId: string, videoBlob: Blob): Promise<string> {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 9);
            const fileName = `${userId}/${starId}/${timestamp}-${randomStr}.mp4`;
            
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, videoBlob, {
                    contentType: 'video/mp4',
                    upsert: false,
                });
            
            if (error) {
                console.error('Error uploading video to Supabase:', error);
                if (error.message?.includes('row-level security') || error.message?.includes('violates')) {
                    throw new Error('Storage bucket is not configured. Please check SUPABASE_SETUP.md for instructions on setting up RLS policies.');
                }
                throw error;
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);
            
            if (!urlData?.publicUrl) {
                throw new Error('Failed to get public URL for uploaded video');
            }
            
            console.log('Video saved to Supabase:', urlData.publicUrl);
            return urlData.publicUrl;
        } catch (err) {
            console.error('Error in saveVideo:', err);
            throw err;
        }
    },
    
    /**
     * Get the video URL for a star
     * Returns the most recent video URL or null
     */
    async getVideo(userId: string, starId: string): Promise<string | null> {
        try {
            const folderPath = `${userId}/${starId}/`;
            
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .list(folderPath, {
                    limit: 1,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });
            
            if (error) {
                console.error('Error listing videos from Supabase:', error);
                return null;
            }
            
            if (!data || data.length === 0) {
                return null;
            }
            
            // Get public URL for the most recent video
            const mostRecentFile = data[0];
            const { data: urlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(`${folderPath}${mostRecentFile.name}`);
            
            if (!urlData?.publicUrl) {
                return null;
            }
            
            console.log(`Loaded video from Supabase for ${starId}:`, urlData.publicUrl);
            return urlData.publicUrl;
        } catch (err) {
            console.error('Error in getVideo:', err);
            return null;
        }
    },
    
    /**
     * Delete a video for a star
     */
    async deleteVideo(userId: string, starId: string): Promise<void> {
        try {
            const folderPath = `${userId}/${starId}/`;
            
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
        } catch (err) {
            console.error('Error in deleteVideo:', err);
            throw err;
        }
    },
};
