# Anveshana Vidya — Digital Forensics Learning Platform

A futuristic, interactive educational website for digital forensics with glassmorphism UI, 3D visualizations, immersive labs, real-world case studies, and comprehensive learning tools. Designed for students and professionals to master digital forensics through hands-on practice.

> **Anveshana Vidya** (अन्वेषण विद्या) — Sanskrit for *"The Science of Investigation"*

## Features

- 🎨 Dark theme with glassmorphism effects and animated gradients
- 🎯 Smooth scrolling with Lenis for enhanced UX
- 🎭 Interactive 3D visualizations (HDD/SSD models) with 2D fallbacks
- ♿ WCAG AA accessibility compliant with full keyboard navigation
- 📱 Fully responsive design across all devices
- 🤖 **FORENSEC AI** — Gemini-powered forensics chatbot (domain-restricted to digital forensics)
- 🖥️ Terminal-like interactive command interface with quizzes and missions
- 🔬 Five specialized forensic analysis labs (NetFlow, Timeline, Hash Verify, Memory Triage, Steganography Detection)
- 📚 Real-world case study analysis with investigation workflows
- 🎓 Interactive learning modules with glossary and terminology
- 🎵 Immersive audio experience (background soundtrack, once per session)
- ⚡ Optimized performance with lazy loading and code splitting
- 🏆 Comprehensive tool showcase and resource library
- 🌟 Sanskrit ślokas woven throughout for cultural and philosophical depth

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom theme
- **3D**: Three.js + React Three Fiber + @react-three/drei
- **State**: Zustand
- **Animations**: Framer Motion
- **Scrolling**: Lenis
- **AI**: Google Gemini via `@google/genai`
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (required for FORENSEC AI chatbot)

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

## Project Structure

```
src/
├── ai/
│   └── forensecAI.ts            # FORENSEC AI — Gemini-powered chatbot engine
├── components/
│   ├── sections/                # Page-level content sections
│   │   ├── Hero.tsx             # Landing hero section
│   │   ├── TopicsGrid.tsx       # Investigation modules grid
│   │   ├── ToolsShowcase.tsx    # Forensic tools catalog
│   │   ├── CaseStudies.tsx      # Real-world case investigations
│   │   └── SupportAccess.tsx    # Support & access section
│   ├── labs/                    # Specialized forensic labs
│   │   ├── NetflowLab.tsx       # Network flow analysis
│   │   ├── TimelineLab.tsx      # Timeline analysis tool
│   │   ├── HashVerifyLab.tsx    # Hash verification utility
│   │   ├── MemoryTriageLab.tsx  # Memory triage analysis
│   │   ├── StegoDetectLab.tsx   # Steganography detection
│   │   └── LabPanel.tsx         # Lab interface container
│   ├── 3d/                      # 3D visualization components
│   │   ├── Canvas3D.tsx         # 3D canvas wrapper
│   │   ├── Scene.tsx            # 3D scene setup
│   │   ├── SceneLights.tsx      # 3D lighting configuration
│   │   ├── models/
│   │   │   ├── HDDModel.tsx     # 3D HDD visualization
│   │   │   └── SSDModel.tsx     # 3D SSD visualization
│   │   ├── FallbackView.tsx     # 2D fallback for 3D models
│   │   └── index.ts             # Barrel export
│   ├── features/
│   │   └── Terminal.tsx         # Interactive command terminal
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Tabs.tsx
│   │   ├── Accordion.tsx
│   │   ├── GlassPanel.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── Tooltip.tsx
│   │   └── icons/
│   │       └── EagleIcon.tsx
│   ├── Navigation.tsx           # Top navigation bar
│   ├── Footer.tsx               # Footer component
│   ├── Chatbot.tsx              # FORENSEC AI chatbot interface
│   ├── LoadingSpinner.tsx       # Loading indicator
│   └── StarfieldBackground.tsx  # Animated starfield background
├── data/                        # JSON data modules
│   ├── cases.json               # Real-world case studies
│   ├── caseEvents.json          # Case investigation timeline events
│   ├── commandHelp.json         # Terminal command help reference
│   ├── forensicCommands.json    # Forensic command reference
│   ├── forensicCommandsEnhanced.json  # Enhanced command documentation
│   ├── forensicGlossary.json    # 100+ forensics terminology entries
│   ├── forensicQuiz.json        # Quiz questions
│   ├── forensicQuizBank.json    # Expanded question bank
│   ├── missions.json            # Challenge-based learning missions
│   ├── slokas.json              # Sanskrit ślokas with context
│   ├── tools.json               # Forensic tools catalog
│   └── topics.json              # Learning module metadata
├── state/
│   └── motionStore.ts           # Zustand motion/animation store
├── styles/
│   └── index.css                # Global stylesheet
├── test/                        # Test suites
│   ├── setup.ts
│   ├── components/
│   │   ├── Chatbot.test.tsx
│   │   ├── DesignSystem.test.tsx
│   │   ├── Sections.test.tsx
│   │   ├── Terminal.test.tsx
│   │   └── 3d/
│   │       └── Canvas3D.test.tsx
│   └── utils/
│       ├── Graph.test.ts
│       ├── LRUCache.test.ts
│       └── Trie.test.ts
├── types/
│   └── global.d.ts              # Global TypeScript definitions
├── utils/                       # Utility / DSA modules
│   ├── Graph.ts                 # Graph data structure
│   ├── LRUCache.ts              # LRU cache implementation
│   ├── Trie.ts                  # Trie data structure
│   └── storage.ts               # Local/session storage helpers
├── App.tsx                      # Root application component
└── main.tsx                     # Application entry point
```

## Development Status

**TASK 1 — PROJECT SETUP**: ✅ Complete  
**TASK 2 — INFORMATION ARCHITECTURE + JSON SCHEMAS**: ✅ Complete  
**TASK 3 — DESIGN SYSTEM COMPONENTS**: ✅ Complete  
**TASK 4 — DSA UTILITIES**: ✅ Complete  
**TASK 5 — 3D SCENES + FALLBACKS**: ✅ Complete  
**TASK 6 — CONTENT AUTHORING**: ✅ Complete  
**TASK 7 — FORENSEC AI CHATBOT**: ✅ Complete  
**TASK 8 — PERFORMANCE & ACCESSIBILITY QA**: ✅ Complete  
**TASK 9 — FINAL INTEGRATION**: ✅ Complete  
**TASK 10 — HANDOFF DOCUMENTATION + BUG FIXES**: ✅ Complete  

**🎉 PROJECT STATUS: COMPLETE**

All tests passing | Zero TypeScript errors | Zero linting issues | Build verified ✓

## Key Learning Components

### 🔬 Specialized Forensic Labs

Interactive hands-on analysis tools integrated within the Terminal feature:

1. **NetFlow Lab** - Network flow analysis and threat detection
   - Sort network traffic by source, destination, bytes transferred
   - Flag suspicious and critical connections
   - Identify C2 (Command & Control) beacons
   - Priority-based flow visualization

2. **Timeline Lab** - Temporal analysis of forensic evidence
   - Pivot across case event datasets
   - Phase-based timeline analysis
   - Event correlation and sequence verification
   - Historical artifact reconstruction

3. **Hash Verify Lab** - File integrity verification
   - SHA-256 hash validation
   - Evidence authenticity confirmation
   - Hash comparison and matching
   - Chain of custody verification

4. **Memory Triage Lab** - Memory dump analysis
   - Volatility snapshot filtering
   - Process analysis by risk level (low/medium/high)
   - Anomaly detection (credential dumping, unsigned modules, suspicious network activity)
   - User privilege level analysis

5. **Steganography Detection Lab** - Covert data discovery
   - Steganographic pattern recognition
   - Hidden message extraction
   - Media file analysis (images, audio)
   - Stenographic algorithm identification

### 📚 Educational Modules

16 comprehensive learning sections covering forensic investigation domains:
- **Computer Forensics Fundamentals** - Core principles and concepts
- **Data Acquisition** - Evidence collection methodologies
- **File Systems** - NTFS, FAT32, EXT4, APFS analysis
- **Storage Internals** - HDD/SSD mechanisms and forensic implications
- **Evidence Rules** - Admissibility, reliability, completeness, integrity
- **Investigation Process** - Step-by-step investigation workflows
- **Operating System Forensics** - Windows/Linux/macOS artifact analysis
- **Network Forensics** - Network traffic and protocol analysis
- **Malware Analysis** - Malware behavior and detection
- **Email Crime Investigation** - Email header analysis and artifact recovery
- **Dark Web Investigation** - Anonymity technologies and investigation techniques

### 🖥️ Interactive Terminal

Command-line interface with forensic workflows:
- **Forensic Command Reference** - 50+ forensic tools and commands
- **Quiz System** - Multi-tier assessment (foundation, triage, deep-dive)
- **Missions** - Challenge-based learning objectives
- **Case Studies** - Real-world investigation scenarios
- **Glossary** - Comprehensive forensic terminology
- **Lab Access** - Seamless integration with all five forensic labs

### 📖 Real-World Case Studies

Detailed analysis of actual forensic investigations including:
- Case scenarios and objectives
- Key artifacts and evidence collection
- Investigation workflows and methodologies
- Practical tool usage examples
- Outcomes and lessons learned
- Step-by-step investigation phases

### 🤖 FORENSEC AI Chatbot

Gemini-powered forensics assistant (`src/ai/forensecAI.ts`) strictly restricted to the digital forensics domain:
- Direct Q&A with forensic citations
- Concept teaching with practical examples
- Guided walkthroughs of investigation procedures
- Real-time forensic knowledge queries
- Covers: Disk, Memory, Network, Mobile, Cloud, and Malware forensics

> Requires `VITE_GEMINI_API_KEY` environment variable.

### 🎨 3D Visualizations

Interactive Three.js visualizations with graceful 2D fallbacks:
- **HDD Model** - Hard disk drive internals visualization
- **SSD Model** - Solid-state drive architecture
- Storage media structure and forensic implications
- Automatic fallback for unsupported browsers

### 🌟 Sanskrit Ślokas

Cultural and philosophical integration:
- Context-relevant Sanskrit verses throughout the platform
- English translations with forensic relevance
- Educational reinforcement of core concepts
- Cultural heritage preservation

## Quality Assurance

- ✅ **TypeScript**: Strict mode enabled, no type errors
- ✅ **Testing**: All tests passing (Vitest + React Testing Library)
  - `Chatbot.test.tsx` — FORENSEC AI chatbot component
  - `DesignSystem.test.tsx` — UI component library
  - `Sections.test.tsx` — Page sections (Hero, TopicsGrid, ToolsShowcase, CaseStudies)
  - `Terminal.test.tsx` — Terminal and lab functionality
  - `Canvas3D.test.tsx` — 3D canvas rendering
  - `Graph.test.ts` — Graph DSA utility
  - `LRUCache.test.ts` — LRU cache DSA utility
  - `Trie.test.ts` — Trie DSA utility
- ✅ **Linting**: ESLint + Prettier configured, all errors resolved
- ✅ **Accessibility**: WCAG AA compliant
  - Full keyboard navigation support
  - ARIA labels and semantic HTML
  - Screen reader compatibility
  - High contrast dark theme
- ✅ **Performance**:
  - Lazy-loaded sections with React `Suspense`
  - Code splitting for large components (3D, Terminal, Labs)
  - 3D fallback mechanisms for unsupported browsers
  - Session-based audio playback management

## Data Management

### JSON Data Sources (`src/data/`)

- **cases.json** — Real-world forensic case studies
- **caseEvents.json** — Detailed timeline events for case analysis
- **commandHelp.json** — Terminal command help reference
- **forensicCommands.json** — Core forensic tool reference
- **forensicCommandsEnhanced.json** — Advanced command documentation
- **forensicGlossary.json** — 100+ forensic terminology entries
- **forensicQuiz.json** — Foundational quiz questions
- **forensicQuizBank.json** — Expanded question bank
- **missions.json** — Challenge-based learning objectives
- **tools.json** — 50+ forensic tools catalog
- **topics.json** — Learning module metadata
- **slokas.json** — Sanskrit verses with forensic context

## Deployment

The project is production-ready and can be deployed on Vercel, Netlify, or any static hosting provider.

### Quick Deploy Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Preview the build locally**:
   ```bash
   npm run preview
   ```

3. **Deploy to Vercel** (Recommended):
   ```bash
   npm i -g vercel
   vercel
   ```

4. **Deploy to Netlify**:
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

5. **Manual Deployment**:
   - Upload the `dist/` folder to your web server
   - Configure server to serve `index.html` for all routes

### Environment Configuration

Set the following environment variable in your hosting provider's dashboard:

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Yes | Google Gemini API key for FORENSEC AI |

All other functionality runs entirely client-side with no additional configuration.

### Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

This is an educational project. Feel free to fork and modify for learning purposes.

## License

Educational purposes only.
