import React, { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { decodeSymbolicMessage } from '../services/geminiService';
import { XIcon } from './Icons';

interface TransmissionHubProps {
    onClose: () => void;
}

const TransmissionHub: React.FC<TransmissionHubProps> = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [interpretation, setInterpretation] = useState<string>('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert("Only symbolic images can be decoded at this time.");
                return;
            }
            setSelectedFile(file);
            setInterpretation('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDecode = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setInterpretation('');
        try {
            const result = await decodeSymbolicMessage(selectedFile);
            setInterpretation(result);
        } catch (error) {
            console.error(error);
            setInterpretation('A veil of static obscures the message. The transmission could not be received.');
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
            className="w-[90vw] max-w-2xl bg-black/50 backdrop-blur-xl border border-cyan-300/20 rounded-2xl shadow-2xl shadow-cyan-900/50 flex flex-col"
        >
            <div className="flex-shrink-0 p-4 border-b border-cyan-300/20 flex justify-between items-center">
                <h2 className="font-display text-2xl text-cyan-200">Transmission Hub</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                <div className="text-center">
                    <p className="text-gray-300">Upload a symbolic message, sigil, or light language script for energetic interpretation.</p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-cyan-300/30 rounded-lg">
                    {preview ? (
                        <img src={preview} alt="Selected symbol" className="max-h-48 w-auto rounded-md object-contain" />
                    ) : (
                        <p className="text-cyan-200">Awaiting Transmission...</p>
                    )}
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="mt-4 cursor-pointer px-4 py-2 bg-cyan-600/30 text-cyan-100 rounded-full hover:bg-cyan-600/50 transition-colors">
                        Select a Symbol
                    </label>
                </div>

                {selectedFile && (
                    <div className="text-center">
                        <button
                            onClick={handleDecode}
                            disabled={isLoading}
                            className="px-6 py-2 bg-cyan-500 text-black rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors"
                        >
                            {isLoading ? 'Decoding...' : 'Decode Transmission'}
                        </button>
                    </div>
                )}

                {isLoading && (
                     <div className="flex justify-center items-center gap-2 text-cyan-200">
                        <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse delay-300"></span>
                        <span className="ml-2">Receiving...</span>
                    </div>
                )}

                {interpretation && (
                    <div className="p-4 bg-black/30 rounded-lg border border-cyan-300/20">
                        <h3 className="font-display text-lg text-cyan-200 mb-2">Interpretation:</h3>
                        <p className="text-gray-200 whitespace-pre-wrap">{interpretation}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TransmissionHub;