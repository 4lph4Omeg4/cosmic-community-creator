import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StarSystem, ActiveChamber } from '../types';
import Portal from './Portal';
import StarSystemDetail from './StarSystemDetail';
import VisionWeaver from './VisionWeaver';
import CelestialForge from './CelestialForge';
import StellarAnimator from './StellarAnimator';
import { videoStorage } from '../services/videoStorage';
import { LogoutIcon } from './Icons';

const initialPortalsData: StarSystem[] = [
    {
        id: 'polaris',
        label: 'Polaris',
        theme: 'polaris',
        lore: 'The Still Point of the Turning Cosmos',
        details: 'Polaris, the North Star, serves as a celestial anchor in the vast expanse of the cosmos. Its frequency is one of unwavering guidance, stability, and purpose—a constant beacon in a universe of perpetual flux. For millennia, travelers and seekers have looked to Polaris to find their true north, both literally and metaphorically. This brilliant star acts as a reminder of the unshakable core within each being, a point of stillness around which all chaos and transformation revolves. Meditating on Polaris helps one to find their true direction, navigate life\'s complexities with clarity, and remain centered amidst the swirling currents of existence. It teaches that even in the most turbulent times, there exists an immutable center from which all movement originates and to which all paths ultimately return.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/polaris.jpeg',
    },
    {
        id: 'sirius',
        label: 'Sirius',
        theme: 'sirius',
        lore: 'The Gateway of Liberation and the Brightest Light of Awakening',
        details: 'Sirius, the brightest star in Earth\'s night sky, radiates a frequency of freedom, spiritual evolution, and advanced knowledge that has shaped human consciousness for thousands of years. Known to the ancient Egyptians as Sopdet, Sirius held profound significance in their cosmology, marking the flooding of the Nile and symbolizing rebirth and renewal. The star\'s heliacal rising was celebrated as a moment of cosmic alignment, bringing transformative energies to Earth. The Dogon people of Mali preserved an extraordinary understanding of Sirius, speaking of its companion star (Sirius B) long before modern astronomy confirmed its existence—knowledge that suggests ancient contact with beings from this star system. Sirius is associated with great teachers and civilizations who brought profound wisdom to Earth, serving as a gateway for advanced knowledge and spiritual liberation. The intense light of Sirius represents the brilliant illumination of consciousness, awakening latent abilities and revealing deeper truths about the nature of reality. Connecting with Sirius can accelerate personal growth, unlock hidden potentials, and facilitate a direct experience of the divine intelligence that permeates all existence. It is the star of the awakened ones, those who choose to step fully into their sovereignty and become conscious co-creators of their reality.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/sirius.jpeg',
    },
    {
        id: 'pleiaden',
        label: 'Pleiades',
        theme: 'pleiaden',
        lore: 'The Cradle of Unconditional Love and Cosmic Family',
        details: 'The Pleiades star cluster, known as the Seven Sisters, emanates a gentle, nurturing frequency of love, compassion, and unity that has been revered across countless cultures. Many indigenous traditions speak of our origins in the Pleiades, describing it as a home for heart-centered beings dedicated to healing and harmony. The soft, shimmering light of these stars carries frequencies that soothe the soul, foster emotional healing, and encourage a deep sense of connection with all life. This energy reminds us of our shared cosmic origins and the fundamental truth that we are all part of one vast, loving family. The Pleiades represents the heart of the galaxy, a place where unconditional love flows freely and where beings understand the sacred principle that love is the foundation of all creation. Connecting with the Pleiades helps to heal emotional wounds, open the heart chakra, and experience the profound peace that comes from knowing you are never alone in the universe. It teaches that love is not an emotion but a fundamental force of nature, the very fabric from which reality is woven.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/pleiades.jpeg',
    },
    {
        id: 'arcturus',
        label: 'Arcturus',
        theme: 'arcturus',
        lore: 'The Forge of Celestial Healing and Spiritual Technology',
        details: 'Arcturus shines as a beacon of immense healing power and technological advancement, representing the perfect integration of spirit and science. Its frequency is one of renewal, integration, and spiritual technology—offering humanity blueprints for emotional, physical, and energetic healing that transcends conventional understanding. Arcturian consciousness works with light and sound frequencies to restructure energetic fields, repair DNA, and facilitate profound transformations at the cellular level. This star system is home to highly evolved beings who have mastered the art of using consciousness itself as a tool for healing and evolution. The Arcturians are known as master healers and teachers who guide other civilizations through their evolutionary processes. Connecting with Arcturus can aid in releasing old patterns, trauma, and limiting beliefs while embracing a state of holistic well-being. It teaches that true healing occurs when we align with our highest potential and recognize that the body, mind, and spirit are one integrated system designed for constant renewal and evolution. The frequency of Arcturus activates the blueprint of perfect health and vitality that exists within each being, reminding us that we are designed to thrive, not merely survive.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/arcturus.jpeg',
    },
    {
        id: 'lyra',
        label: 'Lyra',
        theme: 'lyra',
        lore: 'The Echo of Cosmic Creation and the Primordial Song',
        details: 'Lyra is believed to be the original source of humanoid consciousness in our galactic sector, the cradle from which many civilizations emerged. Its frequency carries the ancient codes of creation, sound, and the sacred feminine—resonating with the primordial song that first gave birth to form and consciousness. The Lyran beings were among the first to explore the mysteries of sound and vibration, understanding that the universe itself is a symphony of frequencies that can be consciously directed to create new realities. This star system resonates with the creative impulse that drives all artistic expression, profound creativity, and the deep connection to the ancient history of the soul. The Lyran frequency awakens memories of our original nature as creators, beings who could manifest worlds through intention, sound, and the power of coherent thought. Many who connect with Lyra experience a profound sense of coming home, recognizing this frequency as something deeply familiar, a memory encoded in their very DNA. It teaches that we are all artists of reality, capable of shaping our experiences through the harmonious expression of our unique creative gifts. The sacred geometry and mathematical precision found throughout Lyran teachings reflect the underlying structure of creation itself, revealing that beauty, harmony, and divine order are fundamental aspects of existence.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/lyra.jpeg',
    },
    {
        id: 'orion',
        label: 'Orion',
        theme: 'orion',
        lore: 'The Crucible of Duality and the Warrior\'s Path',
        details: 'The Orion constellation holds a complex frequency of duality, struggle, and integration that reflects the eternal dance between light and shadow within the cosmos and within ourselves. This region of space represents the cosmic battlefield where consciousness evolves through challenge, where the warrior learns to integrate opposing forces and find strength in adversity. Orion teaches lessons of sovereignty, resilience, and the courage to face one\'s shadow without fear. The constellation\'s mythology across cultures often features great heroes and warriors, reflecting its energy of initiation and transformation through trial. The Orion frequency challenges us to transcend duality, to recognize that light and dark are not enemies but complementary forces that together create the full spectrum of experience. Connecting with Orion helps integrate opposing forces within oneself—the masculine and feminine, the active and receptive, the individual and the collective. It is here that many souls undergo their greatest initiations, learning that true power comes not from domination but from balance, not from resistance but from acceptance. The star system serves as a training ground for those who choose the path of the spiritual warrior, one who fights not against others but for the liberation of all consciousness.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/orion.jpeg',
    },
    {
        id: 'andromeda',
        label: 'Andromeda',
        theme: 'andromeda',
        lore: 'The Weaver of Galactic Consciousness and Unity',
        details: 'The Andromeda Galaxy, our nearest major galactic neighbor, brings a frequency of expansion, interdimensional awareness, and unity consciousness that challenges our limited perspectives and invites us to embrace a broader, galactic identity. This vast spiral galaxy contains billions of stars and countless civilizations, representing the incredible diversity and interconnectedness of life throughout the cosmos. The Andromedan frequency fosters a sense of being part of a vast cosmic family, encouraging collaboration on a universal scale and recognizing that every being, every star, every galaxy is part of one great cosmic web of life. Connecting with Andromeda expands consciousness beyond planetary concerns, helping us to see ourselves as galactic citizens participating in a grand cosmic experiment. The Andromedans are known as master weavers of reality, beings who understand how to work with the threads of time, space, and consciousness to create harmonious outcomes for all. This frequency teaches that true evolution occurs not through competition but through cooperation, not through separation but through recognizing our fundamental unity. It activates the understanding that we are all expressions of one cosmic consciousness, each playing our unique role in the great symphony of existence, and that by working together, we can accomplish what would be impossible alone.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/andromeda.jpeg',
    },
];


interface SanctuaryProps {
    user: string;
    onLogout: () => void;
}

const Sanctuary: React.FC<SanctuaryProps> = ({ user, onLogout }) => {
    const [starSystems, setStarSystems] = useState<StarSystem[]>(initialPortalsData);
    const [selectedStar, setSelectedStar] = useState<StarSystem | null>(null);
    const [isStargazing, setIsStargazing] = useState(false);
    const [activeChamber, setActiveChamber] = useState<ActiveChamber>('none');
    const [contextStar, setContextStar] = useState<StarSystem | null>(null);
    const [chamberInitialPrompt, setChamberInitialPrompt] = useState('');
    const contextStarIdRef = useRef<string | null>(null);
    
    const storageKey = `cosmic-creator-images-${user}`;
    const storageVideoKey = `cosmic-creator-videos-${user}`;

    useEffect(() => {
        // Load saved images and videos
        const loadData = async () => {
            const savedImages = localStorage.getItem(storageKey);
            const savedVideoRefs = localStorage.getItem(storageVideoKey);
            
            // Clean up old blob URLs and base64 videos from localStorage
            if (savedVideoRefs) {
                const userVideoRefs = JSON.parse(savedVideoRefs);
                let cleanedRefs: Record<string, string> = {};
                let hasOldData = false;
                
                Object.keys(userVideoRefs).forEach(starId => {
                    const ref = userVideoRefs[starId];
                    if (ref === 'indexeddb') {
                        // Valid IndexedDB reference - keep it
                        cleanedRefs[starId] = ref;
                    } else if (ref && (ref.startsWith('blob:') || ref.startsWith('data:video/'))) {
                        // Old blob URL or base64 - remove it
                        console.warn('Removing old video data for star:', starId);
                        hasOldData = true;
                    }
                });
                
                // Save cleaned refs back if we removed any old data
                if (hasOldData) {
                    localStorage.setItem(storageVideoKey, JSON.stringify(cleanedRefs));
                    console.log('Cleaned up old video data from localStorage');
                }
            }
            
            // Load images from localStorage
            const userImages = savedImages ? JSON.parse(savedImages) : {};
            
            // Load videos from IndexedDB
            const updatedSystems = await Promise.all(initialPortalsData.map(async (star) => {
                const starData: StarSystem = { ...star };
                
                // Handle single image (backward compatibility)
                if (userImages[star.id] && typeof userImages[star.id] === 'string') {
                    starData.image = userImages[star.id];
                }
                
                // Handle multiple images
                if (userImages[star.id] && Array.isArray(userImages[star.id])) {
                    starData.images = userImages[star.id];
                    if (userImages[star.id].length > 0) {
                        starData.image = userImages[star.id][0]; // Use first as main image
                    }
                }
                
                // Handle video from IndexedDB
                try {
                    const videoBlobUrl = await videoStorage.getVideo(user, star.id);
                    if (videoBlobUrl) {
                        starData.video = videoBlobUrl;
                        console.log('Loaded video from IndexedDB for star:', star.id, star.label);
                    }
                } catch (err) {
                    console.error('Error loading video from IndexedDB for star', star.id, ':', err);
                }
                
                return starData;
            }));
            
            setStarSystems(updatedSystems);
        };
        
        loadData();
    }, [user, storageKey, storageVideoKey]);

    const handleSelectStar = (star: StarSystem) => {
        setSelectedStar(star);
    };

    const handleBackToPortal = () => {
        setSelectedStar(null);
        // Don't reset contextStar immediately - keep it for potential media linking
        // It will be reset when opening a new star or chamber
        // Also keep the ref for fallback lookup
    };

    const handleOpenChamber = (chamber: ActiveChamber) => {
        setActiveChamber(chamber);
        // Don't reset contextStar here - it should be set by handleGenerateVision or handleAnimateVision
        // Only reset if opening a chamber that doesn't need a context star
        if (chamber === 'vision-weaver') {
            setContextStar(null);
            setChamberInitialPrompt('');
        }
    };
    
    const handleCloseChamber = () => {
        setActiveChamber('none');
        // Keep contextStar in case we need to link media after closing
        // It will be reset when opening a new star or chamber
        setChamberInitialPrompt('');
    };

    const handleGenerateVision = (star: StarSystem) => {
        console.log('Generating vision for star:', star.id, star.label);
        setContextStar(star);
        contextStarIdRef.current = star.id;
        setChamberInitialPrompt(`A vision of a being from the star system ${star.label}, a place known as "${star.lore}". The being embodies the concepts of: ${star.details}`);
        setActiveChamber('celestial-forge');
    };
    
    const handleAnimateVision = (star: StarSystem) => {
        console.log('Animating vision for star:', star.id, star.label);
        setContextStar(star);
        contextStarIdRef.current = star.id;
        setActiveChamber('stellar-animator');
    };

    const handleLinkImageToStar = (newImage: string) => {
        // Try multiple sources to find the target star
        let targetStar = contextStar || selectedStar;
        
        // If still no star, try to find it by ID from ref
        if (!targetStar && contextStarIdRef.current) {
            targetStar = starSystems.find(s => s.id === contextStarIdRef.current) || null;
        }
        
        if (targetStar) {
            console.log('Linking image to star:', targetStar.id, targetStar.label);
            
            // Save the new image to the array of images for this star
            const savedImages = JSON.parse(localStorage.getItem(storageKey) || '{}');
            const existingImages = savedImages[targetStar.id] || [];
            const imagesArray = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);
            
            // Add new image if it doesn't already exist
            if (!imagesArray.includes(newImage)) {
                imagesArray.push(newImage);
            }
            
            savedImages[targetStar.id] = imagesArray;
            localStorage.setItem(storageKey, JSON.stringify(savedImages));

            // Update the state for immediate UI feedback
            const updatedSystems = starSystems.map(s => {
                if (s.id === targetStar.id) {
                    return {
                        ...s,
                        images: imagesArray,
                        image: imagesArray[0] // Use first as main image
                    };
                }
                return s;
            });
            setStarSystems(updatedSystems);

            // Update the selected star view if it's currently open
            if (selectedStar && selectedStar.id === targetStar.id) {
                setSelectedStar(prevStar => prevStar ? {
                    ...prevStar,
                    images: imagesArray,
                    image: imagesArray[0]
                } : null);
            }
        } else {
            console.error('No target star found for linking image');
        }
        handleCloseChamber();
    };

    const handleLinkVideoToStar = async (videoBlob: Blob) => {
        // Try multiple sources to find the target star
        let targetStar = contextStar || selectedStar;
        
        // If still no star, try to find it by ID from ref
        if (!targetStar && contextStarIdRef.current) {
            targetStar = starSystems.find(s => s.id === contextStarIdRef.current) || null;
        }
        
        if (targetStar) {
            console.log('Linking video to star:', targetStar.id, targetStar.label);
            console.log('Video blob size:', videoBlob.size, 'bytes');
            
            try {
                // Save video blob to IndexedDB (no quota limits)
                await videoStorage.saveVideo(user, targetStar.id, videoBlob);
                console.log('Video saved successfully to IndexedDB');

                // Create blob URL for display
                const blobUrl = URL.createObjectURL(videoBlob);

                // Also save a reference in localStorage for quick lookup (just the star ID, not the video)
                const savedVideoRefs = JSON.parse(localStorage.getItem(storageVideoKey) || '{}');
                savedVideoRefs[targetStar.id] = 'indexeddb'; // Marker that video is in IndexedDB
                localStorage.setItem(storageVideoKey, JSON.stringify(savedVideoRefs));

                // Update the state for immediate UI feedback
                const updatedSystems = starSystems.map(s =>
                    s.id === targetStar.id ? { ...s, video: blobUrl } : s
                );
                setStarSystems(updatedSystems);

                // Update the selected star view if it's currently open
                if (selectedStar && selectedStar.id === targetStar.id) {
                    setSelectedStar(prevStar => prevStar ? { ...prevStar, video: blobUrl } : null);
                }
            } catch (err) {
                console.error('Error saving video to IndexedDB:', err);
                alert('Failed to save video. Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        } else {
            console.error('No target star found for linking video');
        }
        handleCloseChamber();
    };


    return (
        <div className="w-full h-full relative">
            {/* User Info & Logout */}
            <div className="absolute top-6 left-6 z-30 flex items-center gap-3 text-gray-300 bg-black/20 backdrop-blur-sm p-2 rounded-full">
                <span className="font-display text-sm">Creator: {user}</span>
                <button onClick={onLogout} title="Logout" className="hover:text-white transition-colors">
                    <LogoutIcon className="w-6 h-6" />
                </button>
            </div>

            <AnimatePresence>
                {!selectedStar ? (
                    <Portal
                        key="portal"
                        portals={starSystems}
                        isStargazing={isStargazing}
                        setIsStargazing={setIsStargazing}
                        onSelectStar={handleSelectStar}
                        onOpenChamber={handleOpenChamber}
                    />
                ) : (
                    <StarSystemDetail
                        key={selectedStar.id}
                        star={selectedStar}
                        onBack={handleBackToPortal}
                        onGenerateVision={handleGenerateVision}
                        onAnimateVision={handleAnimateVision}
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {activeChamber === 'vision-weaver' && (
                    <VisionWeaver onClose={handleCloseChamber} />
                )}
                {activeChamber === 'celestial-forge' && (
                    <CelestialForge
                        initialPrompt={chamberInitialPrompt}
                        contextStar={contextStar}
                        onLinkImage={handleLinkImageToStar}
                        onClose={handleCloseChamber}
                    />
                )}
                {activeChamber === 'stellar-animator' && (
                    <StellarAnimator
                        contextStar={contextStar}
                        onLinkVideo={handleLinkVideoToStar}
                        onClose={handleCloseChamber}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sanctuary;
