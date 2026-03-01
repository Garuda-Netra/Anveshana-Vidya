import { Linkedin, Github, ExternalLink } from 'lucide-react';
import slokas from '../data/slokas.json';
import { useMotionInit, useMotionStore } from '../state/motionStore';

export default function Footer() {
  useMotionInit();
  const reducedMotion = useMotionStore((s) => s.effectiveReduceMotion);
  const setUserReduceMotion = useMotionStore((s) => s.setUserReduceMotion);

  // Use the first śloka as permanent signature
  const signatureSloka = slokas[0];

  const toggleReducedMotion = () => {
    setUserReduceMotion(!reducedMotion);
  };

  return (
    <footer className="relative z-10 mt-24" role="contentinfo">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
      <div className="h-px bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent mt-px" />

      <div className="bg-bg-darker/80 backdrop-blur-glass border-t border-border-glass">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-purple/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Sanskrit Śloka Signature */}
          <div className="mb-10 relative overflow-hidden rounded-xl border border-accent-cyan/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-accent-purple/6 to-accent-neon/5" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
            <div className="relative p-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-5 text-center">
                <div className="text-5xl" role="img" aria-label={signatureSloka.symbolMeaning}>
                  {signatureSloka.symbol}
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-gradient-tri mb-1">
                    {signatureSloka.devanagari}
                  </div>
                  <div className="text-sm text-accent-cyan/70 italic mb-1">
                    {signatureSloka.transliteration}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {signatureSloka.english}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded border border-accent-cyan/50 flex items-center justify-center bg-accent-cyan/10">
                  <span className="text-accent-neon text-[9px] font-bold font-mono">DF</span>
                </div>
                <h3 className="text-lg font-bold text-gradient-cyan">
                  Digital Forensics
                </h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Comprehensive platform for learning digital forensics with interactive 3D
                visualizations, real-world case studies, and specialized tools.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-accent-cyan tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-accent-cyan/50" />
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#topics"
                    className="text-text-secondary hover:text-accent-neon transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-text-tertiary group-hover:bg-accent-neon transition-colors" />
                    Modules
                  </a>
                </li>
                <li>
                  <a
                    href="#tools"
                    className="text-text-secondary hover:text-accent-neon transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-text-tertiary group-hover:bg-accent-neon transition-colors" />
                    Tools &amp; Resources
                  </a>
                </li>
                <li>
                  <a
                    href="#cases"
                    className="text-text-secondary hover:text-accent-neon transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-text-tertiary group-hover:bg-accent-neon transition-colors" />
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Connect */}
            <div>
              <h3 className="text-sm font-bold text-accent-purple tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-accent-purple/50" />
                Connect
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.linkedin.com/in/prince-kumar8/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-2.5 bg-accent-cyan/6 border border-accent-cyan/20 rounded-lg hover:bg-accent-cyan/15 hover:border-accent-cyan/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300"
                  aria-label="Connect on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-accent-cyan group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="text-sm text-text-secondary group-hover:text-accent-cyan transition-colors">LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-text-tertiary ml-auto group-hover:text-accent-cyan transition-colors" />
                </a>
                <a
                  href="https://github.com/Garuda-Netra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-2.5 bg-accent-purple/6 border border-accent-purple/20 rounded-lg hover:bg-accent-purple/15 hover:border-accent-purple/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300"
                  aria-label="View GitHub Profile"
                >
                  <Github className="w-4 h-4 text-accent-purple group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="text-sm text-text-secondary group-hover:text-accent-purple transition-colors">GitHub</span>
                  <ExternalLink className="w-3 h-3 text-text-tertiary ml-auto group-hover:text-accent-purple transition-colors" />
                </a>
              </div>
            </div>

            {/* Accessibility Settings */}
            <div>
              <h3 className="text-sm font-bold text-accent-emerald tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-accent-emerald/50" />
                Accessibility
              </h3>
              <div className="space-y-3">
              <button
                onClick={toggleReducedMotion}
                role="switch"
                aria-checked={reducedMotion}
                aria-label="Toggle reduced motion"
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-neon focus:ring-offset-2 focus:ring-offset-bg-dark"
                style={{
                  background: reducedMotion ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.03)',
                  borderColor: reducedMotion ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium text-text-primary">Reduce Motion</span>
                  <span className="text-xs" style={{ color: reducedMotion ? 'rgba(0,255,136,0.8)' : 'rgba(255,255,255,0.35)' }}>
                    {reducedMotion ? 'Animations disabled' : 'Animations enabled'}
                  </span>
                </div>
                {/* Toggle pill */}
                <div
                  className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300"
                  style={{ background: reducedMotion ? 'rgba(0,255,136,0.6)' : 'rgba(255,255,255,0.15)' }}
                >
                  <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: reducedMotion ? '1.375rem' : '0.25rem' }}
                  />
                </div>
              </button>
              <p className="text-xs text-text-tertiary">
                WCAG AA compliant · Keyboard navigable
              </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 relative">
          <div className="h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent mb-8" />
          {/* Crafted by line */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-cyan/8 via-accent-purple/8 to-accent-neon/8 border border-accent-cyan/20 backdrop-blur-sm animate-glow-pulse">
              <span className="text-xs text-text-tertiary tracking-widest uppercase">Crafted with precision by</span>
              <a
                href="https://github.com/Garuda-Netra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold tracking-widest uppercase text-gradient-tri hover:opacity-80 transition-opacity duration-300"
                aria-label="Garuda-Netra on GitHub"
              >
                Garuda&#8209;Netra
              </a>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <p className="text-text-tertiary text-xs font-mono">
              © {new Date().getFullYear()} Digital Forensics Learning Platform · Educational purposes only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
