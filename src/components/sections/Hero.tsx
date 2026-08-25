import { ArrowDown, Shield, Search, Database } from 'lucide-react';
import { Suspense, lazy, useState, useEffect } from 'react';
import slokas from '../../data/slokas.json';

const Scene = lazy(() => import('../3d/Scene'));

export default function Hero() {
  const [currentSloka, setCurrentSloka] = useState(() => {
    const randomIndex = Math.floor(Math.random() * slokas.length);
    return slokas[randomIndex];
  });

  useEffect(() => {
    // Rotate śloka every 8 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * slokas.length);
      setCurrentSloka(slokas[randomIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const scrollToTopics = () => {
    const topicsSection = document.getElementById('topics');
    if (topicsSection) {
      topicsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Aurora Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Primary glow blobs */}
        <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-accent-cyan/20 rounded-full blur-[120px] animate-aurora" />
        <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-accent-purple/25 rounded-full blur-[130px] animate-aurora-delay-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent-blue/10 rounded-full blur-[150px] animate-aurora-delay-4" />
        <div className="absolute top-10 right-1/4 w-48 h-48 bg-accent-rose/15 rounded-full blur-[100px] animate-aurora" style={{ animationDuration: '16s' }} />
        <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-accent-emerald/10 rounded-full blur-[120px] animate-aurora-delay-4" />

        {/* 3D Scene */}
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 hex-pattern pointer-events-none z-0 opacity-60" />

      {/* Corner decorations */}
      <div className="absolute top-20 left-6 z-0 pointer-events-none hidden md:block">
        <div className="w-16 h-16 border-l-2 border-t-2 border-accent-cyan/30 rounded-tl-lg" />
        <div className="ml-3 mt-1 w-2 h-2 bg-accent-cyan/50 rounded-full animate-orbit-pulse" />
      </div>
      <div className="absolute top-20 right-6 z-0 pointer-events-none hidden md:block">
        <div className="w-16 h-16 border-r-2 border-t-2 border-accent-purple/30 rounded-tr-lg ml-auto" />
        <div className="mr-3 mt-1 ml-auto w-2 h-2 bg-accent-purple/50 rounded-full animate-orbit-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Data stream lines */}
      <div className="absolute inset-y-0 left-1/4 z-0 pointer-events-none overflow-hidden w-px">
        <div className="data-stream-line" style={{ animationDuration: '3s', animationDelay: '0s' }} />
      </div>
      <div className="absolute inset-y-0 right-1/3 z-0 pointer-events-none overflow-hidden w-px">
        <div className="data-stream-line" style={{ animationDuration: '4s', animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Status badge */}
        <div className="mb-6 inline-flex items-center gap-2">
          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-neon/40 bg-accent-neon/8 text-accent-neon text-xs font-mono tracking-widest backdrop-blur-sm animate-glow-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-neon animate-pulse inline-block" />
            SYSTEM_READY · SECURE_CONNECTION_ESTABLISHED
          </span>
        </div>

        {/* Sanskrit Śloka Banner */}
        <div className="mb-8 glass-panel glass-shine border border-accent-cyan/30 rounded-xl p-6 backdrop-blur-xl bg-gradient-to-r from-accent-cyan/5 via-accent-purple/5 to-accent-neon/5 transition-all duration-500 animate-fade-in">
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/50 to-transparent" />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
            <div className="text-5xl md:text-6xl" role="img" aria-label={currentSloka.symbolMeaning}>
              {currentSloka.symbol}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-2xl md:text-3xl font-bold text-gradient-tri mb-2 tracking-wide">
                {currentSloka.devanagari}
              </div>
              <div className="text-sm md:text-base text-accent-cyan/80 italic mb-1">
                {currentSloka.transliteration}
              </div>
              <div className="text-xs md:text-sm text-text-secondary">
                {currentSloka.english}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Title */}
        <div className="relative mb-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-accent-cyan to-accent-neon neon-flicker">
            DIGITAL
          </h1>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-white to-accent-purple">
            FORENSICS
          </h1>
          {/* Decorative glow beneath title */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent-neon/60 to-transparent" />
        </div>
        
        <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed mt-8">
          Uncover the truth hidden in the data. Master the art of cyber investigation with advanced tools and techniques.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { icon: Shield, label: 'Evidence Analysis', color: 'accent-cyan' },
            { icon: Search, label: 'Threat Detection', color: 'accent-purple' },
            { icon: Database, label: 'Data Recovery', color: 'accent-blue' },
          ].map(({ icon: Icon, label, color }) => (
            <span key={label} className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-${color}/10 border border-${color}/30 text-${color} text-xs font-mono backdrop-blur-sm`}>
              <Icon className="w-3 h-3" />
              {label}
            </span>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="relative inline-block">
          {/* Outer glow ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-neon rounded opacity-40 blur-sm animate-sweep-gradient" />
          <button
            onClick={scrollToTopics}
            className="group relative px-10 py-4 bg-bg-dark border-2 border-accent-neon text-accent-neon font-bold tracking-widest text-sm hover:bg-accent-neon hover:text-bg-dark transition-all duration-300 overflow-hidden"
          >
            {/* Sweep shine on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              START INVESTIGATION
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.025)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none z-0" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-dark to-transparent pointer-events-none z-0" />
    </section>
  );
}
