import { useState } from 'react';
import Canvas3D from '../3d/Canvas3D';
import { Wifi, Cpu, HardDrive, Database, Smartphone, ShieldAlert, Layers, Server, Lock } from 'lucide-react';

interface VisualizationLabProps {
  initialScene?: string;
}

const AVAILABLE_MODELS = [
  { id: 'network-packet-flow', label: 'Network Packet Flow', icon: Wifi, cat: 'Network' },
  { id: 'ram-memory-model', label: 'Volatile RAM Module', icon: Cpu, cat: 'Memory' },
  { id: 'data-carving-visualization', label: 'Data Carving Matrix', icon: Database, cat: 'Disk' },
  { id: 'hdd-animation', label: 'Magnetic HDD Platters', icon: HardDrive, cat: 'Disk' },
  { id: 'ssd-animation', label: 'NAND Flash SSD', icon: Database, cat: 'Disk' },
  { id: 'mobile-forensic-model', label: 'Mobile Device Extractor', icon: Smartphone, cat: 'Mobile' },
  { id: 'malware-capsule-model', label: 'Malware Sandbox Capsule', icon: ShieldAlert, cat: 'Malware' },
  { id: 'stego-matrix-model', label: 'Steganography Bitplanes', icon: Layers, cat: 'Anti-Forensics' },
  { id: 'forensic-workstation', label: 'Forensic Workstation & Imager', icon: Server, cat: 'Station' },
  { id: 'evidence-vault', label: 'Chain-of-Custody Vault', icon: Lock, cat: 'Legal' },
];

export function VisualizationLab({ initialScene = 'network-packet-flow' }: VisualizationLabProps) {
  const [activeScene, setActiveScene] = useState(initialScene);

  return (
    <div className="space-y-4">
      {/* Model Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-accent-neon/30">
        {AVAILABLE_MODELS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScene === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScene(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-accent-neon/20 border-accent-neon text-accent-neon font-bold shadow-neon-sm'
                  : 'bg-bg-dark/80 border-border-glass text-text-secondary hover:text-white hover:border-accent-cyan/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Canvas Viewer Container */}
      <div className="w-full h-[58vh] min-h-[460px] rounded-xl overflow-hidden border border-border-glass">
        <Canvas3D scene={activeScene} />
      </div>
    </div>
  );
}
