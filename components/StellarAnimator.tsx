import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { initiateVideoGeneration, pollVideoOperation } from '../services/geminiService';
import { XIcon, FilmStarIcon } from './Icons';
import { StarSystem } from '../types';

// FIX: Corrected the global type declaration for `window.aistudio` to use a named `AIStudio` interface. This resolves the "Subsequent property declarations must have the same type" error by making the type declaration consistent across the application.
// Extend the Window interface to include aistudio for TypeScript
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }
    interface Window {
        aistudio?: AIStudio;
    }
}

interface StellarAnimatorProps {
    contextStar: StarSystem | null;
    onClose: () => void;
}

type GenerationStatus = 'idle' | 'checking_key' | 'generating' | 'polling' | 'success' | 'error';

const loadingMessages = [
    "Aligning cosmic frequencies...",
    "Gathering starlight...",
    "Weaving temporal threads...",
    "Synchronizing realities...",
    "Manifesting the vision...",
    "The animation is almost complete...",
];

const StellarAnimator: React.FC<StellarAnimatorProps> = ({ contextStar, onClose }) => {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [sourcePreview, setSourcePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');
    const [status, setStatus] = useState<GenerationStatus>('idle');
    const [error, setError] = useState<string>('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

    const operationRef = useRef<any>(null);
    const pollingIntervalRef = useRef<number | null>(null);
    const messageIntervalRef = useRef<number | null>(null);

    // Pre-load image from context star
    useEffect(() => {
        if (contextStar?.image) {
            setSourcePreview(contextStar.image);
            // Convert URL to File object
            fetch(contextStar.image)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `${contextStar.id}.jpg`, { type: blob.type });
                    setSourceFile(file);
                });
            setPrompt(`The being from ${contextStar.label} comes to life. ${contextStar.lore}`);
        }
    }, [contextStar]);
    
    // Check for API key on mount
    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio?.hasSelectedApiKey) {
                const keySelected = await window.aistudio.hasSelectedApiKey();
                setHasApiKey(keySelected);
            }
        };
        checkKey();

        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
        }
    }, []);

    // Polling logic
    useEffect(() => {
        if (status === 'polling' && operationRef.current) {
            pollingIntervalRef.current = window.setInterval(async () => {
                try {
                    const updatedOp = await pollVideoOperation(operationRef.current);
                    operationRef.current = updatedOp;

                    if (updatedOp.done) {
                        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                        if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
                        
                        const uri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                        if (uri) {
                            const videoResponse = await fetch(`${uri}&key=${process.env.API_KEY}`);
                            const videoBlob = await videoResponse.blob();
                            setVideoUrl(URL.createObjectURL(videoBlob));
                            setStatus('success');
                        } else {
                           throw new Error(updatedOp.error?.message || "Generation finished but no video was found.");
                        }
                    }
                } catch (e: any) {
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                    if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
                    setError(e.message || 'Failed to poll video status.');
                    setStatus('error');
                }
            }, 10000); // Poll every 10 seconds

             // Cycle through loading messages
            let messageIndex = 0;
            messageIntervalRef.current = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[messageIndex]);
            }, 5000);

        }
        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
        };
    }, [status]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSourceFile(file);
            setSourcePreview(URL.createObjectURL(file));
        }
    };
    
    const handleSelectKey = async () => {
        if (window.aistudio?.openSelectKey) {
            await window.aistudio.openSelectKey();
            // Assume success to avoid race conditions and re-check on next action
            setHasApiKey(true);
        }
    };

    const handleAnimate = async () => {
        if (!sourceFile) {
            setError('Please provide a source image.');
            return;
        }
        
        // Final API key check before generation
        const keySelected = await window.aistudio?.hasSelectedApiKey();
        if (!keySelected) {
            setHasApiKey(false);
            setError("An API key is required for video generation.");
            return;
        }
        setHasApiKey(true);

        setStatus('generating');
        setError('');
        setVideoUrl(null);

        try {
            const operation = await initiateVideoGeneration(sourceFile, prompt, aspectRatio);
            operationRef.current = operation;
            setStatus('polling');
        } catch (e: any) {
            if (e.message?.includes("Requested entity was not found")) {
                setError("Your API key is invalid. Please select a valid key.");
                setHasApiKey(false);
            } else {
                setError(e.message || 'Failed to start video generation.');
            }
            setStatus('error');
        }
    };

    const renderContent = () => {
        if (status === 'generating' || status === 'polling') {
            return (
                <div className="flex flex-col justify-center items-center h-full text-center">
                    <FilmStarIcon className="w-12 h-12 text-teal-300 animate-pulse"/>
                    <p className="mt-4 font-display text-2xl text-teal-200">{loadingMessage}</p>
                    <p className="mt-2 text-gray-400">Video generation can take a few minutes. Please be patient.</p>
                </div>
            )
        }
        
        if (status === 'success' && videoUrl) {
            return (
                 <div className="flex flex-col items-center justify-center h-full">
                    <video src={videoUrl} controls autoPlay loop className="max-h-full w-auto rounded-lg" />
                     <button onClick={() => setStatus('idle')} className="mt-4 font-display text-lg px-6 py-2 border border-gray-400 text-gray-200 rounded-full hover:bg-white/10 transition-all">
                        Create Another
                    </button>
                </div>
            )
        }

        return (
            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Left Column: Controls */}
                <div className="md:w-1/2 flex flex-col gap-4">
                    <h3 className="font-display text-xl text-teal-200">1. Source Image</h3>
                    <div className="flex-grow flex flex-col items-center justify-center p-4 border-2 border-dashed border-teal-300/30 rounded-lg bg-black/20">
                        {sourcePreview ? (
                            <img src={sourcePreview} alt="Source" className="max-h-64 w-auto rounded-md object-contain" />
                        ) : (
                            <p className="text-teal-200">Awaiting an image...</p>
                        )}
                         <input type="file" id="video-source-upload" className="hidden" accept="image/*" onChange={handleFileChange}/>
                         <label htmlFor="video-source-upload" className="mt-4 cursor-pointer px-4 py-2 bg-teal-600/30 text-teal-100 rounded-full hover:bg-teal-600/50 transition-colors">
                            {sourceFile ? 'Change Image' : 'Select Image'}
                         </label>
                    </div>
                </div>

                {/* Right Column: Prompt & Settings */}
                <div className="md:w-1/2 flex flex-col gap-4">
                     <h3 className="font-display text-xl text-teal-200">2. Describe the Animation</h3>
                     <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'The being slowly opens its eyes, and the stars behind it begin to drift'..."
                        className="w-full flex-grow bg-transparent border border-teal-300/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50 transition-all resize-none"
                    />
                     <h3 className="font-display text-xl text-teal-200">3. Set Aspect Ratio</h3>
                     <div className="flex gap-2">
                         {['16:9', '9:16'].map(ar => (
                             <button key={ar} onClick={() => setAspectRatio(ar)}
                                className={`px-4 py-2 text-sm rounded-full border transition-colors ${aspectRatio === ar ? 'bg-teal-400 text-black border-teal-400' : 'bg-transparent text-teal-200 border-teal-300/40 hover:bg-teal-400/20'}`}>
                                 {ar}
                             </button>
                         ))}
                     </div>
                     {!hasApiKey ? (
                         <div className="mt-auto text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <p className="text-amber-200">Video generation requires an API key.</p>
                             <button onClick={handleSelectKey} className="mt-2 font-semibold text-black bg-amber-400 rounded-full px-4 py-2 hover:bg-amber-300 transition-colors">Select API Key</button>
                             <p className="text-xs text-amber-300/70 mt-2">For more information on billing, visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">ai.google.dev</a>.</p>
                         </div>
                     ) : (
                         <button onClick={handleAnimate} disabled={!sourceFile}
                            className="w-full mt-auto py-3 bg-teal-500 text-black rounded-full font-bold disabled:opacity-50 hover:bg-teal-400 transition-colors">
                            Animate Vision
                        </button>
                     )}
                </div>
            </div>
        )
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={onClose}
        >
            <div onClick={(e) => e.stopPropagation()}
                className="w-[90vw] max-w-5xl h-[90vh] bg-black/80 backdrop-blur-xl border border-teal-300/20 rounded-2xl shadow-2xl shadow-teal-900/50 flex flex-col"
            >
                <div className="flex-shrink-0 p-4 border-b border-teal-300/20 flex justify-between items-center">
                    <h2 className="font-display text-2xl text-teal-200 flex items-center gap-2">
                       <FilmStarIcon className="w-6 h-6" /> Stellar Animator
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto">
                    {renderContent()}
                </div>
                {error && (
                    <div className="flex-shrink-0 p-3 border-t border-teal-300/20 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StellarAnimator;