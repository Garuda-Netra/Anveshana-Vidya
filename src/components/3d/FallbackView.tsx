import React from 'react';
import { motion } from 'framer-motion';
import type { ForensicSceneType } from './Canvas3D';
import { Database, Cpu, Wifi, HardDrive, Smartphone, ShieldAlert, FileSearch, Layers, Server, Lock } from 'lucide-react';

interface FallbackViewProps {
  type: ForensicSceneType;
}

interface DiagramInfo {
  icon: React.ReactNode;
  title: string;
  color: string;
  points: string[];
}

const DIAGRAM_DATA: Record<ForensicSceneType, DiagramInfo> = {
  hdd: {
    icon: <HardDrive className="w-12 h-12 text-accent-cyan" />,
    title: 'Magnetic HDD Track & Sector Structure',
    color: 'text-accent-cyan',
    points: [
      'Rotating magnetic platters storing tracks and sectors (512e / 4Kn)',
      'Actuator arm with inductive read/write heads (0.003-inch fly height)',
      'Slack space & unallocated clusters hold recoverable deleted data',
      'MFT (Master File Table) or Inode table indexes all file pointers',
    ],
  },
  ssd: {
    icon: <Database className="w-12 h-12 text-accent-neon" />,
    title: 'Solid State Flash Memory & Wear Leveling',
    color: 'text-accent-neon',
    points: [
      'NAND flash memory cells (SLC/MLC/TLC/QLC) organized in blocks & pages',
      'Flash Translation Layer (FTL) virtualizes physical block addresses',
      'TRIM commands actively zero unallocated sectors in background',
      'Requires hardware-level chip-off or specialized controller imaging',
    ],
  },
  network: {
    icon: <Wifi className="w-12 h-12 text-accent-purple" />,
    title: 'Network Packet Flow & C2 Detection',
    color: 'text-accent-purple',
    points: [
      'PCAP packet streams capture Layer 2 through Layer 7 protocol data',
      'Deep Packet Inspection (DPI) detects C2 beaconing & data exfiltration',
      'NetFlow/IPFIX telemetry aggregates conversation endpoints and bytes',
      'TLS decryption analysis via pre-master secret session keys',
    ],
  },
  ram: {
    icon: <Cpu className="w-12 h-12 text-accent-cyan" />,
    title: 'Volatile RAM Memory & Process Inspection',
    color: 'text-accent-cyan',
    points: [
      'Physical and virtual memory space containing live processes & threads',
      'Unencrypted passwords, cryptographic keys, and ephemeral tokens',
      'Detection of process hollowing, DLL injection, and memory rootkits',
      'Analyzed with frameworks like Volatility and Rekall',
    ],
  },
  carving: {
    icon: <FileSearch className="w-12 h-12 text-accent-neon" />,
    title: 'File Signature & Cluster Carving',
    color: 'text-accent-neon',
    points: [
      'Scans unallocated space for file magic headers (e.g., 0xFFD8 for JPEG)',
      'Validates file footers / trailers to determine stream boundaries',
      'Reassembles contiguous and fragmented cluster chunks without MFT',
      'Utilized by tools like Foremost, Scalpel, and PhotoRec',
    ],
  },
  mobile: {
    icon: <Smartphone className="w-12 h-12 text-accent-cyan" />,
    title: 'Mobile Device Extraction & SQLite Forensics',
    color: 'text-accent-cyan',
    points: [
      'Logical, Physical, and File-System level extractions (AFU / BFU)',
      'Extraction of SQLite databases (SMS, Call logs, WhatsApp, Signal)',
      'Hardware JTAG, ISP, and Chip-Off techniques for damaged devices',
      'Keychain and Keystore hardware secure enclave extraction',
    ],
  },
  malware: {
    icon: <ShieldAlert className="w-12 h-12 text-red-400" />,
    title: 'Malware Sandbox & Dynamic Analysis',
    color: 'text-red-400',
    points: [
      'Isolated hypervisor / container execution for untrusted binaries',
      'API hooking captures registry modifications, file drops & processes',
      'Network containment intercepts DNS queries and HTTP/TLS traffic',
      'Disassembly & decompilation using Ghidra, IDA Pro, and Radare2',
    ],
  },
  stego: {
    icon: <Layers className="w-12 h-12 text-accent-purple" />,
    title: 'Steganography & LSB Bitplane Extraction',
    color: 'text-accent-purple',
    points: [
      'Hidden data embedded in Least Significant Bits of image/audio bytes',
      'Color channel variance & entropy analysis locate payload regions',
      'Passphrase extraction and cryptographic payload decryption',
      'Tools like StegSolve, Steghide, and Zsteg detect covert channels',
    ],
  },
  workstation: {
    icon: <Server className="w-12 h-12 text-accent-cyan" />,
    title: 'Forensic Workstation & Hardware Imager',
    color: 'text-accent-cyan',
    points: [
      'Hardware write-blockers prevent physical write modifications (Read-Only)',
      'Bit-stream disk imaging generates E01 and raw DD evidence images',
      'Multi-threaded hash generation (MD5, SHA-1, SHA-256) during ingest',
      'Dual-screen triage for timeline analysis and artifact correlation',
    ],
  },
  vault: {
    icon: <Lock className="w-12 h-12 text-accent-neon" />,
    title: 'Chain-of-Custody & Cryptographic Evidence Seal',
    color: 'text-accent-neon',
    points: [
      'Strict legal documentation of evidence possession from scene to court',
      'Cryptographic SHA-256 hash matching guarantees zero evidence alteration',
      'Tamper-evident physical security bags with unique barcoded serials',
      'Ensures full compliance with Federal Rules of Evidence (FRE 901/902)',
    ],
  },
  default: {
    icon: <HardDrive className="w-12 h-12 text-text-secondary" />,
    title: 'Digital Forensic Component Diagram',
    color: 'text-text-secondary',
    points: [
      'Forensic data structure representation',
      'Inspect physical and logical evidence boundaries',
      'Verify cryptographic hash integrity',
    ],
  },
};

export const FallbackView: React.FC<FallbackViewProps> = ({ type }) => {
  const data = DIAGRAM_DATA[type] || DIAGRAM_DATA.default;

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center pt-16 pb-6 px-4 bg-gradient-to-b from-surface-dark/90 to-bg-darker/95">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full bg-bg-dark/90 border border-border-glass rounded-xl p-5 shadow-2xl flex flex-col items-center text-center my-auto"
      >
        <div className="p-3 rounded-xl bg-bg-darker/90 border border-border-glass shadow-inner mb-3">
          {data.icon}
        </div>

        <h3 className={`text-base md:text-lg font-bold ${data.color} mb-1 font-mono`}>{data.title}</h3>
        <p className="text-[11px] text-text-tertiary mb-3 font-mono">2D Forensic Architecture Diagram</p>

        <div className="w-full space-y-1.5 text-left bg-surface-dark/70 p-3 rounded-lg border border-border-glass/40">
          {data.points.map((pt, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
              <span className={`font-bold ${data.color} mt-0.5`}>▸</span>
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
