import React, { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { editImageWithPrompt } from '../services/geminiService';
import { XIcon, SparklesIcon } from './Icons';

interface VisionWeaverProps {
    onClose: () => void;
}

const VisionWeaver: React.FC<VisionWeaverProps> = ({ onClose }) => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalPreview, setOriginalPreview] = useState<string | null>(null);
    const [editedPreview, setEditedPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError("Only image files can be woven.");
                return;
            }
            setOriginalFile(file);
            setEditedPreview(null);
            setError('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWeave = async () => {
        if (!originalFile || !prompt.trim()) {
            setError('Please provide a source image and a creative prompt.');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const resultBase64 = await editImageWithPrompt(originalFile, prompt);
            setEditedPreview(`data:${originalFile.type};base64,${resultBase64}`);
        } catch (e: any) {
            setError(e.message || 'An unknown error occurred during the weaving process.');
        } finally {
            setIsLoading(false);
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
                className="w-[90vw] max-w-4xl h-[90vh] bg-black/70 backdrop-blur-xl border border-purple-300/20 rounded-2xl shadow-2xl shadow-purple-900/50 flex flex-col"
            >
                <div className="flex-shrink-0 p-4 border-b border-purple-300/20 flex justify-between items-center">
                    <h2 className="font-display text-2xl text-purple-200 flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6" /> Vision Weaver
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto flex flex-col md:flex-row gap-6">
                    {/* Left Column: Upload & Original */}
                    <div className="md:w-1/2 flex flex-col gap-4">
                        <h3 className="font-display text-xl text-purple-200">1. Source Image</h3>
                        <div className="flex-grow flex flex-col items-center justify-center p-4 border-2 border-dashed border-purple-300/30 rounded-lg bg-black/20">
                            {originalPreview ? (
                                <img src={originalPreview} alt="Original" className="max-h-64 w-auto rounded-md object-contain" />
                            ) : (
                                <p className="text-purple-200">Awaiting a vision...</p>
                            )}
                            <input
                                type="file"
                                id="vision-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="vision-upload" className="mt-4 cursor-pointer px-4 py-2 bg-purple-600/30 text-purple-100 rounded-full hover:bg-purple-600/50 transition-colors">
                                {originalFile ? 'Change Image' : 'Select Image'}
                            </label>
                        </div>
                        <h3 className="font-display text-xl text-purple-200">2. Weave Your Intent</h3>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Make it look like a dream', 'Add swirling galaxies in the background', 'Apply a retro, faded filter'..."
                            className="w-full h-24 bg-transparent border border-purple-300/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all resize-none"
                        />
                        <button
                            onClick={handleWeave}
                            disabled={isLoading || !originalFile}
                            className="w-full mt-2 py-3 bg-purple-600 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Weaving...' : 'Weave New Vision'}
                        </button>
                    </div>

                    {/* Right Column: Result */}
                    <div className="md:w-1/2 flex flex-col gap-4">
                       <h3 className="font-display text-xl text-purple-200">3. Woven Vision</h3>
                        <div className="flex-grow flex flex-col items-center justify-center p-4 border border-purple-300/30 rounded-lg bg-black/20">
                           {isLoading && (
                                <div className="flex flex-col justify-center items-center gap-2 text-purple-200">
                                    <SparklesIcon className="w-8 h-8 animate-pulse"/>
                                    <span className="mt-2">The loom of light is active...</span>
                                </div>
                           )}
                           {!isLoading && editedPreview && (
                                <img src={editedPreview} alt="Edited" className="max-h-[80vh] md:max-h-full w-auto rounded-md object-contain" />
                           )}
                           {!isLoading && !editedPreview && (
                               <p className="text-gray-500 text-center">Your new reality will manifest here.</p>
                           )}
                        </div>
                    </div>
                </div>
                 {error && (
                    <div className="flex-shrink-0 p-4 border-t border-purple-300/20 text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                 )}
            </div>
        </motion.div>
    );
};

export default VisionWeaver;