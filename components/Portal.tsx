import React from 'react';
import { motion } from 'framer-motion';
import { StarSystem, ActiveChamber } from '../types';
import { SparklesIcon, NebulaIcon, StarIcon, FilmStarIcon } from './Icons';

type ThemeName = 'pleiaden' | 'arcturus' | 'sirius' | 'lyra' | 'andromeda' | 'orion' | 'zeta-reticuli' | 'polaris';

// Simplified theme, as the glow is now handled by the animation classes
const themes: Record<ThemeName, { className: string; }> = {
  pleiaden: { className: 'text-blue-300' },
  arcturus: { className: 'text-orange-300' },
  sirius: { className: 'text-cyan-200' },
  lyra: { className: 'text-purple-300' },
  andromeda: { className: 'text-indigo-200' },
  orion: { className: 'text-indigo-200' },
  'zeta-reticuli': { className: 'text-teal-200' },
  polaris: { className: 'text-yellow-100' },
};

const getAnimationClass = (theme: ThemeName) => {
    switch(theme) {
        case 'andromeda': return 'animate-spin-and-pulse';
        case 'sirius':
        case 'orion': 
        case 'polaris':
            return 'animate-twinkle';
        default: return 'animate-soft-pulse';
    }
}

interface PortalProps {
  portals: StarSystem[];
  isStargazing: boolean;
  setIsStargazing: (isStargazing: boolean) => void;
  onSelectStar: (star: StarSystem) => void;
  onOpenChamber: (chamber: ActiveChamber) => void;
}

const Portal: React.FC<PortalProps> = ({ portals, isStargazing, setIsStargazing, onSelectStar, onOpenChamber }) => {
  const polarisPortal = portals.find(p => p.id === 'polaris');
  const orbitingPortals = portals.filter(p => p.id !== 'polaris');
  const numSystems = orbitingPortals.length;
  
  const radiusX = 350; 
  const radiusY = 220;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full h-full flex flex-col items-center justify-center p-8 relative"
    >
        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-4">
            <button onClick={() => setIsStargazing(!isStargazing)} className="text-gray-400 hover:text-white transition-colors" title="Stargazing Mode">
                <StarIcon className="w-7 h-7" fill={isStargazing ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => onOpenChamber('vision-weaver')} className="text-gray-400 hover:text-white transition-colors" title="Vision Weaver">
                <SparklesIcon className="w-7 h-7" />
            </button>
            <button onClick={() => onOpenChamber('celestial-forge')} className="text-gray-400 hover:text-white transition-colors" title="Celestial Forge">
                <NebulaIcon className="w-7 h-7" />
            </button>
            <button onClick={() => onOpenChamber('stellar-animator')} className="text-gray-400 hover:text-white transition-colors" title="Stellar Animator">
                <FilmStarIcon className="w-7 h-7" />
            </button>
        </div>

      <div className="text-center mb-16 transition-opacity duration-700" style={{ opacity: isStargazing ? 0 : 1 }}>
        <h1 className="font-display text-4xl md:text-5xl text-white font-light tracking-wider">
          The Sanctuary of Remembrance
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300 font-light">
          Select a star system to explore its frequency.
        </p>
      </div>

      <div className="relative w-full max-w-5xl min-h-[500px] flex items-center justify-center">
        {/* Render Orbiting Portals */}
        {orbitingPortals.map((star, index) => {
           const angle = (index / numSystems) * 2 * Math.PI - Math.PI / 2; // Start from top
           const x = radiusX * Math.cos(angle);
           const y = radiusY * Math.sin(angle);
           const theme = themes[star.theme];
           const animationClass = getAnimationClass(star.theme);

          return (
          <motion.div
            key={star.id}
            className="absolute"
            style={{
                top: '50%',
                left: '50%',
                x: `${x}px`,
                y: `${y}px`,
                translateX: '-50%',
                translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={() => onSelectStar(star)}
              className="relative flex flex-col items-center text-center cursor-pointer focus:outline-none group"
            >
              <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${theme.className} ${animationClass} ${isStargazing ? 'brightness-175 scale-115' : ''}`}>
                  <div className="absolute inset-2 rounded-full bg-gradient-radial from-white/80 to-transparent blur-sm"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full blur-md"></div>
              </div>
              <div className="mt-4 text-center h-10 flex items-center">
                 <span className={`text-sm text-center text-gray-300 font-display transition-all duration-300 ${isStargazing ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    {star.label}
                 </span>
              </div>
            </button>
          </motion.div>
        )})}

        {/* Render Central Portal (Polaris) */}
        {polarisPortal && (
             <motion.div
                key={polarisPortal.id}
                className="absolute"
                 style={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
             >
                 <button
                    onClick={() => onSelectStar(polarisPortal)}
                    className="relative flex flex-col items-center text-center cursor-pointer focus:outline-none group"
                 >
                    <div className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 ${themes[polarisPortal.theme].className} ${getAnimationClass(polarisPortal.theme)} ${isStargazing ? 'brightness-200 scale-125' : ''}`}>
                        <div className="absolute inset-3 rounded-full bg-gradient-radial from-white/90 to-transparent blur-md"></div>
                        <div className="absolute w-6 h-6 bg-white rounded-full blur-lg"></div>
                    </div>
                     <div className="mt-4 text-center h-10 flex items-center">
                         <span className={`text-sm text-center text-gray-300 font-display transition-all duration-300 ${isStargazing ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                            {polarisPortal.label}
                         </span>
                     </div>
                 </button>
             </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Portal;