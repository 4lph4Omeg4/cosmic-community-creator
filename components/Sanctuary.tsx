import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StarSystem, ActiveChamber } from '../types';
import Portal from './Portal';
import StarSystemDetail from './StarSystemDetail';
import VisionWeaver from './VisionWeaver';
import CelestialForge from './CelestialForge';
import StellarAnimator from './StellarAnimator';
import UniversalOracle from './UniversalOracle';
import { videoStorage } from '../services/videoStorage';
import { imageStorage } from '../services/imageStorage';
import { LogoutIcon } from './Icons';

const initialPortalsData: StarSystem[] = [
    {
        id: 'polaris',
        label: 'Polaris',
        theme: 'polaris',
        lore: 'The Still Point of the Turning Cosmos',
        details: 'Polaris, the North Star, serves as a celestial anchor in the vast expanse of the cosmos. Its frequency is one of unwavering guidance, stability, and purpose—a constant beacon in a universe of perpetual flux. For millennia, travelers and seekers have looked to Polaris to find their true north, both literally and metaphorically.\n\nThis brilliant star acts as a reminder of the unshakable core within each being, a point of stillness around which all chaos and transformation revolves. Meditating on Polaris helps one to find their true direction, navigate life\'s complexities with clarity, and remain centered amidst the swirling currents of existence.\n\nIt teaches that even in the most turbulent times, there exists an immutable center from which all movement originates and to which all paths ultimately return.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/polaris.jpeg',
    },
    {
        id: 'sirius',
        label: 'Sirius',
        theme: 'sirius',
        lore: 'The Gateway of Liberation and the Brightest Light of Awakening',
        details: 'Sirius, the brightest star in Earth\'s night sky, radiates a frequency of freedom, spiritual evolution, and advanced knowledge that has shaped human consciousness for thousands of years. Known to the ancient Egyptians as Sopdet, Sirius held profound significance in their cosmology, marking the flooding of the Nile and symbolizing rebirth and renewal. The star\'s heliacal rising was celebrated as a moment of cosmic alignment, bringing transformative energies to Earth.\n\nThe Dogon people of Mali preserved an extraordinary understanding of Sirius, speaking of its companion star (Sirius B) long before modern astronomy confirmed its existence—knowledge that suggests ancient contact with beings from this star system. Sirius is associated with great teachers and civilizations who brought profound wisdom to Earth, serving as a gateway for advanced knowledge and spiritual liberation.\n\nThe intense light of Sirius represents the brilliant illumination of consciousness, awakening latent abilities and revealing deeper truths about the nature of reality. Connecting with Sirius can accelerate personal growth, unlock hidden potentials, and facilitate a direct experience of the divine intelligence that permeates all existence.\n\nIt is the star of the awakened ones, those who choose to step fully into their sovereignty and become conscious co-creators of their reality.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/sirius.jpeg',
    },
    {
        id: 'pleiaden',
        label: 'Pleiades',
        theme: 'pleiaden',
        lore: 'The Cradle of Unconditional Love and Cosmic Family',
        details: 'The Pleiades star cluster, known as the Seven Sisters, emanates a gentle, nurturing frequency of love, compassion, and unity that has been revered across countless cultures. Many indigenous traditions speak of our origins in the Pleiades, describing it as a home for heart-centered beings dedicated to healing and harmony.\n\nThe soft, shimmering light of these stars carries frequencies that soothe the soul, foster emotional healing, and encourage a deep sense of connection with all life. This energy reminds us of our shared cosmic origins and the fundamental truth that we are all part of one vast, loving family.\n\nThe Pleiades represents the heart of the galaxy, a place where unconditional love flows freely and where beings understand the sacred principle that love is the foundation of all creation. Connecting with the Pleiades helps to heal emotional wounds, open the heart chakra, and experience the profound peace that comes from knowing you are never alone in the universe.\n\nIt teaches that love is not an emotion but a fundamental force of nature, the very fabric from which reality is woven.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/pleiades.jpeg',
    },
    {
        id: 'arcturus',
        label: 'Arcturus',
        theme: 'arcturus',
        lore: 'The Forge of Celestial Healing and Spiritual Technology',
        details: 'Arcturus shines as a beacon of immense healing power and technological advancement, representing the perfect integration of spirit and science. Its frequency is one of renewal, integration, and spiritual technology—offering humanity blueprints for emotional, physical, and energetic healing that transcends conventional understanding.\n\nArcturian consciousness works with light and sound frequencies to restructure energetic fields, repair DNA, and facilitate profound transformations at the cellular level. This star system is home to highly evolved beings who have mastered the art of using consciousness itself as a tool for healing and evolution. The Arcturians are known as master healers and teachers who guide other civilizations through their evolutionary processes.\n\nConnecting with Arcturus can aid in releasing old patterns, trauma, and limiting beliefs while embracing a state of holistic well-being. It teaches that true healing occurs when we align with our highest potential and recognize that the body, mind, and spirit are one integrated system designed for constant renewal and evolution.\n\nThe frequency of Arcturus activates the blueprint of perfect health and vitality that exists within each being, reminding us that we are designed to thrive, not merely survive.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/arcturus.jpeg',
    },
    {
        id: 'lyra',
        label: 'Lyra',
        theme: 'lyra',
        lore: 'The Echo of Cosmic Creation and the Primordial Song',
        details: 'Lyra is believed to be the original source of humanoid consciousness in our galactic sector, the cradle from which many civilizations emerged. Its frequency carries the ancient codes of creation, sound, and the sacred feminine—resonating with the primordial song that first gave birth to form and consciousness.\n\nThe Lyran beings were among the first to explore the mysteries of sound and vibration, understanding that the universe itself is a symphony of frequencies that can be consciously directed to create new realities. This star system resonates with the creative impulse that drives all artistic expression, profound creativity, and the deep connection to the ancient history of the soul.\n\nThe Lyran frequency awakens memories of our original nature as creators, beings who could manifest worlds through intention, sound, and the power of coherent thought. Many who connect with Lyra experience a profound sense of coming home, recognizing this frequency as something deeply familiar, a memory encoded in their very DNA.\n\nIt teaches that we are all artists of reality, capable of shaping our experiences through the harmonious expression of our unique creative gifts. The sacred geometry and mathematical precision found throughout Lyran teachings reflect the underlying structure of creation itself, revealing that beauty, harmony, and divine order are fundamental aspects of existence.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/lyra.jpeg',
    },
    {
        id: 'orion',
        label: 'Orion',
        theme: 'orion',
        lore: 'The Crucible of Duality and the Warrior\'s Path',
        details: 'The Orion constellation holds a complex frequency of duality, struggle, and integration that reflects the eternal dance between light and shadow within the cosmos and within ourselves. This region of space represents the cosmic battlefield where consciousness evolves through challenge, where the warrior learns to integrate opposing forces and find strength in adversity.\n\nOrion teaches lessons of sovereignty, resilience, and the courage to face one\'s shadow without fear. The constellation\'s mythology across cultures often features great heroes and warriors, reflecting its energy of initiation and transformation through trial.\n\nThe Orion frequency challenges us to transcend duality, to recognize that light and dark are not enemies but complementary forces that together create the full spectrum of experience. Connecting with Orion helps integrate opposing forces within oneself—the masculine and feminine, the active and receptive, the individual and the collective.\n\nIt is here that many souls undergo their greatest initiations, learning that true power comes not from domination but from balance, not from resistance but from acceptance. The star system serves as a training ground for those who choose the path of the spiritual warrior, one who fights not against others but for the liberation of all consciousness.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/orion.jpeg',
    },
    {
        id: 'andromeda',
        label: 'Andromeda',
        theme: 'andromeda',
        lore: 'The Weaver of Galactic Consciousness and Unity',
        details: 'The Andromeda Galaxy, our nearest major galactic neighbor, brings a frequency of expansion, interdimensional awareness, and unity consciousness that challenges our limited perspectives and invites us to embrace a broader, galactic identity. This vast spiral galaxy contains billions of stars and countless civilizations, representing the incredible diversity and interconnectedness of life throughout the cosmos.\n\nThe Andromedan frequency fosters a sense of being part of a vast cosmic family, encouraging collaboration on a universal scale and recognizing that every being, every star, every galaxy is part of one great cosmic web of life. Connecting with Andromeda expands consciousness beyond planetary concerns, helping us to see ourselves as galactic citizens participating in a grand cosmic experiment.\n\nThe Andromedans are known as master weavers of reality, beings who understand how to work with the threads of time, space, and consciousness to create harmonious outcomes for all. This frequency teaches that true evolution occurs not through competition but through cooperation, not through separation but through recognizing our fundamental unity.\n\nIt activates the understanding that we are all expressions of one cosmic consciousness, each playing our unique role in the great symphony of existence, and that by working together, we can accomplish what would be impossible alone.',
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

    useEffect(() => {
        // Load saved images and videos from Supabase
        const loadData = async () => {
            try {
                const updatedSystems = await Promise.all(initialPortalsData.map(async (star) => {
                    const starData: StarSystem = { ...star };

                    // Load images from Supabase
                    try {
                        const imageUrls = await imageStorage.getImage(user, star.id);
                        if (imageUrls && imageUrls.length > 0) {
                            starData.images = imageUrls;
                            starData.image = imageUrls[0]; // Use first as main image
                            console.log(`Loaded ${imageUrls.length} images from Supabase for star:`, star.id, star.label);
                        }
                    } catch (err) {
                        console.error('Error loading images from Supabase for star', star.id, ':', err);
                    }

                    // Load video from Supabase
                    try {
                        const videoUrl = await videoStorage.getVideo(user, star.id);
                        if (videoUrl) {
                            starData.video = videoUrl;
                            console.log('Loaded video from Supabase for star:', star.id, star.label);
                        }
                    } catch (err) {
                        console.error('Error loading video from Supabase for star', star.id, ':', err);
                    }

                    return starData;
                }));

                setStarSystems(updatedSystems);
            } catch (err) {
                console.error('Error loading data from Supabase:', err);
                // Fallback: set systems without custom media
                setStarSystems(initialPortalsData);
            }
        };

        loadData();
    }, [user]);

    const handleSelectStar = (star: StarSystem) => {
        setSelectedStar(star);
        // If celestial-forge or stellar-animator is open, also set contextStar
        if (activeChamber === 'celestial-forge' || activeChamber === 'stellar-animator') {
            setContextStar(star);
            contextStarIdRef.current = star.id;
        }
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

    const handleLinkImageToStar = async (newImage: string) => {
        console.log('handleLinkImageToStar called with image length:', newImage.length);

        // Try multiple sources to find the target star
        let targetStar = contextStar || selectedStar;

        // If still no star, try to find it by ID from ref
        if (!targetStar && contextStarIdRef.current) {
            targetStar = starSystems.find(s => s.id === contextStarIdRef.current) || null;
        }

        if (targetStar) {
            console.log('Linking image to star:', targetStar.id, targetStar.label);

            try {
                // Upload image to Supabase Storage
                const imageUrl = await imageStorage.saveImage(user, targetStar.id, newImage);
                console.log('Image uploaded to Supabase:', imageUrl);

                // Reload images from Supabase to get updated list
                const updatedImageUrls = await imageStorage.getImage(user, targetStar.id);

                // Update the state for immediate UI feedback
                const updatedSystems = starSystems.map(s => {
                    if (s.id === targetStar.id) {
                        return {
                            ...s,
                            images: updatedImageUrls,
                            image: updatedImageUrls[0] || s.image // Use first as main image
                        };
                    }
                    return s;
                });
                setStarSystems(updatedSystems);

                // Update the selected star view if it's currently open
                if (selectedStar && selectedStar.id === targetStar.id) {
                    setSelectedStar(prevStar => prevStar ? {
                        ...prevStar,
                        images: updatedImageUrls,
                        image: updatedImageUrls[0] || prevStar.image
                    } : null);
                }
            } catch (err) {
                console.error('Error saving image to Supabase:', err);
                alert('Failed to save image. Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
                return; // Don't close chamber if save failed
            }
        } else {
            console.error('No target star found for linking image');
            console.error('contextStar:', contextStar);
            console.error('selectedStar:', selectedStar);
            console.error('contextStarIdRef.current:', contextStarIdRef.current);
            alert('Cannot save image. No star selected.');
            return; // Don't close chamber if no star found
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
                // Save video to Supabase Storage
                const videoUrl = await videoStorage.saveVideo(user, targetStar.id, videoBlob);
                console.log('Video saved successfully to Supabase:', videoUrl);

                // Update the state for immediate UI feedback
                const updatedSystems = starSystems.map(s =>
                    s.id === targetStar.id ? { ...s, video: videoUrl } : s
                );
                setStarSystems(updatedSystems);

                // Update the selected star view if it's currently open
                if (selectedStar && selectedStar.id === targetStar.id) {
                    setSelectedStar(prevStar => prevStar ? { ...prevStar, video: videoUrl } : null);
                }
            } catch (err) {
                console.error('Error saving video to Supabase:', err);
                alert('Failed to save video. Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        } else {
            console.error('No target star found for linking video');
        }
        handleCloseChamber();
    };


    return (
        <div className="w-full min-h-screen relative">
            <AnimatePresence>
                {!selectedStar ? (
                    <Portal
                        key="portal"
                        portals={starSystems}
                        isStargazing={isStargazing}
                        setIsStargazing={setIsStargazing}
                        onSelectStar={handleSelectStar}
                        onOpenChamber={handleOpenChamber}
                        user={user}
                        onLogout={onLogout}
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
                {activeChamber === 'universal-oracle' && (
                    <UniversalOracle onClose={handleCloseChamber} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sanctuary;
