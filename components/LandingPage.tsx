import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onLogin: (creatorName: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [creatorName, setCreatorName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (creatorName.trim()) {
            onLogin(creatorName.trim());
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                <h1 className="font-display text-5xl md:text-7xl font-light tracking-widest uppercase">
                   Cosmic Community Creator
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-300 font-light tracking-wider">
                  Compose your own version of the cosmic star nations.
                </p>
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                className="mt-12 flex flex-col gap-4 items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            >
                <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="Enter Your Creator Name"
                    className="font-display text-lg text-center w-72 bg-transparent border border-gray-400/50 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Password"
                    className="font-display text-lg text-center w-72 bg-transparent border border-gray-400/50 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                    required
                />
                <button
                    type="submit"
                    className="font-display text-xl px-8 py-3 border border-gray-400 text-gray-200 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
                >
                    Enter the Sanctuary
                </button>
            </motion.form>

             <motion.p 
                className="absolute bottom-8 text-xs text-gray-500 max-w-lg mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
             >
                This product is entirely the result of effortless manifestation; no effort, or other toxic energies were entertained or added during creation. Just the chemistry of intelligence spanning multiple dimensions © Soul's Sovereignty
             </motion.p>
        </div>
    );
};

export default LandingPage;
