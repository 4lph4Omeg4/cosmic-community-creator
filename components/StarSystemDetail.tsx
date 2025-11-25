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
  const [selectedView, setSelectedView] = useState<'main' | 'gallery' | 'video'>('main');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const hasMultipleImages = star.images && star.images.length > 1;
  const hasVideo = !!star.video;
  const images = star.images || (star.image ? [star.image] : []);

  return (
    <motion.div
      key={star.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0 z-40 flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full h-full max-w-5xl max-h-[90vh] bg-black/50 backdrop-blur-lg border border-gray-500/30 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Media Section */}
        <div className="md:w-1/2 h-1/3 md:h-full relative overflow-hidden bg-black flex flex-col">
          {/* View Tabs */}
          {(hasMultipleImages || hasVideo) && (
            <div className="absolute top-4 left-4 z-30 flex gap-2">
              <button
                onClick={() => setSelectedView('main')}
                className={`px-3 py-1 text-xs rounded-full backdrop-blur-sm transition-all ${selectedView === 'main'
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-black/30 text-gray-400 border border-gray-600/30'
                  }`}
              >
                Main
              </button>
              {hasMultipleImages && (
                <button
                  onClick={() => setSelectedView('gallery')}
                  className={`px-3 py-1 text-xs rounded-full backdrop-blur-sm transition-all ${selectedView === 'gallery'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-black/30 text-gray-400 border border-gray-600/30'
                    }`}
                >
                  Gallery ({images.length})
                </button>
              )}
              {hasVideo && (
                <button
                  onClick={() => setSelectedView('video')}
                  className={`px-3 py-1 text-xs rounded-full backdrop-blur-sm transition-all ${selectedView === 'video'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-black/30 text-gray-400 border border-gray-600/30'
                    }`}
                >
                  Video
                </button>
              )}
            </div>
          )}

          {/* Main Image View */}
          {selectedView === 'main' && (
            <>
              {!imageError && star.image ? (
                <motion.img
                  key={`main-${star.image}`}
                  src={star.image}
                  alt={star.label}
                  className="absolute inset-0 w-full h-full object-contain md:object-cover"
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
            </>
          )}

          {/* Gallery View */}
          {selectedView === 'gallery' && hasMultipleImages && (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 relative">
                {images[selectedImageIndex] && (
                  <motion.img
                    key={`gallery-${selectedImageIndex}`}
                    src={images[selectedImageIndex]}
                    alt={`${star.label} - Image ${selectedImageIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-black/50">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                        ? 'border-white scale-110'
                        : 'border-gray-600 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video View */}
          {selectedView === 'video' && hasVideo && (
            <div className="w-full h-full flex items-center justify-center">
              <video
                src={star.video}
                controls
                className="max-w-full max-h-full"
                autoPlay
                loop
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent pointer-events-none"></div>
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
