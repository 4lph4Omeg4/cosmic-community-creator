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
            return [];
        }

        if (!folders || folders.length === 0) {
            return [];
        }

        const allImages: GalleryItem[] = [];

        // For each user folder, get images
        for (const userFolder of folders) {
            if (!userFolder.name || userFolder.name.includes('.')) continue;

            const { data: starFolders, error: starError } = await supabase.storage
                .from(IMAGES_BUCKET)
                .list(userFolder.name, {
                    limit: 100,
                });

            if (starError) continue;

            if (starFolders) {
                for (const starFolder of starFolders) {
                    if (!starFolder.name || starFolder.name.includes('.')) continue;

                    const { data: files, error: filesError } = await supabase.storage
                        .from(IMAGES_BUCKET)
                        .list(`${userFolder.name}/${starFolder.name}`, {
                            limit: 10,
                            sortBy: { column: 'created_at', order: 'desc' },
                        });

                    if (filesError || !files) continue;

                    for (const file of files) {
                        if (file.name && !file.name.endsWith('/') && file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
                            const { data: urlData } = supabase.storage
                                .from(IMAGES_BUCKET)
                                .getPublicUrl(`${userFolder.name}/${starFolder.name}/${file.name}`);

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
            return [];
        }

        if (!folders || folders.length === 0) {
            return [];
        }

        const allVideos: GalleryItem[] = [];

        // For each user folder, get videos
        for (const userFolder of folders) {
            if (!userFolder.name || userFolder.name.includes('.')) continue;

            const { data: starFolders, error: starError } = await supabase.storage
                .from(VIDEOS_BUCKET)
                .list(userFolder.name, {
                    limit: 100,
                });

            if (starError) continue;

            if (starFolders) {
                for (const starFolder of starFolders) {
                    if (!starFolder.name || starFolder.name.includes('.')) continue;

                    const { data: files, error: filesError } = await supabase.storage
                        .from(VIDEOS_BUCKET)
                        .list(`${userFolder.name}/${starFolder.name}`, {
                            limit: 5,
                            sortBy: { column: 'created_at', order: 'desc' },
                        });

                    if (filesError || !files) continue;

                    for (const file of files) {
                        if (file.name && !file.name.endsWith('/') && file.name.match(/\.(mp4|webm|mov)$/i)) {
                            const { data: urlData } = supabase.storage
                                .from(VIDEOS_BUCKET)
                                .getPublicUrl(`${userFolder.name}/${starFolder.name}/${file.name}`);

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

