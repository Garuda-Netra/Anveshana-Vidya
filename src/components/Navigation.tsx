import { useState, useEffect, useLayoutEffect } from 'react';
import { clsx } from 'clsx';

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'topics', label: 'Modules' },
  { id: 'tools', label: 'Arsenal' },
  { id: 'cases', label: 'Case Studies' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'support', label: 'Support' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Ensure scroll starts at top (Hero section) on initial load.
   */
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  /**
   * Scroll spy logic (runs only after layout settles)
   */
  /**
   * Scroll State (Background Blurring)
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Scroll Spy (IntersectionObserver)
   * With MutationObserver to handle lazy-loaded sections
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    );

    const observeElements = () => {
      navItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });
    };

    // Initial check
    observeElements();

    // Watch for DOM additions (lazy loaded components)
    const mutationObserver = new MutationObserver((mutations) => {
      const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0);
      if (hasAddedNodes) {
        observeElements();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-bg-darker/80 backdrop-blur-glass border-b border-accent-cyan/10 shadow-[0_4px_30px_rgba(0,255,255,0.06)]'
          : 'bg-transparent'
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Top scanning line */}
      {isScrolled && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/60 to-transparent" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('hero')}
              className="group flex items-center gap-2 focus:outline-none"
              aria-label="Digital Forensics - Go to home"
            >
              <div className="w-7 h-7 rounded border border-accent-cyan/50 flex items-center justify-center bg-accent-cyan/10 group-hover:bg-accent-cyan/20 transition-colors duration-300">
                <span className="text-accent-neon text-xs font-bold font-mono">DF</span>
              </div>
              <span className="text-lg font-bold text-gradient-cyan glow-text tracking-wide">
                Digital Forensics
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex space-x-1">
              {navItems.slice(1).map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={clsx(
                    'px-4 py-2 text-sm font-medium transition-all duration-300 relative rounded-md',
                    'hover:text-accent-neon focus:outline-none focus:ring-2 focus:ring-accent-neon/50',
                    activeSection === item.id
                      ? 'text-accent-neon bg-accent-neon/8'
                      : 'text-text-secondary hover:bg-surface-light'
                  )}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <span className="relative z-10">{item.label}</span>
                  {activeSection === item.id && (
                    <>
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-neon rounded-full shadow-[0_0_6px_rgba(0,255,255,0.6)]" />
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-neon nav-dot-active" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(v => !v)}
              className="glass-button p-2"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-bg-darker/95 backdrop-blur-glass border-t border-accent-cyan/10">
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
            {navItems.slice(1).map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={clsx(
                  'flex items-center w-full text-left px-3 py-2.5 text-base font-medium transition-all duration-300 rounded-md',
                  'hover:text-accent-neon hover:bg-accent-neon/5',
                  activeSection === item.id
                    ? 'text-accent-neon bg-accent-neon/8 border-l-2 border-accent-neon'
                    : 'text-text-secondary border-l-2 border-transparent'
                )}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {activeSection === item.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-neon mr-2 nav-dot-active flex-shrink-0" />
                )}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
