import React, { useEffect, useRef } from 'react';

const useParticleBackground = (canvasRef: React.RefObject<HTMLCanvasElement>, isPaused: boolean) => {
  const animationFrameId = useRef<number>();
  const particles = useRef<{ x: number; y: number; size: number; speedX: number; speedY: number; }[]>([]).current;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particleCount = 70;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles.length = 0; // Clear the array
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() * 1 - 0.5) * 0.5,
          speedY: (Math.random() * 1 - 0.5) * 0.5,
        });
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particleOpacity = isPaused ? 0.15 : 0.7;
      const lineOpacityFactor = isPaused ? 0.1 : 1.0;

      particles.forEach((p) => {
        if (!isPaused) {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
            if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
        }

        ctx.fillStyle = `rgba(200, 220, 255, ${particleOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = `rgba(150, 180, 255, ${(1 - distance / 120) * lineOpacityFactor})`;
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', resizeCanvas);
    if (particles.length === 0) {
        resizeCanvas();
    }
    
    // Start the animation loop
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, isPaused, particles]);
};

export default useParticleBackground;