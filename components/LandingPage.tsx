import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { galleryService, GalleryItem } from '../services/galleryService';
import { supabase } from '../services/supabaseClient';

interface LandingPageProps {
    onLogin: (creatorName: string) => void;
}

// TODO: Replace with your actual Stripe Price ID
const STRIPE_PRICE_ID = 'price_1Qk...';

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [creatorName, setCreatorName] = useState('');
    const [password, setPassword] = useState('');
    const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
    const [galleryVideos, setGalleryVideos] = useState<GalleryItem[]>([]);
    const [isLoadingGallery, setIsLoadingGallery] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const loadGallery = async () => {
            setIsLoadingGallery(true);
            setHasError(false);
            try {
                const [images, videos] = await Promise.all([
                    galleryService.getAllImages(12),
                    galleryService.getAllVideos(8),
                ]);
                console.log('Gallery loaded:', { imagesCount: images?.length || 0, videosCount: videos?.length || 0 });
                setGalleryImages(images || []);
                setGalleryVideos(videos || []);
            } catch (err) {
                console.error('Error loading gallery:', err);
                setHasError(true);
            } finally {
                setIsLoadingGallery(false);
            }
        };
        loadGallery();

        // Check for return from Stripe
        const checkPaymentStatus = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');
            const pendingUser = sessionStorage.getItem('pending_creator_name');

            if (sessionId && pendingUser) {
                setIsProcessing(true);
                setStatusMessage('Verifying payment...');

                // Poll for payment completion (webhook might take a moment)
                let attempts = 0;
                const maxAttempts = 10;

                const pollInterval = setInterval(async () => {
                    attempts++;
                    const { data: user } = await supabase
                        .from('users')
                        .select('is_paid')
                        .eq('username', pendingUser)
                        .single();

                    if (user?.is_paid) {
                        clearInterval(pollInterval);
                        sessionStorage.removeItem('pending_creator_name');
                        // Clear URL params
                        window.history.replaceState({}, document.title, window.location.pathname);
                        onLogin(pendingUser);
                    } else if (attempts >= maxAttempts) {
                        clearInterval(pollInterval);
                        setIsProcessing(false);
                        setStatusMessage('Payment verification timed out. Please try logging in again.');
                    }
                }, 2000);
            }
        };
        checkPaymentStatus();
    }, [onLogin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!creatorName.trim()) return;

        setIsProcessing(true);
        setStatusMessage('Checking access...');

        try {
            // 1. Check if user exists and is paid
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', creatorName.trim())
                .single();

            if (user && user.is_paid) {
                // User exists and is paid, allow login
                onLogin(creatorName.trim());
                return;
            }

            // 2. If not paid (or doesn't exist), create checkout session
            setStatusMessage('Redirecting to payment...');

            const { data, error: funcError } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    username: creatorName.trim(),
                    priceId: STRIPE_PRICE_ID,
                    origin: window.location.origin
                }
            });

            if (funcError) throw funcError;
            if (data?.url) {
                sessionStorage.setItem('pending_creator_name', creatorName.trim());
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }

        } catch (err) {
            console.error('Login error:', err);
            setStatusMessage('An error occurred. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col text-white overflow-y-auto">
            {/* Main Content Section */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 min-h-[60vh]">
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
                        disabled={isProcessing}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Your Password"
                        className="font-display text-lg text-center w-72 bg-transparent border border-gray-400/50 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                        required
                        disabled={isProcessing}
                    />
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="font-display text-xl px-8 py-3 border border-gray-400 text-gray-200 rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing...' : 'Enter the Sanctuary'}
                    </button>
                    {statusMessage && (
                        <p className="text-sm text-cyan-400 mt-2 animate-pulse">{statusMessage}</p>
                    )}
                </motion.form>
            </div>

            {/* Gallery Section */}
            <div className="w-full py-8 px-4 space-y-8">
                {/* Images Gallery */}
                {galleryImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="w-full"
                    >
                        <h2 className="font-display text-2xl md:text-3xl text-center mb-6 text-gray-200 font-light">
                            Recent Visions
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            {galleryImages.map((item, index) => (
                                <motion.div
                                    key={`image-${index}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                                    className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border border-gray-500/30 bg-black/20 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 group"
                                >
                                    <img
                                        src={item.url}
                                        alt={`Cosmic vision ${index + 1}`}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Videos Gallery */}
                {galleryVideos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="w-full"
                    >
                        <h2 className="font-display text-2xl md:text-3xl text-center mb-6 text-gray-200 font-light">
                            Recent Animations
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            {galleryVideos.map((item, index) => (
                                <motion.div
                                    key={`video-${index}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                                    className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border border-gray-500/30 bg-black/20 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 group"
                                >
                                    <video
                                        src={item.url}
                                        className="w-full h-full object-contain"
                                        muted
                                        loop
                                        playsInline
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.currentTime = 0;
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Loading State */}
                {isLoadingGallery && (
                    <div className="text-center text-gray-400 py-8">
                        <p className="font-display">Loading cosmic creations...</p>
                    </div>
                )}

                {/* Error State */}
                {!isLoadingGallery && hasError && (
                    <div className="text-center text-yellow-500 py-8">
                        <p className="font-display mb-2">Unable to load gallery.</p>
                        <p className="text-sm text-gray-400">Check browser console for details. This may be a storage policy issue.</p>
                    </div>
                )}

                {/* Empty State - Only show if not loading, no error, and truly no creations */}
                {!isLoadingGallery && !hasError && galleryImages.length === 0 && galleryVideos.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        <p className="font-display">No creations yet. Be the first to create!</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <motion.p
                className="text-center text-xs text-gray-500 max-w-lg mx-auto px-4 pb-8"
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
