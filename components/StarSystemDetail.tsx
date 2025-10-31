// This file was created to resolve a module not found error.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarSystem } from '../types';

interface StarSystemDetailProps {
  star: StarSystem;
  onBack: () => void;
  onGenerateVision: (star: StarSystem) => void;
  onAnimateVision: (star: StarSystem) => void;
}

const StarSystemDetail: React.FC<StarSystemDetailProps> = ({ star, onBack, onGenerateVision, onAnimateVision }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      key={star.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0 z-20 flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full h-full max-w-5xl max-h-[90vh] bg-black/50 backdrop-blur-lg border border-gray-500/30 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Image Section */}
        <div className="md:w-1/2 h-1/3 md:h-full relative overflow-hidden bg-black">
          {!imageError ? (
            <motion.img
              src={star.image}
              alt={star.label}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-display">
              Visual frequency could not be resolved.
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 h-2/3 md:h-full flex flex-col p-6 md:p-8 overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h1 className="font-display text-4xl md:text-5xl text-white font-light">{star.label}</h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 italic font-display">{star.lore}</p>
          </motion.div>
          
          <div className="w-16 h-px bg-gray-600 my-6"></div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex-grow">
            <p className="text-gray-200 leading-relaxed font-light whitespace-pre-wrap">{star.details}</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-6 flex-shrink-0 flex flex-wrap items-center gap-4">
            <button
              onClick={onBack}
              className="font-display text-lg px-6 py-2 border border-gray-400 text-gray-200 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              Return
            </button>
            <button
              onClick={() => onGenerateVision(star)}
              className="font-display text-lg px-6 py-2 border border-indigo-400 text-indigo-200 rounded-full backdrop-blur-sm bg-indigo-500/10 hover:bg-indigo-500/20 transition-all duration-300"
            >
              Channel Vision
            </button>
             <button
              onClick={() => onAnimateVision(star)}
              className="font-display text-lg px-6 py-2 border border-teal-400 text-teal-200 rounded-full backdrop-blur-sm bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-300"
            >
              Animate Vision
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StarSystemDetail;
