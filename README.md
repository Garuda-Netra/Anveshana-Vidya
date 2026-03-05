# Anveshana Vidya — Digital Forensics Learning Platform

> **अन्वेषण विद्या** — *"The Science of Investigation"*

Interactive educational platform for mastering digital forensics through hands-on labs, AI assistance, and real-world case studies.

## Core Features

### 🤖 FORENSEC AI — Domain-Restricted Forensics Assistant
Gemini-powered chatbot **strictly limited to digital forensics topics only**. The AI will refuse non-forensic queries (cooking, sports, etc.) to maintain educational focus.

**Structured Knowledge Modules:**
- Computer Forensics Fundamentals, Investigation Process
- HDD/SSD Forensics (platters, NAND flash, TRIM challenges)
- NTFS Analysis (MFT, ADS, timestamps)
- Memory Forensics (Volatility, process analysis)
- Network Forensics (PCAP analysis, data exfiltration)
- Windows/Linux Forensics (registry, event logs, artifacts)

**Response Modes:**
- **Direct Q&A** — Quick answers with forensic citations
- **Teaching Mode** — Concept explanations with practical examples
- **Guided Walkthrough** — Step-by-step investigation procedures

### 🔬 5 Interactive Forensic Labs
**Hands-on analysis tools with real forensic workflows:**

1. **NetFlow Lab** — Network traffic analysis
   - Sort by source/destination/bytes, flag suspicious connections
   - Identify C2 (Command & Control) beacons
   - Priority-based threat visualization

2. **Timeline Lab** — Temporal forensic analysis
   - Pivot across case event datasets
   - Phase-based timeline correlation
   - Historical artifact reconstruction

3. **Hash Verify Lab** — File integrity verification
   - SHA-256 validation against known baselines
   - Chain of custody verification
   - Evidence authenticity confirmation

4. **Memory Triage Lab** — Memory dump analysis
   - Volatility-style process filtering
   - Anomaly detection (credential dumping, unsigned modules, suspicious network activity)
   - Risk-level classification (low/medium/high)

5. **Steganography Detection Lab** — Covert data discovery
   - LSB (Least Significant Bit) differential scanning
   - Hidden message extraction from images
   - Step-by-step forensic workflow (ingest → scan → extract → report)

### 🖥️ Interactive Terminal — 200+ Forensic Commands
**Professional command-line interface with comprehensive features:**
- **200+ Forensic Commands** — Organized by category (disk, memory, network, malware)
- **Quiz System** — 3 tiers (foundation, triage, deep-dive) with explanations
- **Mission System** — Challenge-based learning with prerequisites and step-by-step objectives
- **Case Studies** — Real-world investigation scenarios with detailed timelines
- **Glossary** — 100+ forensic terms with definitions
- **Workflow Commands** — Investigation procedure guidance
- **Command Palette** — Quick command search with autocomplete

### 🎭 3D Storage Visualizations
- **HDD Model** — Platter/track/sector structure with forensic implications
- **SSD Model** — NAND flash architecture and TRIM challenges
- **Graceful Fallback** — 2D illustrations for unsupported browsers

### 📚 Real-World Case Studies
- Detailed investigation scenarios with objectives
- Multi-phase timelines with forensic events
- Key artifacts and evidence collection methodologies
- Tool usage examples and investigation workflows

### ♿ Accessibility & Performance
- **WCAG AA Compliant** — Full keyboard navigation, ARIA labels, screen reader support
- **Lazy Loading** — Code splitting for 3D models, labs, and heavy components
- **Session Management** — Audio plays once per session, smooth scrolling with Lenis
- **Responsive Design** — Mobile-first with glassmorphism UI

## Tech Stack

React 18 • TypeScript • Vite • Tailwind CSS • Three.js • Framer Motion • Zustand • Gemini AI

## Quick Start

### Prerequisites
- Node.js 18+
- [Gemini API key](https://aistudio.google.com/app/apikey)

### Setup

```bash
# Install
npm install

# Configure environment (.env file)
VITE_GEMINI_API_KEY=your_api_key_here

# Run dev server
npm run dev

# Build
npm run build

# Test
npm run test
```

## Architecture & Technical Details

### Data Structures (DSA Utilities)
**Purpose-built for forensic education optimization:**

1. **Trie (Prefix Tree)** — `utils/Trie.ts`
   - **Use Case:** Command autocomplete in Terminal
   - **Time Complexity:** O(m) for insert/search (m = word length)
   - Enables fast prefix matching for 200+ forensic commands

2. **LRU Cache** — `utils/LRUCache.ts`
   - **Use Case:** Cache forensic analysis results, file metadata, search results
   - **Time Complexity:** O(1) for get/put operations
   - Optimizes repeated command execution and quiz loading

3. **Graph** — `utils/Graph.ts`
   - **Use Case:** Mission dependency tracking, investigation workflow visualization
   - **Features:** BFS/DFS traversal, cycle detection, prerequisite validation

### Educational Content Structure

**12 JSON Data Files** in `src/data/`:
- **cases.json** — Real-world forensic case studies with investigation phases
- **caseEvents.json** — Detailed timeline events for Timeline Lab
- **forensicCommands.json** — Core forensic tool reference (50+ commands)
- **forensicCommandsEnhanced.json** — Extended command documentation with examples
- **commandHelp.json** — Command categories and workflow guidance
- **forensicGlossary.json** — 100+ forensic terms and acronyms
- **forensicQuiz.json** — Foundation-level quiz questions
- **forensicQuizBank.json** — Advanced quiz questions (triage, deep-dive)
- **missions.json** — Challenge-based learning objectives with prerequisites
- **tools.json** — Comprehensive forensic tools catalog
- **topics.json** — 16 learning modules with detailed content
- **slokas.json** — Sanskrit verses with forensic context

### Mission System
**Progressive Learning with Dependencies:**
- Mission 1: "First Responder" — Evidence triage and hash verification
- Mission 2: "Memory Hunter" — Memory forensics with Volatility
- Mission 3: "Network Investigator" — Network traffic analysis
- Each mission has prerequisites, step-by-step objectives, hints, and completion messages

### Command Registry System
**Multi-source command loading:**
- Basic commands (forensicCommands.json)
- Enhanced commands (forensicCommandsEnhanced.json)
- Built-in terminal commands (help, clear, glossary)
- Lab commands (trace, timeline, hash verify, mem scan, stego detect)
- Learning commands (quiz, mission, case)

## Project Structure

```
src/
├── ai/forensecAI.ts              # Gemini AI with 769-line system prompt
├── components/
│   ├── sections/                 # Hero, TopicsGrid, ToolsShowcase, CaseStudies
│   ├── labs/                     # 5 specialized forensic labs
│   ├── 3d/                       # Three.js 3D models (HDD/SSD)
│   ├── features/Terminal.tsx     # 1731-line terminal with command registry
│   ├── ui/                       # Reusable UI components (Button, Card, Modal, etc.)
│   ├── Chatbot.tsx               # AI chatbot interface
│   └── Navigation.tsx, Footer.tsx, StarfieldBackground.tsx
├── data/                         # 12 JSON data files (cases, commands, glossary, quizzes)
├── state/motionStore.ts          # Zustand state (motion preferences, accessibility)
├── utils/                        # DSA utilities (Graph, LRUCache, Trie)
└── test/                         # Vitest test suites (100% passing)
```

## Learning Modules (16 Topics)

**Comprehensive forensic investigation curriculum:**

1. **Computer Forensics Fundamentals** — Evidence types, chain of custody, hash verification
2. **Data Acquisition** — Imaging methodologies, write-blockers, acquisition tools
3. **File Systems** — NTFS (MFT, ADS), FAT32, EXT4, APFS analysis
4. **Storage Internals** — HDD (platters, tracks, sectors) vs SSD (NAND, TRIM, garbage collection)
5. **Evidence Rules** — Admissibility, reliability, completeness, integrity standards
6. **Investigation Process** — 7-phase workflow (response, identification, acquisition, preservation, analysis, interpretation, reporting)
7. **Operating System Forensics** — Windows/Linux/macOS artifacts, registry, event logs
8. **Network Forensics** — Packet analysis, PCAP investigation, protocol layers
9. **Malware Analysis** — Static/dynamic analysis, behavioral detection, memory forensics
10. **Email Crime Investigation** — Header analysis, artifact recovery, email forensics
11. **Dark Web Investigation** — Anonymity technologies, Tor analysis, OSINT techniques
12. **Mobile Forensics** — iOS/Android extraction, app data analysis
13. **Cloud Forensics** — Cloud service investigation, API forensics
14. **Memory Forensics** — Volatility framework, process analysis, rootkit detection
15. **Timeline Analysis** — Super timeline creation, event correlation
16. **Incident Response** — DFIR methodologies, containment, remediation

## Quiz System

**3-Tier Assessment Structure:**
- **Foundation** — Basic forensic concepts, terminology, tool identification
- **Triage** — Intermediate skills, evidence prioritization, artifact analysis
- **Deep-Dive** — Advanced scenarios, complex investigations, expert-level questions

Each quiz provides explanations after answers to reinforce learning.

## Deployment

### Production-Ready Features
✅ **Zero Build Errors** — TypeScript strict mode, all tests passing  
✅ **Code Splitting** — Lazy-loaded sections reduce initial bundle size  
✅ **Error Boundaries** — React error boundaries in Terminal and labs  
✅ **Environment Validation** — API key checks with user-friendly error messages  
✅ **SEO Ready** — Semantic HTML, meta tags, Open Graph support  

### Build & Deploy
```bash
npm run build  # Output: dist/ (~2.5MB gzipped)
```

**Deployment Platforms:**
- **Vercel** (Recommended) — Zero-config, automatic HTTPS
- **Netlify** — Edge functions support, form handling
- **GitHub Pages** — Free static hosting
- **Any Static Host** — Nginx, Apache, CloudFlare Pages

**Required Environment Variable:**
- `VITE_GEMINI_API_KEY` — [Get your free API key](https://aistudio.google.com/app/apikey)

**Build Configuration:**
- Node.js 18.x or higher
- Output: `dist/` folder
- SPA routing (configure server to serve `index.html` for all routes)

## Quality Assurance

✅ **TypeScript strict mode** — Zero errors, full type safety  
✅ **All tests passing** — Vitest + React Testing Library  
✅ **ESLint + Prettier** — Consistent code style  
✅ **WCAG AA accessible** — Keyboard navigation, screen readers  
✅ **Lazy-loaded sections** — Code splitting for performance  
✅ **Error boundaries** — Graceful failure handling  

**Test Coverage:**
- Component tests: Chatbot, Terminal, Labs, 3D Canvas, Design System
- Utility tests: Graph, LRU Cache, Trie data structures
- Section tests: Hero, TopicsGrid, ToolsShowcase, CaseStudies

## How to Use

### For Students:
1. **Start with Topics Grid** — Learn forensic fundamentals
2. **Open Terminal** — Practice commands, take quizzes
3. **Try Labs** — Hands-on analysis (type `trace` or `timeline` in Terminal)
4. **Chat with FORENSEC AI** — Ask forensic questions, get guided walkthroughs
5. **Complete Missions** — Challenge-based learning with step-by-step objectives
6. **Explore Case Studies** — Learn from real-world investigations

### For Educators:
- **100% Client-Side** — No server setup, deploy once and use forever
- **Comprehensive Content** — 16 modules, 200+ commands, 100+ glossary terms
- **Progressive Learning** — Mission system with dependencies ensures proper skill progression
- **Assessment Tools** — 3-tier quiz system with explanations
- **Offline Capable** — Once loaded, works without internet (except AI chatbot)

## Development Workflow

```bash
# Development Commands
npm run dev         # Start dev server (Vite HMR)
npm run build       # Production build
npm run preview     # Preview production build locally
npm run test        # Run tests in watch mode
npm run test:ui     # Open Vitest UI
npm run type-check  # TypeScript validation
npm run lint        # ESLint check
npm run format      # Prettier formatting
```

**Development Features:**
- ⚡ **Vite HMR** — Instant hot module replacement
- 🔧 **TypeScript** — Full IntelliSense and type checking
- 🧪 **Vitest** — Fast unit testing with UI
- 📦 **Code Splitting** — Automatic lazy loading
- 🎨 **Tailwind CSS** — Utility-first styling with custom theme

## Browser Support

Chrome/Edge, Firefox, Safari 14+, Mobile browsers

**3D Features Require:**
- WebGL support (graceful 2D fallback provided)
- Modern JavaScript (ES2020+)

## Project Highlights

🎓 **Educational Excellence**
- Domain-specific AI (no off-topic distractions)
- Progressive skill building with mission dependencies
- Real-world case studies and workflows

⚡ **Technical Excellence**
- O(1) caching with LRU for performance
- Trie-based autocomplete for 200+ commands
- Lazy loading reduces initial load to <1s

🎨 **Design Excellence**
- Glassmorphism UI with dark theme
- Smooth animations (respects `prefers-reduced-motion`)
- Accessibility-first approach (WCAG AA)

🔬 **Forensic Authenticity**
- Real forensic command syntax
- Authentic investigation workflows
- Professional terminology and concepts

---

**Anveshana Vidya** — Master digital forensics through immersive, hands-on learning.
