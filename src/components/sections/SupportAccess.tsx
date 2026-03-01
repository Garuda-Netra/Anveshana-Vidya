import { Copy, CreditCard, Check } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import { EagleIcon } from '../ui/icons/EagleIcon';

export default function SupportAccess() {
  const [copied, setCopied] = useState(false);
  const upiId = '8271915751@upi';
  const resetTimerRef = useRef<number | null>(null);

  const benefits = useMemo(
    () => [
      {
        icon: '🎓',
        title: 'Advanced Modules',
        desc: 'Deep-dive content',
        classes: 'bg-accent-cyan/5 border border-accent-cyan/20',
      },
      {
        icon: '🔧',
        title: 'Premium Tools',
        desc: 'Pro features',
        classes: 'bg-accent-purple/5 border border-accent-purple/20',
      },
      {
        icon: '📚',
        title: 'Case Studies',
        desc: 'Real investigations',
        classes: 'bg-accent-neon/5 border border-accent-neon/20',
      },
    ],
    []
  );

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [upiId]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return (
    <section id="support" className="py-20 px-4 pb-28">
      <div className="max-w-4xl mx-auto">
        <SectionHeader 
          title="Support & Access"
          subtitle="Support this platform and unlock advanced modules. Secure UPI payments accepted."
        />

        <div className="glass-panel border border-accent-purple/20 rounded-xl p-6 md:p-8 backdrop-blur-xl bg-gradient-to-br from-accent-purple/5 via-bg-dark/60 to-accent-neon/5 relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(138,43,226,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.035)_1px,transparent_1px)] bg-[size:36px_36px] opacity-40 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-accent-neon/10 border border-accent-neon/20 flex items-center justify-center">
                <EagleIcon className="w-10 h-10 md:w-11 md:h-11 text-accent-neon" title="Eagle" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-neon mb-2">
                  Empower Learning
                </h3>
                <p className="text-text-secondary text-sm md:text-base">
                  Your contribution helps maintain and expand this educational platform
                </p>
              </div>
            </div>

            {/* UPI Payment Card */}
            <div className="max-w-sm mx-auto bg-bg-dark/40 border border-accent-neon/20 rounded-lg p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-accent-neon" />
                <span className="text-accent-neon font-semibold text-sm tracking-wide">UPI Payment</span>
              </div>
              
              <div className="bg-surface-glass/40 border border-border-glass rounded-md p-3 mb-3">
                <div className="text-[10px] text-text-tertiary mb-1 uppercase tracking-wider">UPI ID</div>
                <div className="text-base md:text-lg font-mono text-text-primary break-all">
                  {upiId}
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full group relative px-4 py-2 bg-accent-neon/10 border border-accent-neon/80 text-accent-neon font-semibold text-sm tracking-wide hover:bg-accent-neon hover:text-bg-dark transition-colors duration-200 rounded-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent-neon/60 focus:ring-offset-2 focus:ring-offset-bg-dark"
                aria-label="Copy UPI ID to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy UPI ID</span>
                  </>
                )}
                <div className="absolute inset-0 bg-accent-neon/15 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md" />
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-text-tertiary">
                  🔒 Secure payment gateway • All contributions are voluntary
                </p>
                <p className="mt-2 text-xs text-text-secondary">
                  If we earn from our budget, we definitely help poor people with these rupees.
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {benefits.map((b) => (
                <div key={b.title} className={`text-center p-4 rounded-lg ${b.classes}`}
                >
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <div className="text-sm text-text-primary font-semibold">{b.title}</div>
                  <div className="text-xs text-text-tertiary mt-1">{b.desc}</div>
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
