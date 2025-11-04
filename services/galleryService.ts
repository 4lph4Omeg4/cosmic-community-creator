import { supabase } from './supabaseClient';

const IMAGES_BUCKET = 'starnation-images';
const VIDEOS_BUCKET = 'starnation-videos';

export interface GalleryItem {
    url: string;
    type: 'image' | 'video';
    userId?: string;
    starId?: string;
    createdAt?: string;
}

/**
 * Get all recent images from all users
 */
async function getAllImages(limit: number = 20): Promise<GalleryItem[]> {
    try {
        // List all folders in the bucket
        const { data: folders, error: foldersError } = await supabase.storage
            .from(IMAGES_BUCKET)
            .list('', {
                limit: 1000,
            });

        if (foldersError) {
            console.error('Error listing image folders:', foldersError);
            console.error('Error details:', {
                message: foldersError.message,
                statusCode: foldersError.statusCode,
                error: foldersError.error,
            });
            // If RLS policy blocks access, throw error so UI can handle it
            if (foldersError.message?.includes('row-level security') || 
                foldersError.message?.includes('permission') ||
                foldersError.message?.includes('policy') ||
                foldersError.statusCode === '403' ||
                foldersError.statusCode === 403) {
                console.warn('Storage bucket access denied - check RLS policies for public read access');
                throw new Error('Storage bucket access denied. Please configure RLS policies for public read access.');
            }
            // For other errors, return empty array (graceful degradation)
            return [];
        }

        if (!folders || folders.length === 0) {
            console.log('No image folders found in bucket');
            return [];
        }

        console.log(`Found ${folders.length} user folders in images bucket`);

        const allImages: GalleryItem[] = [];

        // Get the first valid user folder
        const userFolder = folders.find(f => f.name && !f.name.includes('.'));
        
        if (!userFolder || !userFolder.name) {
            console.log('No valid user folder found');
            return [];
        }

        console.log(`Using user folder: ${userFolder.name}`);

        // Get all star folders for this user
        const { data: starFolders, error: starError } = await supabase.storage
            .from(IMAGES_BUCKET)
            .list(userFolder.name, {
                limit: 100,
            });

        if (starError) {
            console.error(`Error listing star folders:`, starError);
            return [];
        }

        if (!starFolders || starFolders.length === 0) {
            console.log(`No star folders found in ${userFolder.name}`);
            return [];
        }

        console.log(`Found ${starFolders.length} star folders`);

        // Get images from all star folders
        for (const starFolder of starFolders) {
            if (!starFolder.name || starFolder.name.includes('.')) continue;

            const { data: files, error: filesError } = await supabase.storage
                .from(IMAGES_BUCKET)
                .list(`${userFolder.name}/${starFolder.name}`, {
                    limit: 100,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (filesError) {
                console.error(`Error listing files for ${starFolder.name}:`, filesError);
                continue;
            }

            if (!files || files.length === 0) {
                continue;
            }

            console.log(`Found ${files.length} files in ${starFolder.name}`);

            for (const file of files) {
                if (file.name && !file.name.endsWith('/') && file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
                    const filePath = `${userFolder.name}/${starFolder.name}/${file.name}`;
                    const { data: urlData } = supabase.storage
                        .from(IMAGES_BUCKET)
                        .getPublicUrl(filePath);

                    if (urlData?.publicUrl) {
                        allImages.push({
                            url: urlData.publicUrl,
                            type: 'image',
                            userId: userFolder.name,
                            starId: starFolder.name,
                            createdAt: file.created_at || file.updated_at || new Date().toISOString(),
                        });
                    }
                }
            }
        }

        // Sort by created_at (most recent first) and limit
        return allImages
            .sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bTime - aTime;
            })
            .slice(0, limit);
    } catch (err) {
        console.error('Error getting all images:', err);
        return [];
    }
}

/**
 * Get all recent videos from all users
 */
async function getAllVideos(limit: number = 10): Promise<GalleryItem[]> {
    try {
        // List all folders in the bucket
        const { data: folders, error: foldersError } = await supabase.storage
            .from(VIDEOS_BUCKET)
            .list('', {
                limit: 1000,
            });

        if (foldersError) {
            console.error('Error listing video folders:', foldersError);
            console.error('Error details:', {
                message: foldersError.message,
                statusCode: foldersError.statusCode,
                error: foldersError.error,
            });
            // If RLS policy blocks access, throw error so UI can handle it
            if (foldersError.message?.includes('row-level security') || 
                foldersError.message?.includes('permission') ||
                foldersError.message?.includes('policy') ||
                foldersError.statusCode === '403' ||
                foldersError.statusCode === 403) {
                console.warn('Storage bucket access denied - check RLS policies for public read access');
                throw new Error('Storage bucket access denied. Please configure RLS policies for public read access.');
            }
            // For other errors, return empty array (graceful degradation)
            return [];
        }

        if (!folders || folders.length === 0) {
            console.log('No video folders found in bucket');
            return [];
        }

        console.log(`Found ${folders.length} user folders in videos bucket`);

        const allVideos: GalleryItem[] = [];

        // Get the first valid user folder
        const userFolder = folders.find(f => f.name && !f.name.includes('.'));
        
        if (!userFolder || !userFolder.name) {
            console.log('No valid user folder found (videos)');
            return [];
        }

        console.log(`Using user folder (videos): ${userFolder.name}`);

        // Get all star folders for this user
        const { data: starFolders, error: starError } = await supabase.storage
            .from(VIDEOS_BUCKET)
            .list(userFolder.name, {
                limit: 100,
            });

        if (starError) {
            console.error(`Error listing star folders (videos):`, starError);
            return [];
        }

        if (!starFolders || starFolders.length === 0) {
            console.log(`No star folders found (videos)`);
            return [];
        }

        console.log(`Found ${starFolders.length} star folders (videos)`);

        // Get videos from all star folders
        for (const starFolder of starFolders) {
            if (!starFolder.name || starFolder.name.includes('.')) continue;

            const { data: files, error: filesError } = await supabase.storage
                .from(VIDEOS_BUCKET)
                .list(`${userFolder.name}/${starFolder.name}`, {
                    limit: 100,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (filesError) {
                console.error(`Error listing files for ${starFolder.name} (videos):`, filesError);
                continue;
            }

            if (!files || files.length === 0) {
                continue;
            }

            console.log(`Found ${files.length} files in ${starFolder.name} (videos)`);

            for (const file of files) {
                if (file.name && !file.name.endsWith('/') && file.name.match(/\.(mp4|webm|mov)$/i)) {
                    const filePath = `${userFolder.name}/${starFolder.name}/${file.name}`;
                    const { data: urlData } = supabase.storage
                        .from(VIDEOS_BUCKET)
                        .getPublicUrl(filePath);

                    if (urlData?.publicUrl) {
                        allVideos.push({
                            url: urlData.publicUrl,
                            type: 'video',
                            userId: userFolder.name,
                            starId: starFolder.name,
                            createdAt: file.created_at || file.updated_at || new Date().toISOString(),
                        });
                    }
                }
            }
        }

        // Sort by created_at (most recent first) and limit
        return allVideos
            .sort((a, b) => {
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return bTime - aTime;
            })
            .slice(0, limit);
    } catch (err) {
        console.error('Error getting all videos:', err);
        return [];
    }
}

export const galleryService = {
    getAllImages,
    getAllVideos,
};

