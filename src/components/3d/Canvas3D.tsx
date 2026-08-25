import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { HDDModel } from './models/HDDModel';
import { SSDModel } from './models/SSDModel';
import { NetworkFlowModel } from './models/NetworkFlowModel';
import { RAMMemoryModel } from './models/RAMMemoryModel';
import { DataCarvingModel } from './models/DataCarvingModel';
import { MobileForensicsModel } from './models/MobileForensicsModel';
import { MalwareCapsuleModel } from './models/MalwareCapsuleModel';
import { StegoMatrixModel } from './models/StegoMatrixModel';
import { ForensicWorkstationModel } from './models/ForensicWorkstationModel';
import { EvidenceVaultModel } from './models/EvidenceVaultModel';
import { FallbackView } from './FallbackView';
import { Button } from '../ui/Button';
import { SceneLights } from './SceneLights';
import { useMotionStore } from '../../state/motionStore';
import { RotateCw, Eye, RefreshCw, Layers } from 'lucide-react';

interface Canvas3DProps {
  scene: string;
  className?: string;
  title?: string;
}

export type ForensicSceneType =
  | 'hdd'
  | 'ssd'
  | 'network'
  | 'ram'
  | 'carving'
  | 'mobile'
  | 'malware'
  | 'stego'
  | 'workstation'
  | 'vault'
  | 'default';

export function resolveModelType(type: string): ForensicSceneType {
  const normalized = (type || '').toLowerCase();

  if (normalized.includes('hdd') || normalized.includes('ntfs') || normalized.includes('disk') || normalized.includes('sleuth')) {
    return 'hdd';
  }
  if (normalized.includes('ssd') || normalized.includes('flash') || normalized.includes('solid-state')) {
    return 'ssd';
  }
  if (normalized.includes('network') || normalized.includes('packet') || normalized.includes('wireshark') || normalized.includes('tcpdump') || normalized.includes('flow') || normalized.includes('cloud') || normalized.includes('email')) {
    return 'network';
  }
  if (normalized.includes('ram') || normalized.includes('memory') || normalized.includes('volatility') || normalized.includes('rekall')) {
    return 'ram';
  }
  if (normalized.includes('carving') || normalized.includes('carve') || normalized.includes('foremost') || normalized.includes('photorec') || normalized.includes('bulk_extractor') || normalized.includes('database') || normalized.includes('linux')) {
    return 'carving';
  }
  if (normalized.includes('mobile') || normalized.includes('phone') || normalized.includes('android') || normalized.includes('ios') || normalized.includes('cellebrite')) {
    return 'mobile';
  }
  if (normalized.includes('malware') || normalized.includes('sandbox') || normalized.includes('ghidra') || normalized.includes('virus') || normalized.includes('capsule')) {
    return 'malware';
  }
  if (normalized.includes('stego') || normalized.includes('steganography') || normalized.includes('pixel') || normalized.includes('hidden')) {
    return 'stego';
  }
  if (normalized.includes('workstation') || normalized.includes('autopsy') || normalized.includes('ftk') || normalized.includes('acquisition') || normalized.includes('artifact')) {
    return 'workstation';
  }
  if (normalized.includes('vault') || normalized.includes('evidence') || normalized.includes('custody') || normalized.includes('legal') || normalized.includes('encase')) {
    return 'vault';
  }

  return 'default';
}

function SceneContent({ type }: { type: string }) {
  const modelType = resolveModelType(type);

  switch (modelType) {
    case 'hdd':
      return <HDDModel />;
    case 'ssd':
      return <SSDModel />;
    case 'network':
      return <NetworkFlowModel />;
    case 'ram':
      return <RAMMemoryModel />;
    case 'carving':
      return <DataCarvingModel />;
    case 'mobile':
      return <MobileForensicsModel />;
    case 'malware':
      return <MalwareCapsuleModel />;
    case 'stego':
      return <StegoMatrixModel />;
    case 'workstation':
      return <ForensicWorkstationModel />;
    case 'vault':
      return <EvidenceVaultModel />;
    default:
      return <ForensicWorkstationModel />;
  }
}

const MODEL_LABELS: Record<ForensicSceneType, { title: string; subtitle: string }> = {
  hdd: { title: 'Magnetic Platter & Actuator', subtitle: 'Sector geometry & mechanical track reading' },
  ssd: { title: 'NAND Flash Architecture', subtitle: 'Controller logic, wear leveling & trim status' },
  network: { title: 'Holographic Network Mesh', subtitle: 'Traffic streams, firewall barriers & C2 telemetry' },
  ram: { title: 'Volatile RAM Address Matrix', subtitle: 'DRAM physical layout, heap injection & page scanning' },
  carving: { title: 'Cluster & Signature Carving Matrix', subtitle: 'Magic byte headers, cluster assembly & slack space' },
  mobile: { title: 'Mobile Forensics & Partition Bus', subtitle: 'JTAG/ISP extraction, /userdata & SQLite databases' },
  malware: { title: 'Malware Containment Sandbox', subtitle: 'Isolated runtime execution, API hooks & shellcode detection' },
  stego: { title: 'Steganography Bitplane Slices', subtitle: 'RGB channel differential analysis & LSB extraction' },
  workstation: { title: 'Cyber Forensics Station & Imager', subtitle: 'Hardware write-blocker, dual monitor triage & evidence bus' },
  vault: { title: 'Cryptographic Chain-of-Custody Vault', subtitle: 'Tamper-evident hashing & court-admissible evidence seal' },
  default: { title: 'Digital Forensic Inspection', subtitle: 'Interactive 3D structural model' },
};

export default function Canvas3D({ scene, className = '', title }: Canvas3DProps) {
  const [is3D, setIs3D] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const reduceMotion = useMotionStore((s) => s.effectiveReduceMotion);

  const modelType = resolveModelType(scene);
  const info = MODEL_LABELS[modelType] || MODEL_LABELS.default;

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className={`w-full h-full relative min-h-[350px] bg-bg-darker/80 border border-accent-neon/20 rounded-xl overflow-hidden shadow-2xl flex flex-col ${className}`}>
      {/* Top Header Bar with Model Badge */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-bg-dark/85 backdrop-blur-md border border-accent-cyan/40 px-3 py-1.5 rounded-lg shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
            <span className="text-white font-bold text-xs font-mono tracking-wider uppercase">
              {title || info.title}
            </span>
          </div>
          <p className="text-text-tertiary text-[11px] font-sans mt-0.5">{info.subtitle}</p>
        </div>

        {/* 3D Interactive Controls */}
        {is3D && (
          <div className="flex items-center gap-1.5 bg-bg-dark/85 backdrop-blur-md border border-border-glass p-1 rounded-lg pointer-events-auto shadow-lg">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded text-xs transition-colors ${autoRotate ? 'bg-accent-neon/20 text-accent-neon' : 'text-text-secondary hover:text-white'}`}
              title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              aria-label="Toggle Auto Rotation"
            >
              <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            </button>
            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded text-xs text-text-secondary hover:text-white transition-colors"
              title="Reset View"
              aria-label="Reset Camera View"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main 3D Canvas / 2D Fallback */}
      <div className="w-full flex-1 relative min-h-0 overflow-hidden">
        {is3D ? (
          <div className="w-full h-full cursor-grab active:cursor-grabbing" role="img" aria-label={`3D visualization for ${scene}`}>
            <Canvas
              frameloop={reduceMotion ? 'demand' : 'always'}
              camera={{ position: [0, 2, 5.5], fov: 45 }}
            >
              <PerspectiveCamera makeDefault position={[0, 2, 5.5]} />
              <SceneLights />

              <Suspense fallback={null}>
                <SceneContent type={scene} />
                <OrbitControls
                  ref={controlsRef}
                  enableZoom={true}
                  enablePan={true}
                  minDistance={2.5}
                  maxDistance={12}
                  autoRotate={autoRotate && !reduceMotion}
                  autoRotateSpeed={1.5}
                />
              </Suspense>
            </Canvas>
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto custom-scroll">
            <FallbackView type={modelType} />
          </div>
        )}
      </div>

      {/* Bottom Footer Bar with 2D/3D Mode Switcher and Interaction Tips */}
      <div className="bg-bg-darker/95 backdrop-blur-md border-t border-border-glass px-4 py-2.5 flex items-center justify-between text-xs z-10 shrink-0">
        <div className="flex items-center gap-3 text-text-tertiary font-mono">
          <span className="hidden sm:inline">🖱️ Drag to rotate</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">🔍 Scroll to zoom</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">🖐️ Shift+Drag to pan</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIs3D(!is3D)}
          className="bg-surface-dark/90 hover:bg-surface-light border border-accent-neon/30 text-accent-neon flex items-center gap-1.5 py-1 px-3 text-xs"
        >
          {is3D ? (
            <>
              <Layers className="w-3.5 h-3.5" />
              <span>Switch to 2D Diagram</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Switch to 3D View</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
