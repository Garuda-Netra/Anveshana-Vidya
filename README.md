# Anveshana Vidya — Digital Forensics Learning Platform

> **अन्वेषण विद्या** — *"The Science of Digital Investigation & Incident Response"*

[![Repository](https://img.shields.io/badge/GitHub-Garuda--Netra%2FAnveshana--Vidya-00f3ff?style=for-the-badge&logo=github)](https://github.com/Garuda-Netra/Anveshana-Vidya.git)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20WebGL-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Anveshana Vidya is an interactive, state-of-the-art educational web platform designed to master **Digital Forensics and Incident Response (DFIR)** through interactive 3D WebGL visualizations, real-world case simulations, a 200+ command terminal, and dual AI investigation guidance.

---

## 🌟 Core Features

### 🤖 1. Dual AI Forensic Assistant (FORENSEC AI)
- **Multi-Provider AI Engine**: Seamless integration with **Google Gemini (2.5 / 1.5 Flash)** and **OpenAI (GPT-4o / GPT-4o-mini)**.
- **Domain-Enforced Reasoning**: Strictly restricted to digital forensics, reverse engineering, and incident response workflows.
- **Dynamic Knowledge Synthesis Fallback**: When no API key is provided, the built-in offline **Dynamic Knowledge Engine** tokenizes queries and synthesizes forensic commands, rationale, and findings from real DFIR datasets.
- **Multi-Turn Context & Key Manager**: Configure and switch keys on-the-fly via the in-app key drawer or `.env`.

### 🎭 2. 10 Interactive 3D Forensic Inspection Models
Built with Three.js and `@react-three/fiber` featuring dynamic studio lighting, rotation, zooming, and **2D architectural diagram fallbacks**:
1. **Forensic Workstation & Imager** — Dual-screen triage, write-blocker bridge, evidence bus.
2. **Cryptographic Chain-of-Custody Vault** — Multi-stage blockchain hash blocks (`01: Ingest`, `02: SHA-256`, `03: Court Admissible`), biometric dial, and master key rings.
3. **Malware Sandbox Capsule** — Isolated hypervisor runtime, API hooking pylons, and shellcode containment core.
4. **Magnetic HDD Platters** — Concentric sector tracks, voice-coil actuator arm, and active laser read/write head.
5. **NAND Flash SSD** — Multi-layer emerald PCB, silicon controller, wear-leveling NAND dies, and gold PCIe pins.
6. **Volatile RAM Module** — DRAM layout, hooked process memory block (0x7FFF), and address scanning laser.
7. **Cluster & Signature Data Carving** — 3D sector cluster matrix, magic byte headers (`0x89PNG`, `0xFFD8`), and slack space visualization.
8. **Mobile Forensic Extractor** — JTAG/ISP bridge, OLED partition display (`/data`, `/system`, SQLite).
9. **Network Flow & C2 Beacons** — Packet stream telemetry, gateway router, firewall shield, and anomalous C2 beacon node.
10. **Steganography Bitplanes** — RGB channel differential separation, LSB hidden bit extraction.

### 🖥️ 3. Command Center Terminal (200+ Forensic Commands)
- **Real-Time Simulation**: Execute authentic commands across Volatility, Autopsy, SleuthKit, Wireshark, dd, FTK, Ghidra, and YARA.
- **High-Performance Autocomplete**: Powered by an in-memory **Trie (Prefix Tree)** for sub-millisecond command matching.
- **LRU Caching**: O(1) retrieval for executed commands and forensic artifact lookups.
- **Mission & Quiz Systems**: 3-tier progressive learning tracks (Foundation, Triage, Deep-Dive) with prerequisite dependency graphs.

### 🔬 4. Specialized Interactive Forensic Labs
- **NetFlow Lab**: Deep packet inspection, exfiltration filtering, and threat priority sorting.
- **Timeline Lab**: Temporal event correlation, phase-based incident reconstruction.
- **Hash Verify Lab**: SHA-256 baseline validation and chain of custody integrity checks.
- **Memory Triage Lab**: Volatile memory process hollowing detection and rootkit analysis.
- **Stego Lab**: LSB differential scanning and covert payload extraction.

### ♿ 5. Accessibility & Smooth User Experience
- **WCAG AA Compliant**: Full keyboard accessibility, ARIA live regions, and screen reader support.
- **Reduced Motion Support**: Global motion toggle persisting in Zustand store for users sensitive to motion.
- **Scroll Isolation**: Background scroll locking on modal dialogs and smooth Lenis scrolling on the main page.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (TypeScript, Strict Mode) |
| **Build Tool** | Vite 7.x (ESNext, Lightning HMR) |
| **Styling** | Tailwind CSS 3.4 (Cyberpunk / Glassmorphism Design System) |
| **3D Graphics** | Three.js, React Three Fiber, React Three Drei |
| **Animations** | Framer Motion, Lenis Smooth Scroll |
| **State Management** | Zustand (Motion and Global UI Preferences) |
| **AI Integration** | Google GenAI SDK (`@google/genai`), OpenAI REST API |
| **Data Structures** | Custom Trie (Prefix Tree), LRU Cache, Directed Graph |
| **Testing** | Vitest, React Testing Library, jsdom |

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Garuda-Netra/Anveshana-Vidya.git
cd Anveshana-Vidya
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the template file to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your API keys (optional — the platform runs offline via the dynamic engine if left empty):
```env
# Google Gemini API Key (Get your free key at https://aistudio.google.com/)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key (https://platform.openai.com/api-keys)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Active AI Provider ('auto' | 'gemini' | 'openai')
VITE_DEFAULT_AI_PROVIDER=auto
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🏗️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR |
| `npm run build` | Compiles TypeScript and creates optimized production bundle in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run test` | Runs automated unit and component tests via Vitest |
| `npm run lint` | Runs ESLint for code quality checks |

---

## 📂 Project Structure

```
Anveshana-Vidya/
├── public/                     # Static assets (favicons, audio)
│   ├── favicon.svg             # High-res Garuda Eagle favicon
│   └── forensics-icon.svg
├── src/
│   ├── ai/
│   │   └── forensecAI.ts       # Multi-provider AI engine (Gemini, OpenAI, Dynamic Engine)
│   ├── components/
│   │   ├── 3d/                 # Three.js WebGL canvas, lights, and 10 models
│   │   │   ├── models/         # HDD, SSD, RAM, Vault, Workstation, Stego, etc.
│   │   │   ├── Canvas3D.tsx    # Responsive 3D/2D switcher container
│   │   │   └── FallbackView.tsx# 2D architectural diagrams
│   │   ├── features/           # Command Center Terminal and Guide Modal
│   │   ├── labs/               # 5 specialized interactive forensic labs
│   │   ├── sections/           # Hero, Modules Grid, Arsenal Showcase, Case Studies
│   │   ├── ui/                 # GlassPanel, Button, Modal, SectionHeader, EagleIcon
│   │   ├── Chatbot.tsx         # Floating FORENSEC AI chat assistant
│   │   ├── Navigation.tsx      # Responsive navigation with scroll spy
│   │   └── Footer.tsx          # Sanskrit śloka signature and credits
│   ├── data/                   # 12 JSON forensic datasets (cases, tools, topics, commands)
│   ├── state/                  # Zustand stores (motionStore)
│   ├── styles/                 # Tailwind design tokens and custom scrollbars
│   ├── utils/                  # Trie, LRUCache, Graph algorithms
│   └── main.tsx                # Application root with Error Boundaries
├── .env.example                # Environment configuration template
├── package.json
└── vite.config.ts
```

---

## 📜 License

Created with precision by **[Garuda-Netra](https://github.com/Garuda-Netra)**.  
Designed for cybersecurity researchers, digital forensic investigators, and students worldwide.
