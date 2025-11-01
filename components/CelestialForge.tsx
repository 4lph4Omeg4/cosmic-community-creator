import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateImageWithImagen } from '../services/geminiService';
import { XIcon, SparklesIcon } from './Icons';
import { StarSystem } from '../types';

interface CelestialForgeProps {
    initialPrompt?: string;
    contextStar: StarSystem | null;
    onLinkImage: (newImage: string) => void;
    onClose: () => void;
}

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const CelestialForge: React.FC<CelestialForgeProps> = ({ initialPrompt = '', contextStar, onLinkImage, onClose }) => {
    const [prompt, setPrompt] = useState<string>(initialPrompt);
    const [aspectRatio, setAspectRatio] = useState<string>('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [hasApiKey, setHasApiKey] = useState(false);
    
    useEffect(() => {
        setPrompt(initialPrompt);
    }, [initialPrompt]);

    useEffect(() => {
        const checkKey = async () => {
            // Check if running in AI Studio
            if (window.aistudio?.hasSelectedApiKey) {
                const keySelected = await window.aistudio.hasSelectedApiKey();
                setHasApiKey(keySelected);
            } else {
                // Running locally - check if API key is in environment
                const hasEnvKey = !!process.env.API_KEY && process.env.API_KEY !== 'undefined';
                setHasApiKey(hasEnvKey);
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio?.openSelectKey) {
            // Running in AI Studio
            await window.aistudio.openSelectKey();
            setHasApiKey(true);
        } else {
            // Running locally - show message about environment variable
            setError("Please set GEMINI_API_KEY in your .env.local or docker.env file and restart the dev server.");
        }
    };

    const handleForge = async () => {
        if (!prompt.trim()) {
            setError('A prompt is required to forge a vision from the cosmos.');
            return;
        }

        // Check for API key (AI Studio or environment)
        let hasKey = false;
        if (window.aistudio?.hasSelectedApiKey) {
            hasKey = await window.aistudio.hasSelectedApiKey();
        } else {
            hasKey = !!process.env.API_KEY && process.env.API_KEY !== 'undefined';
        }
        
        if (!hasKey) {
            setHasApiKey(false);
            setError("An API key is required for image generation.");
            return;
        }
        setHasApiKey(true);

        setIsLoading(true);
        setError('');
        setGeneratedImage(null);
        try {
            const resultBase64 = await generateImageWithImagen(prompt, aspectRatio);
            setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
        } catch (e: any) {
             if (e.message?.includes("Requested entity was not found")) {
                setError("Your API key is invalid. Please select a valid key.");
                setHasApiKey(false);
            } else {
                setError(e.message || 'A cosmic storm interfered with the forging process.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLinkVision = () => {
        console.log('Link Vision button clicked');
        console.log('generatedImage available:', !!generatedImage);
        console.log('onLinkImage available:', !!onLinkImage);
        console.log('contextStar:', contextStar?.id, contextStar?.label);
        
        if (generatedImage && onLinkImage) {
            console.log('Calling onLinkImage with generated image');
            try {
                onLinkImage(generatedImage);
                console.log('onLinkImage called successfully');
            } catch (err) {
                console.error('Error calling onLinkImage:', err);
                setError('Failed to save image. Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        } else {
            console.error('Cannot link image:', {
                generatedImage: !!generatedImage,
                onLinkImage: !!onLinkImage
            });
            setError('Cannot save image. Missing required data.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="w-[90vw] max-w-4xl h-[90vh] bg-black/70 backdrop-blur-xl border border-indigo-300/20 rounded-2xl shadow-2xl shadow-indigo-900/50 flex flex-col"
            >
                <div className="flex-shrink-0 p-4 border-b border-indigo-300/20 flex justify-between items-center">
                    <h2 className="font-display text-2xl text-indigo-200 flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6" /> Celestial Forge
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto flex flex-col md:flex-row gap-6">
                    {/* Left Column: Controls */}
                    <div className="md:w-1/2 flex flex-col gap-4">
                        <h3 className="font-display text-xl text-indigo-200">1. Describe Your Vision</h3>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'A luminous crystal city on a floating island', 'A bioluminescent forest under two moons', 'A majestic phoenix soaring through a nebula'..."
                            className="w-full flex-grow bg-transparent border border-indigo-300/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all resize-none"
                        />
                        
                        <h3 className="font-display text-xl text-indigo-200">2. Set the Canvas</h3>
                        <div className="flex flex-wrap gap-2">
                            {aspectRatios.map((ar) => (
                                <button
                                    key={ar}
                                    onClick={() => setAspectRatio(ar)}
                                    className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                                        aspectRatio === ar
                                        ? 'bg-indigo-400 text-white border-indigo-400'
                                        : 'bg-transparent text-indigo-200 border-indigo-300/40 hover:bg-indigo-400/20'
                                    }`}
                                >
                                    {ar}
                                </button>
                            ))}
                        </div>

                        {!hasApiKey ? (
                             <div className="mt-auto text-center p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                                <p className="text-indigo-200">Image generation requires an API key.</p>
                                 <button onClick={handleSelectKey} className="mt-2 font-semibold text-white bg-indigo-500 rounded-full px-4 py-2 hover:bg-indigo-400 transition-colors">Select API Key</button>
                                 <p className="text-xs text-indigo-300/70 mt-2">For more information on billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">ai.google.dev</a>.</p>
                             </div>
                         ) : (
                            <button
                                onClick={handleForge}
                                disabled={isLoading}
                                className="w-full mt-auto py-3 bg-indigo-500 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Forging...' : 'Forge Vision'}
                            </button>
                         )}
                    </div>

                    {/* Right Column: Result */}
                    <div className="md:w-1/2 flex flex-col gap-4">
                       <h3 className="font-display text-xl text-indigo-200">3. Forged Vision</h3>
                        <div className="flex-grow flex flex-col items-center justify-center p-4 border border-indigo-300/30 rounded-lg bg-black/20">
                           {isLoading && (
                                <div className="flex flex-col justify-center items-center gap-2 text-indigo-200">
                                    <SparklesIcon className="w-8 h-8 animate-pulse"/>
                                    <span className="mt-2">Gathering starlight...</span>
                                </div>
                           )}
                           {!isLoading && generatedImage && (
                                <img src={generatedImage} alt="Generated vision" className="max-h-[80vh] md:max-h-full w-auto rounded-md object-contain" />
                           )}
                           {!isLoading && !generatedImage && (
                               <p className="text-gray-500 text-center">Your vision will appear here.</p>
                           )}
                        </div>
                        {generatedImage && (
                           <button
                               onClick={handleLinkVision}
                               className={`w-full mt-2 py-2 rounded-full font-semibold transition-colors ${
                                   contextStar 
                                       ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                                       : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                               }`}
                           >
                               {contextStar ? `Link Vision to ${contextStar.label}` : 'Select a star to save this vision'}
                           </button>
                        )}
                    </div>
                </div>
                 {error && (
                    <div className="flex-shrink-0 p-4 border-t border-indigo-300/20 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                 )}
            </div>
        </motion.div>
    );
};

export default CelestialForge;