import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './Icons';
import { getOracleResponse } from '../services/geminiService';

interface UniversalOracleProps {
    onClose: () => void;
}

const UniversalOracle: React.FC<UniversalOracleProps> = ({ onClose }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailed, setIsDetailed] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);

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
            alert('Please set your API_KEY in the environment variables to use the Universal Oracle.');
        }
    };

    const handleAskQuestion = async () => {
        if (!question.trim()) {
            return;
        }

        // Check for API key
        let hasKey = false;
        if (window.aistudio?.hasSelectedApiKey) {
            hasKey = await window.aistudio.hasSelectedApiKey();
        } else {
            hasKey = !!process.env.API_KEY && process.env.API_KEY !== 'undefined';
        }

        if (!hasKey) {
            setHasApiKey(false);
            alert("An API key is required for the Oracle to function.");
            return;
        }
        setHasApiKey(true);

        setIsLoading(true);
        setAnswer('');
        
        try {
            const response = await getOracleResponse(question, isDetailed);
            setAnswer(response);
        } catch (error: any) {
            console.error('Error getting oracle response:', error);
            if (error.message?.includes("Requested entity was not found")) {
                setAnswer("Your API key is invalid. Please select a valid key.");
                setHasApiKey(false);
            } else {
                setAnswer("The cosmic frequencies are disrupted. The Oracle cannot reach through the veil at this moment. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleAskQuestion();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-3xl max-h-[90vh] bg-black/90 backdrop-blur-lg border border-gray-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
                        <div>
                            <h2 className="font-display text-2xl md:text-3xl text-white font-light">
                                Universal Oracle
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Ask your question to the cosmos
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors p-2"
                            title="Close"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* API Key Check */}
                        {!hasApiKey && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <p className="text-yellow-200 text-sm mb-3">
                                    An API key is required to consult the Oracle.
                                </p>
                                <button
                                    onClick={handleSelectKey}
                                    className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-200 transition-colors"
                                >
                                    Select API Key
                                </button>
                            </div>
                        )}

                        {/* Question Input */}
                        <div className="space-y-2">
                            <label className="block text-sm text-gray-300 font-light">
                                Your Question
                            </label>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask the Universal Oracle anything about the cosmos, consciousness, spirituality, or the nature of reality..."
                                className="w-full h-32 px-4 py-3 bg-black/50 border border-gray-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent resize-none font-light"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Response Type Toggle */}
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isDetailed}
                                    onChange={(e) => setIsDetailed(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-500 bg-black/50 text-cyan-400 focus:ring-cyan-400/50"
                                    disabled={isLoading}
                                />
                                <span>Detailed response</span>
                            </label>
                        </div>

                        {/* Ask Button */}
                        <button
                            onClick={handleAskQuestion}
                            disabled={!question.trim() || isLoading || !hasApiKey}
                            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-lg text-white font-display hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Consulting the Oracle...' : 'Ask the Oracle'}
                        </button>

                        {/* Answer Display */}
                        <AnimatePresence>
                            {answer && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mt-6 p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-lg"
                                >
                                    <h3 className="text-sm font-display text-cyan-300 mb-3 uppercase tracking-wider">
                                        The Oracle Speaks
                                    </h3>
                                    <div className="text-gray-200 leading-relaxed whitespace-pre-wrap font-light">
                                        {answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-500/30 text-xs text-gray-500 text-center">
                        Press Cmd/Ctrl + Enter to ask • The Oracle draws wisdom from the cosmic frequencies
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UniversalOracle;

