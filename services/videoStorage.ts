// IndexedDB helper for storing large video files
const DB_NAME = 'cosmic-creator-videos';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

interface VideoStorage {
    saveVideo(userId: string, starId: string, videoBlob: Blob): Promise<void>;
    getVideo(userId: string, starId: string): Promise<string | null>;
    deleteVideo(userId: string, starId: string): Promise<void>;
}

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: ['userId', 'starId'] });
            }
        };
    });
};

export const videoStorage: VideoStorage = {
    async saveVideo(userId: string, starId: string, videoBlob: Blob): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put({ userId, starId, videoBlob });
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },
    
    async getVideo(userId: string, starId: string): Promise<string | null> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get([userId, starId]);
            
            request.onsuccess = () => {
                const result = request.result;
                if (result && result.videoBlob) {
                    // Convert blob to object URL for video tag
                    const blobUrl = URL.createObjectURL(result.videoBlob);
                    resolve(blobUrl);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    },
    
    async deleteVideo(userId: string, starId: string): Promise<void> {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete([userId, starId]);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};

