import { useEffect, useRef } from 'react';
import { useMotionStore } from '../state/motionStore';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const reduceMotion = useMotionStore((s) => s.effectiveReduceMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Generate stars
    const generateStars = () => {
      const stars: Star[] = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 6000); // Increased density

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.4,
          speed: Math.random() * 0.08 + 0.02,
          twinkleSpeed: Math.random() * 0.05 + 0.02, // Faster twinkling
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    };

    generateStars();

    const drawStarShape = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }

      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    };

    const renderFrame = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        // If reduced motion, keep stars static (no twinkle/drift)
        const twinkle = reduceMotion
          ? 1
          : (Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5);
        const opacity = star.opacity * twinkle;

        if (!reduceMotion) {
          // Slow drift only when motion is allowed
          star.y += star.speed;
          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
          }
        }

        // Larger stars get a subtle sparkle only when motion is allowed
        if (!reduceMotion && star.size > 1.8 && twinkle > 0.7) {
          ctx.save();
          drawStarShape(star.x, star.y, 4, star.size * 1.5, star.size * 0.5);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
        }

        // Glow is static when reduced motion is enabled
        if (star.size > 1.5) {
          const glowIntensity = (reduceMotion ? 0.18 : twinkle * 0.3);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 200, 255, ${glowIntensity})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 220, 255, ${opacity * 0.3})`;
          ctx.fill();
        }
      });
    };

    // Resize handling: regenerate + render once
    const handleResize = () => {
      resizeCanvas();
      generateStars();
      renderFrame(0);
    };

    window.addEventListener('resize', handleResize);

    if (reduceMotion) {
      renderFrame(0);
    } else {
      let time = 0;
      const animate = () => {
        time += 0.05;
        renderFrame(time);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reduceMotion]);

  return (
    <>
      {/* Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.8 }}
      />

      {/* Moon */}
      <div className="fixed top-20 right-20 pointer-events-none z-0">
        <div className="relative w-32 h-32">
          {/* Moon glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-blue-200/20 via-blue-300/10 to-transparent blur-2xl scale-150" />
          
          {/* Moon body */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 shadow-2xl">
            {/* Craters */}
            <div className="absolute top-6 left-8 w-6 h-6 rounded-full bg-slate-500/30" />
            <div className="absolute top-12 right-10 w-4 h-4 rounded-full bg-slate-500/20" />
            <div className="absolute bottom-8 left-12 w-8 h-8 rounded-full bg-slate-500/25" />
            <div className="absolute top-16 left-6 w-3 h-3 rounded-full bg-slate-500/30" />
            
            {/* Shadow overlay for 3D effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-transparent via-transparent to-slate-900/30" />
          </div>

          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-200/10 scale-110" />
        </div>
      </div>
    </>
  );
}
