import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StarSystem, ActiveChamber } from '../types';
import Portal from './Portal';
import StarSystemDetail from './StarSystemDetail';
import VisionWeaver from './VisionWeaver';
import CelestialForge from './CelestialForge';
import StellarAnimator from './StellarAnimator';
import { LogoutIcon } from './Icons';

const initialPortalsData: StarSystem[] = [
    {
        id: 'polaris',
        label: 'Polaris',
        theme: 'polaris',
        lore: 'The Still Point of the Turning Cosmos',
        details: 'Polaris, the North Star, serves as a celestial anchor. Its frequency is one of unwavering guidance, stability, and purpose. It is the constant in a universe of flux, a beacon for lost souls and a reminder of the unshakable core of one\'s being. Meditating on Polaris helps to find one\'s true north and navigate life\'s complexities with clarity.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/polaris.jpeg',
    },
    {
        id: 'sirius',
        label: 'Sirius',
        theme: 'sirius',
        lore: 'The Gateway of Liberation',
        details: 'Sirius, the brightest star in the night sky, radiates a frequency of freedom, spiritual evolution, and advanced knowledge. It is associated with great teachers and civilisations who brought profound wisdom to Earth. Connecting with Sirius can accelerate personal growth, unlock latent abilities, and reveal deeper truths about the nature of reality.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/sirius.jpeg',
    },
    {
        id: 'pleiaden',
        label: 'Pleiades',
        theme: 'pleiaden',
        lore: 'The Cradle of Unconditional Love',
        details: 'The Pleiades star cluster emanates a gentle, nurturing frequency of love, compassion, and unity. It is considered a home for heart-centered beings dedicated to healing and harmony. This energy soothes the soul, fosters emotional healing, and encourages a deep sense of connection with all life, reminding us of our shared cosmic origins.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/pleiades.jpeg',
    },
    {
        id: 'arcturus',
        label: 'Arcturus',
        theme: 'arcturus',
        lore: 'The Forge of Celestial Healing',
        details: 'Arcturus is a star of immense healing power and technological advancement. Its frequency is one of integration, renewal, and spiritual technology. It offers blueprints for emotional and physical healing, using light and sound to restructure energetic fields. Connecting with Arcturus can aid in releasing old patterns and embracing a state of holistic well-being.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/arcturus.jpeg',
    },
    {
        id: 'lyra',
        label: 'Lyra',
        theme: 'lyra',
        lore: 'The Echo of Cosmic Creation',
        details: 'Lyra is believed to be the original source of humanoid consciousness in our galactic sector. Its frequency carries the codes of creation, sound, and the sacred feminine. It resonates with the primordial song of the universe, inspiring artistic expression, profound creativity, and a connection to the ancient history of the soul.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/lyra.jpeg',
    },
    {
        id: 'orion',
        label: 'Orion',
        theme: 'orion',
        lore: 'The Crucible of Duality',
        details: 'The Orion constellation holds a complex frequency of duality, struggle, and integration. It represents the cosmic dance of light and dark, teaching lessons of sovereignty, resilience, and the courage to face one\'s shadow. Connecting with Orion can help integrate opposing forces within oneself and find strength in overcoming challenges.',
        image: 'https://storage.googleapis.com/generative-ai-story/space/orion.jpeg',
    },
    {
        id: 'andromeda',
        label: 'Andromeda',
        theme: 'andromeda',
        lore: 'The Weaver of Galactic Consciousness',
        details: 'The Andromeda Galaxy brings a frequency of expansion, interdimensional awareness, and unity consciousness. It challenges our limited perspectives and invites us to embrace a broader, galactic identity. Connecting with Andromeda fosters a sense of being part of a vast cosmic family and encourages collaboration on a universal scale.',
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
    
    const storageKey = `cosmic-creator-images-${user}`;

    useEffect(() => {
        // Load saved images from local storage for the logged-in user
        const savedImages = localStorage.getItem(storageKey);
        if (savedImages) {
            const userImages = JSON.parse(savedImages);
            const updatedSystems = initialPortalsData.map(star => 
                userImages[star.id] ? { ...star, image: userImages[star.id] } : star
            );
            setStarSystems(updatedSystems);
        } else {
            setStarSystems(initialPortalsData);
        }
    }, [user, storageKey]);

    const handleSelectStar = (star: StarSystem) => {
        setSelectedStar(star);
    };

    const handleBackToPortal = () => {
        setSelectedStar(null);
    };

    const handleOpenChamber = (chamber: ActiveChamber) => {
        setActiveChamber(chamber);
        setContextStar(null); 
        setChamberInitialPrompt('');
    };
    
    const handleCloseChamber = () => {
        setActiveChamber('none');
        setContextStar(null);
        setChamberInitialPrompt('');
    };

    const handleGenerateVision = (star: StarSystem) => {
        setContextStar(star);
        setChamberInitialPrompt(`A vision of a being from the star system ${star.label}, a place known as "${star.lore}". The being embodies the concepts of: ${star.details}`);
        setActiveChamber('celestial-forge');
    };
    
    const handleAnimateVision = (star: StarSystem) => {
        setContextStar(star);
        setActiveChamber('stellar-animator');
    };

    const handleLinkImageToStar = (newImage: string) => {
        if (contextStar) {
            // Update the state for immediate UI feedback
            const updatedSystems = starSystems.map(s =>
                s.id === contextStar.id ? { ...s, image: newImage } : s
            );
            setStarSystems(updatedSystems);

            // Save the new image link to local storage
            const savedImages = JSON.parse(localStorage.getItem(storageKey) || '{}');
            savedImages[contextStar.id] = newImage;
            localStorage.setItem(storageKey, JSON.stringify(savedImages));

            // Update the selected star view if it's currently open
            if (selectedStar && selectedStar.id === contextStar.id) {
                setSelectedStar(prevStar => prevStar ? { ...prevStar, image: newImage } : null);
            }
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
                        onClose={handleCloseChamber}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sanctuary;
