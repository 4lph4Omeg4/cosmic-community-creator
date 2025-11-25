import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import Sanctuary from './components/Sanctuary';
import useParticleBackground from './hooks/useParticleBackground';
import { Analytics } from "@vercel/analytics/next"

const App: React.FC = () => {
    const [user, setUser] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // This is a placeholder. If we wanted modals to pause the background, we'd manage this state here.
    const isPaused = false;
    useParticleBackground(canvasRef, isPaused);

    useEffect(() => {
        // Check for a logged-in user in session storage when the app loads
        const loggedInUser = sessionStorage.getItem('cosmic-creator-user');
        if (loggedInUser) {
            setUser(loggedInUser);
        }
    }, []);

    const handleLogin = (creatorName: string) => {
        sessionStorage.setItem('cosmic-creator-user', creatorName);
        setUser(creatorName);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('cosmic-creator-user');
        setUser(null);
    };

    return (
        <main className="w-screen h-screen bg-black overflow-hidden font-sans">
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full z-0"
            />
            <div className="absolute top-0 left-0 w-full h-full z-10">
                {user ? (
                    <Sanctuary user={user} onLogout={handleLogout} />
                ) : (
                    <LandingPage onLogin={handleLogin} />
                )}
            </div>
        </main>
    );
};

export default App;
