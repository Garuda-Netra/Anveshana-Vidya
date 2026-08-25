import { useState, useRef, useEffect, useMemo, useId, useCallback, lazy, Suspense, Component } from 'react';
import type { ReactNode } from 'react';
import {
  X, Minus, Square, Terminal as TerminalIcon,
  Search, Command, ChevronRight, Download, Copy,
  Activity, Cpu, Shield, Wifi, Database, FileText,
  AlertCircle, CheckCircle2, BookOpen, Sparkles, HelpCircle
} from 'lucide-react';
import forensicGlossary from '../../data/forensicGlossary.json';
import forensicQuiz from '../../data/forensicQuiz.json';
import forensicQuizBank from '../../data/forensicQuizBank.json';
import missions from '../../data/missions.json';
import cases from '../../data/cases.json';
import caseEvents from '../../data/caseEvents.json';
import basicCommandsData from '../../data/forensicCommands.json';
import enhancedCommandsData from '../../data/forensicCommandsEnhanced.json';
import commandHelpData from '../../data/commandHelp.json';

import type { NetflowRecord, NetflowSortKey } from '../labs/NetflowLab';
import type { TimelineDataset } from '../labs/TimelineLab';
import type { HashVerifyState } from '../labs/HashVerifyLab';
import type { MemoryProcess, RiskFilter } from '../labs/MemoryTriageLab';
import type { StegoDetectState, StegoStep } from '../labs/StegoDetectLab';

const LabPanel = lazy(() => import('../labs/LabPanel').then(mod => ({ default: mod.LabPanel })));
const NetflowLab = lazy(() => import('../labs/NetflowLab').then(mod => ({ default: mod.NetflowLab })));
const TimelineLab = lazy(() => import('../labs/TimelineLab').then(mod => ({ default: mod.TimelineLab })));
const HashVerifyLab = lazy(() => import('../labs/HashVerifyLab').then(mod => ({ default: mod.HashVerifyLab })));
const MemoryTriageLab = lazy(() => import('../labs/MemoryTriageLab').then(mod => ({ default: mod.MemoryTriageLab })));
const StegoDetectLab = lazy(() => import('../labs/StegoDetectLab').then(mod => ({ default: mod.StegoDetectLab })));
const VisualizationLab = lazy(() => import('../labs/VisualizationLab').then(mod => ({ default: mod.VisualizationLab })));
const CommandGuideModal = lazy(() => import('./CommandGuideModal'));

// --- Error Boundary ---

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('[telemetry] boundary-error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --- Types ---

interface CommandEntry {
  input: string;
  output: string | JSX.Element;
  timestamp: number;
  status: 'success' | 'error' | 'info';
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface BasicCommandEntry {
  command: string;
  category: string;
  description: string;
  simulatedOutput?: string;
  forensicUse?: string;
  usage?: string;
}

interface EnhancedCommandEntry {
  name: string;
  category: string;
  description: string;
  output_example?: string;
  explain?: string;
  simulatedOutput?: string;
  forensicUse?: string;
  aliases?: string[];
}

interface QuizBankQuestion {
  id: number;
  tier: 'foundation' | 'triage' | 'deep-dive';
  question: string;
  options: string[];
  correct: number;
  rationale: string;
  references: {
    module_id: string;
    case_id: string | null;
  };
}

interface MissionStep {
  id: string;
  instruction: string;
  requiredCommand: string;
  validationPattern: string;
  successMessage: string;
  hint: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'foundation' | 'triage' | 'deep-dive';
  estimatedTime: string;
  prerequisites: string[];
  references: {
    module_ids: string[];
    case_id: string | null;
  };
  steps: MissionStep[];
  completionMessage: string;
  reward: {
    badge: string;
    xp: number;
  };
}

interface MissionProgress {
  missionId: string;
  currentStep: number;
  startedAt: number;
  completedSteps: string[];
}

type LabView = 'netflow' | 'timeline' | 'hash' | 'memory' | 'stego' | '3d';

interface LabSessions {
  netflow: {
    sortKey: NetflowSortKey;
    sortDirection: 'asc' | 'desc';
    showOnlyFlagged: boolean;
  };
  timeline: {
    activeCaseId: string;
  };
  hash: HashVerifyState;
  memory: {
    riskFilter: RiskFilter;
    showOnlyAnomalies: boolean;
  };
  stego: StegoDetectState;
  threeD: {
    activeScene: string;
  };
}

const LAB_INTRO_COPY: Record<LabView, string> = {
  netflow: 'NetFlow trace lab armed. Sort flows, review priority flags, and note C2 beacons.',
  timeline: 'Timeline visualization ready. Pivot across case.events datasets for phase analysis.',
  hash: 'Hash verification module loaded. Compare evidence hashes against reference SHA-256 baseline.',
  memory: 'Memory triage console online. Filter Volatility snapshot by risk and anomaly signature.',
  stego: 'Stego detection pipeline staged. Run deterministic extraction to inspect LSB channels.',
  '3d': '3D Forensic Holographic Lab loaded. Select any digital forensic model to rotate and inspect.'
};

const LAB_METADATA: Record<LabView, { title: string; subtitle: string }> = {
  netflow: { title: 'NetFlow Trace Lab', subtitle: 'Sortable flows + anomaly flags + C2 beacon detection' },
  timeline: { title: 'Case Timeline Graph', subtitle: 'Chronological event pivot across investigation stages' },
  hash: { title: 'Cryptographic Hash Verification Station', subtitle: 'Compare SHA-256 evidence integrity fingerprints' },
  memory: { title: 'Memory Triage Console', subtitle: 'Volatility snapshot analysis & process anomaly filters' },
  stego: { title: 'Stego Detect Pipeline', subtitle: 'Multi-stage LSB carrier scanning & payload carving' },
  '3d': { title: '3D Forensic Holographic Inspection Lab', subtitle: 'Interactive 3D models for storage, memory, network, and artifacts' }
};

// --- Fixtures ---

const TIMELINE_DATASETS = caseEvents as TimelineDataset[];

const NETFLOW_FIXTURE: NetflowRecord[] = [
  { id: 'flow-1', time: '11:20:14', source: '10.10.24.7:443', destination: '203.0.113.87:8443', bytes: 18765432, protocol: 'TLS', flags: 'critical', note: 'Bulk exfiltration to C2 node' },
  { id: 'flow-2', time: '11:11:02', source: '10.10.33.12:5985', destination: '10.10.45.5:5985', bytes: 35673, protocol: 'WinRM', flags: 'suspicious', note: 'PsExec lateral movement (admin$)' },
  { id: 'flow-3', time: '11:05:44', source: '10.10.24.7:53', destination: '198.51.100.24:53', bytes: 1248, protocol: 'DNS', flags: 'benign', note: 'Baseline DNS noise' },
  { id: 'flow-4', time: '10:59:03', source: '10.10.24.7:49812', destination: '203.0.113.87:53', bytes: 94731, protocol: 'UDP', flags: 'suspicious', note: 'DNS tunneling beacon (TXT payload)' },
  { id: 'flow-5', time: '10:47:28', source: '10.10.19.4:445', destination: '10.10.33.12:445', bytes: 563421, protocol: 'SMB', flags: 'benign', note: 'File server replication window' }
];

const MEMORY_FIXTURE: MemoryProcess[] = [
  { pid: 1180, name: 'lsass.exe', user: 'NT AUTHORITY', integrity: 'system', anomaly: 'credential-dump', note: 'Mimikatz signature detected in memory region 0x1f000', risk: 'high' },
  { pid: 2336, name: 'powershell.exe', user: 'FINANCE\\svc_admin', integrity: 'high', anomaly: 'suspicious-network', note: 'Encoded command launching Invoke-PSExec', risk: 'high' },
  { pid: 3104, name: 'cscript.exe', user: 'FINANCE\\hr-analyst', integrity: 'medium', anomaly: 'unsigned-module', note: 'Unsigned DLL injected (C:\\Temp\\update.dll)', risk: 'medium' },
  { pid: 420, name: 'explorer.exe', user: 'FINANCE\\hr-analyst', integrity: 'medium', anomaly: 'none', note: 'No findings', risk: 'low' },
  { pid: 5120, name: 'svchost.exe', user: 'NT AUTHORITY', integrity: 'system', anomaly: 'none', note: 'Service host baseline', risk: 'low' }
];

const STEGO_TEMPLATE: StegoStep[] = [
  { id: 'ingest', label: 'Ingest Carrier', detail: 'Parse PNG container, confirm IHDR/IDAT integrity', status: 'pending' },
  { id: 'lsb', label: 'LSB Differential Scan', detail: 'Compare RGB bit planes for entropy spikes', status: 'pending' },
  { id: 'extract', label: 'Payload Extraction', detail: 'Assemble detected bitstream into archive', status: 'pending' },
  { id: 'report', label: 'Result Packaging', detail: 'Document findings and carve output ZIP', status: 'pending' }
];

const STEGO_RESULTS: Record<string, string> = {
  ingest: 'Carrier hash matches evidence (sha256 7d0d...).',
  lsb: 'Located 3 anomalous regions (blocks 14, 27, 42).',
  extract: 'Recovered zip fragment (32KB) – requires password.',
  report: 'Derived passphrase from EXIF Creator → full ZIP rebuilt.'
};

const HASH_BASELINE: HashVerifyState = {
  knownSha256: '4f6e2d4b39f708ad56df833c0b1e580b0c219c2c2bc0a3106b572f5b5f7b1f4d',
  referenceLabel: 'FTK image – patient-zero memory dump (287GB E01)',
  userInput: '',
  lastResult: 'idle'
};

const LAB_COMMANDS = ['trace', 'timeline', 'hash verify', 'mem scan', 'stego detect', '3d', 'visualize'];
const LEARNING_COMMANDS = [
  'quiz', 'quiz foundation', 'quiz triage', 'quiz deep-dive',
  'mission', 'mission list', 'mission start', 'mission status', 'mission hint', 'mission abandon', 'case'
];
const BUILTIN_COMMANDS = [
  'help', 'guide', 'tutorial', 'cheatsheet', 'commands', 'arsenal',
  'helpcat', 'glossary', 'workflow', 'clear', 'explain', 'info', 'man',
  'sysinfo', 'status', 'history', 'ls', 'dir', 'whoami', 'pwd', 'date', 'cat', 'ps', 'netstat'
];

// Statically loaded registries to guarantee 100% immediate availability without hydration delay
const BASIC_COMMANDS = basicCommandsData as BasicCommandEntry[];
const ENHANCED_COMMANDS = enhancedCommandsData as EnhancedCommandEntry[];
const COMMAND_HELP = commandHelpData;

// --- Helper Components ---

const StreamingText = ({ text, speed = 8, onComplete }: { text: string; speed?: number; onComplete?: () => void }) => {
  const [displayed, setDisplayed] = useState('');
  const index = useRef(0);

  useEffect(() => {
    index.current = 0;
    setDisplayed('');

    const interval = setInterval(() => {
      if (index.current < text.length) {
        setDisplayed((prev) => prev + text.charAt(index.current));
        index.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span>{displayed}</span>;
};

// --- Quick Prompt Chips ---

const QUICK_CHIPS = [
  { label: '📖 Guide', cmd: 'guide', color: 'border-accent-cyan/40 text-accent-cyan bg-accent-cyan/10' },
  { label: '⚡ Cheatsheet', cmd: 'cheatsheet', color: 'border-accent-neon/40 text-accent-neon bg-accent-neon/10' },
  { label: '📡 Trace Lab', cmd: 'trace', color: 'border-accent-purple/40 text-accent-purple bg-accent-purple/10' },
  { label: '🧠 Memory Scan', cmd: 'mem scan', color: 'border-accent-cyan/40 text-accent-cyan bg-accent-cyan/10' },
  { label: '🧊 3D Network', cmd: '3d network', color: 'border-accent-neon/40 text-accent-neon bg-accent-neon/10' },
  { label: '🎯 Start Mission', cmd: 'mission start mission-1', color: 'border-yellow-400/40 text-yellow-400 bg-yellow-400/10' },
  { label: '❓ Quiz Triage', cmd: 'quiz triage', color: 'border-green-400/40 text-green-400 bg-green-400/10' },
  { label: '🔍 Volatility', cmd: 'volatility -f memory.raw pslist', color: 'border-accent-cyan/40 text-accent-cyan bg-accent-cyan/10' },
];

// --- Main Component ---

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandEntry[]>([
    {
      input: '',
      output: (
        <div className="space-y-2 animate-fade-in">
          <p className="text-accent-neon font-bold text-base md:text-lg">╔════════════════════════════════════════════════════════════╗</p>
          <p className="text-accent-neon font-bold text-base md:text-lg">║  FORENSEC COMMAND CENTER v3.5 • DIGITAL ARSENAL            ║</p>
          <p className="text-accent-neon font-bold text-base md:text-lg">║  200+ Commands • 3D Holographic Visualizers • Labs         ║</p>
          <p className="text-accent-neon font-bold text-base md:text-lg">╚════════════════════════════════════════════════════════════╝</p>
          <p className="text-text-secondary text-sm">Interactive forensic workstation simulator with simulated execution, 3D evidence inspection, and guided missions.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-border-glass text-xs">
            <p className="text-text-secondary">▸ <span className="text-accent-neon font-bold">guide</span> - Interactive walkthrough of the terminal</p>
            <p className="text-text-secondary">▸ <span className="text-accent-neon font-bold">cheatsheet</span> - Full forensic command matrix</p>
            <p className="text-text-secondary">▸ <span className="text-accent-cyan font-bold">3d [network|ram|hdd|malware]</span> - 3D visualizers</p>
            <p className="text-text-secondary">▸ <span className="text-accent-purple font-bold">trace / mem scan / hash verify</span> - Interactive labs</p>
            <p className="text-text-secondary">▸ <span className="text-yellow-400 font-bold">mission list / start</span> - Guided forensic challenges</p>
            <p className="text-text-secondary">▸ <span className="text-green-400 font-bold">quiz [foundation|triage]</span> - Knowledge tests</p>
          </div>
          
          <p className="text-text-tertiary text-xs mt-2 italic">
            💡 Tip: Click any quick command pill below or press <span className="text-accent-neon font-mono font-bold">Ctrl+K</span> to open the Command Palette.
          </p>
        </div>
      ),
      timestamp: Date.now(),
      status: 'info'
    }
  ]);

  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [currentQuizBank, setCurrentQuizBank] = useState<QuizBankQuestion | null>(null);
  const [activeMission, setActiveMission] = useState<MissionProgress | null>(null);
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [paletteActiveIndex, setPaletteActiveIndex] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalState, setTerminalState] = useState<'idle' | 'processing' | 'error' | 'success'>('idle');
  const [executedCategories, setExecutedCategories] = useState<Set<string>>(new Set(['CORE', 'SYSTEM']));
  const [activeLab, setActiveLab] = useState<LabView | null>(null);

  const [labSessions, setLabSessions] = useState<LabSessions>({
    netflow: {
      sortKey: 'bytes',
      sortDirection: 'desc',
      showOnlyFlagged: true
    },
    timeline: {
      activeCaseId: TIMELINE_DATASETS[0]?.caseId ?? 'ransomware-investigation'
    },
    hash: { ...HASH_BASELINE },
    memory: {
      riskFilter: 'all',
      showOnlyAnomalies: false
    },
    stego: {
      steps: STEGO_TEMPLATE.map(step => ({ ...step })),
      status: 'idle'
    },
    threeD: {
      activeScene: 'network-packet-flow'
    }
  });

  const [supportsBackdrop, setSupportsBackdrop] = useState(false);
  const stegoTimers = useRef<number[]>([]);
  const suggestionListId = `${useId()}-suggestions`;
  const paletteListId = `${useId()}-palette`;
  const sessionId = useMemo(() => Math.floor(Math.random() * 9000) + 1000, []);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  // Derived list of all recognized commands and aliases
  const allCommands = useMemo(() => {
    const enhancedNames = ENHANCED_COMMANDS.map(c => c.name);
    const enhancedAliases = ENHANCED_COMMANDS.flatMap(c => c.aliases || []);
    const basicNames = BASIC_COMMANDS.map(c => c.command);
    const combined = new Set([
      ...enhancedNames,
      ...enhancedAliases,
      ...basicNames,
      ...LAB_COMMANDS,
      ...LEARNING_COMMANDS,
      ...BUILTIN_COMMANDS
    ]);
    return Array.from(combined).sort();
  }, []);

  const filteredCommands = useMemo(() => {
    if (!paletteSearch) return allCommands;
    return allCommands.filter(c => c.toLowerCase().includes(paletteSearch.toLowerCase()));
  }, [allCommands, paletteSearch]);

  // Detect backdrop-filter support for blur fallback
  useEffect(() => {
    const testBackdrop = CSS.supports('backdrop-filter', 'blur(10px)') || CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
    setSupportsBackdrop(testBackdrop);
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 150);
      return;
    }

    if (isPaletteOpen) {
      setTimeout(() => paletteInputRef.current?.focus({ preventScroll: true }), 50);
    } else if (!isGuideOpen) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [isPaletteOpen, isGuideOpen]);

  useEffect(() => {
    if (input.trim()) {
      const needle = input.toLowerCase();
      const matches = allCommands.filter(c => c.toLowerCase().startsWith(needle)).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
    setActiveSuggestionIndex(-1);
  }, [input, allCommands]);

  const clearStegoTimers = useCallback(() => {
    stegoTimers.current.forEach(timer => window.clearTimeout(timer));
    stegoTimers.current = [];
  }, []);

  useEffect(() => () => clearStegoTimers(), [clearStegoTimers]);

  // Contain wheel scrolling within terminal
  useEffect(() => {
    const terminalBody = terminalBodyRef.current;
    if (!terminalBody) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = terminalBody;
      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const isAtTop = scrollTop === 0;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

      if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
        e.stopPropagation();
      }
    };

    terminalBody.addEventListener('wheel', handleWheel, { passive: false });
    return () => terminalBody.removeEventListener('wheel', handleWheel);
  }, []);

  // Handlers
  const focusInput = () => {
    if (!isPaletteOpen && !isGuideOpen) inputRef.current?.focus({ preventScroll: true });
  };

  const addToHistory = (cmd: string, output: string | JSX.Element, status: 'success' | 'error' | 'info' = 'success') => {
    setHistory(prev => [...prev, { input: cmd, output, timestamp: Date.now(), status }]);
    setTerminalState(status === 'error' ? 'error' : 'success');
    setTimeout(() => setTerminalState('idle'), 1000);
  };

  const updateNetflowSort = useCallback((key: NetflowSortKey, direction: 'asc' | 'desc') => {
    setLabSessions(prev => ({
      ...prev,
      netflow: { ...prev.netflow, sortKey: key, sortDirection: direction }
    }));
  }, []);

  const toggleNetflowFlag = useCallback(() => {
    setLabSessions(prev => ({
      ...prev,
      netflow: { ...prev.netflow, showOnlyFlagged: !prev.netflow.showOnlyFlagged }
    }));
  }, []);

  const changeTimelineCase = useCallback((caseId: string) => {
    setLabSessions(prev => ({
      ...prev,
      timeline: { activeCaseId: caseId }
    }));
  }, []);

  const handleHashInputChange = useCallback((value: string) => {
    setLabSessions(prev => ({
      ...prev,
      hash: { ...prev.hash, userInput: value }
    }));
  }, []);

  const handleHashVerify = useCallback(() => {
    setLabSessions(prev => {
      const normalizedInput = prev.hash.userInput.trim().toLowerCase();
      const normalizedKnown = prev.hash.knownSha256.toLowerCase();
      const matches = normalizedInput.length > 0 && normalizedInput === normalizedKnown;
      return {
        ...prev,
        hash: {
          ...prev.hash,
          lastResult: matches ? 'match' : 'mismatch'
        }
      };
    });
  }, []);

  const changeRiskFilter = useCallback((risk: RiskFilter) => {
    setLabSessions(prev => ({
      ...prev,
      memory: { ...prev.memory, riskFilter: risk }
    }));
  }, []);

  const toggleAnomalyFilter = useCallback(() => {
    setLabSessions(prev => ({
      ...prev,
      memory: { ...prev.memory, showOnlyAnomalies: !prev.memory.showOnlyAnomalies }
    }));
  }, []);

  const runStegoPipeline = useCallback(() => {
    clearStegoTimers();
    setLabSessions(prev => ({
      ...prev,
      stego: {
        status: 'running',
        lastRunAt: prev.stego.lastRunAt,
        steps: STEGO_TEMPLATE.map((step, index) => ({
          ...step,
          status: (index === 0 ? 'running' : 'pending') as StegoStep['status'],
          result: undefined
        }))
      }
    }));

    STEGO_TEMPLATE.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        setLabSessions(prev => {
          const steps = prev.stego.steps.map((existing, idx) => {
            if (existing.id === step.id) {
              return { ...existing, status: 'complete' as const, result: STEGO_RESULTS[existing.id] };
            }
            if (idx === index + 1 && existing.status === 'pending') {
              return { ...existing, status: 'running' as const };
            }
            return existing;
          });
          const status: StegoDetectState['status'] = index === STEGO_TEMPLATE.length - 1 ? 'complete' : 'running';
          return {
            ...prev,
            stego: {
              ...prev.stego,
              steps,
              status,
              lastRunAt: status === 'complete' ? new Date().toLocaleTimeString() : prev.stego.lastRunAt
            }
          };
        });
      }, 800 * (index + 1));
      stegoTimers.current.push(timer);
    });
  }, [clearStegoTimers]);

  // Main Command Processor
  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const parts = lower.split(/\s+/);
    const mainCmd = parts[0];
    const args = parts.slice(1);

    // Resolve Interactive Labs
    const resolveLab = (): { view: LabView; scene?: string } | null => {
      if (lower === 'trace') return { view: 'netflow' };
      if (lower.startsWith('timeline')) return { view: 'timeline' };
      if (lower.startsWith('hash verify') || lower === 'hash') return { view: 'hash' };
      if (lower.startsWith('mem scan') || lower === 'memscan') return { view: 'memory' };
      if (lower.startsWith('stego detect') || lower === 'stegodetect') return { view: 'stego' };
      if (lower.startsWith('3d') || lower.startsWith('visualize') || lower === 'view 3d') {
        const sceneArg = args[0] || 'network';
        return { view: '3d', scene: sceneArg };
      }
      return null;
    };

    const maybeLab = resolveLab();
    if (maybeLab) {
      if (maybeLab.view === 'timeline' && args[0]) {
        const caseId = args[0];
        const dataset = TIMELINE_DATASETS.find(entry => entry.caseId === caseId);
        if (dataset) changeTimelineCase(dataset.caseId);
      }
      if (maybeLab.view === 'hash' && args[0]) {
        handleHashInputChange(args[0]);
      }
      if (maybeLab.view === '3d' && maybeLab.scene) {
        setLabSessions(prev => ({ ...prev, threeD: { activeScene: maybeLab.scene! } }));
      }
      setActiveLab(maybeLab.view);
      setExecutedCategories(prev => new Set(prev).add('LABS'));
      addToHistory(cmd, <p className="text-text-secondary">{LAB_INTRO_COPY[maybeLab.view]}</p>, 'info');
      return;
    }

    let output: string | JSX.Element = '';
    let status: 'success' | 'error' | 'info' = 'success';

    // Quiz Logic - Legacy Quiz
    if (currentQuiz && ['a', 'b', 'c', 'd'].includes(mainCmd)) {
      const answerIndex = mainCmd.charCodeAt(0) - 97;
      const isCorrect = answerIndex === currentQuiz.correct;

      output = (
        <div className="space-y-2">
          <p className={isCorrect ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
            {isCorrect ? '✓ CORRECT!' : '✗ INCORRECT'}
          </p>
          <p className="text-text-secondary">{currentQuiz.explanation}</p>
          <p className="text-accent-purple mt-2">Type <span className="text-accent-neon font-bold">quiz</span> for another question</p>
        </div>
      );
      setCurrentQuiz(null);
      addToHistory(cmd, output, isCorrect ? 'success' : 'error');
      return;
    }

    // Quiz Logic - Tiered Quiz Bank
    if (currentQuizBank && ['a', 'b', 'c', 'd'].includes(mainCmd)) {
      const answerIndex = mainCmd.charCodeAt(0) - 97;
      const isCorrect = answerIndex === currentQuizBank.correct;

      const tierColors: Record<string, string> = {
        foundation: 'text-green-400',
        triage: 'text-yellow-400',
        'deep-dive': 'text-red-400'
      };

      output = (
        <div className="space-y-2">
          <p className={isCorrect ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
            {isCorrect ? '✓ CORRECT!' : '✗ INCORRECT'}
          </p>
          <p className={`${tierColors[currentQuizBank.tier]} text-xs uppercase font-bold`}>
            {currentQuizBank.tier.replace('-', ' ')} tier
          </p>
          <p className="text-text-secondary mt-2">{currentQuizBank.rationale}</p>
          {currentQuizBank.references.case_id && (
            <p className="text-accent-cyan text-sm mt-1">
              📁 Related case: <span className="text-accent-neon">{currentQuizBank.references.case_id}</span>
            </p>
          )}
          {currentQuizBank.references.module_id && (
            <p className="text-accent-purple text-sm">
              📚 Module: <span className="text-accent-neon">{currentQuizBank.references.module_id}</span>
            </p>
          )}
          <p className="text-accent-purple mt-2">
            Type <span className="text-accent-neon font-bold">quiz {currentQuizBank.tier}</span> for another challenge.
          </p>
        </div>
      );
      setCurrentQuizBank(null);
      addToHistory(cmd, output, isCorrect ? 'success' : 'error');
      return;
    }

    // Mission Step Validation
    if (activeMission && !['a', 'b', 'c', 'd'].includes(mainCmd)) {
      const missionData = (missions as Mission[]).find(m => m.id === activeMission.missionId);
      if (missionData) {
        const currentStep = missionData.steps[activeMission.currentStep];
        if (currentStep) {
          const pattern = new RegExp(currentStep.validationPattern, 'i');
          if (pattern.test(lower)) {
            const isLastStep = activeMission.currentStep >= missionData.steps.length - 1;

            if (isLastStep) {
              setCompletedMissions(prev => new Set(prev).add(activeMission.missionId));
              setActiveMission(null);

              output = (
                <div className="space-y-2">
                  <p className="text-green-400 font-bold text-lg">🎉 MISSION COMPLETE!</p>
                  <p className="text-accent-neon font-bold">{missionData.title}</p>
                  <p className="text-text-secondary">{currentStep.successMessage}</p>
                  <div className="mt-3 p-3 bg-green-900/30 border border-green-500/50 rounded">
                    <p className="text-green-400">{missionData.completionMessage}</p>
                    <p className="text-accent-cyan mt-2">
                      🏆 Badge earned: <span className="text-accent-neon font-bold">{missionData.reward.badge}</span>
                    </p>
                    <p className="text-accent-purple">
                      ⭐ XP gained: <span className="text-accent-neon font-bold">+{missionData.reward.xp}</span>
                    </p>
                  </div>
                </div>
              );
              addToHistory(cmd, output, 'success');
              return;
            } else {
              const nextStep = missionData.steps[activeMission.currentStep + 1];
              setActiveMission(prev => prev ? {
                ...prev,
                currentStep: prev.currentStep + 1,
                completedSteps: [...prev.completedSteps, currentStep.id]
              } : null);

              output = (
                <div className="space-y-2">
                  <p className="text-green-400 font-bold">✓ Step {activeMission.currentStep + 1}/{missionData.steps.length} Complete</p>
                  <p className="text-text-secondary">{currentStep.successMessage}</p>
                  <div className="mt-3 p-2 bg-surface-elevated/50 border-l-2 border-accent-neon">
                    <p className="text-accent-cyan text-sm font-bold">NEXT OBJECTIVE:</p>
                    <p className="text-text-primary">{nextStep.instruction}</p>
                  </div>
                </div>
              );
              addToHistory(cmd, output, 'success');
            }
          }
        }
      }
    }

    // Built-in & Standard CLI Commands
    switch (mainCmd) {
      case 'help':
        {
          const categories = COMMAND_HELP.categories;
          output = (
            <div className="space-y-3">
              <p className="text-accent-neon font-bold text-base border-b border-accent-neon pb-1">
                ═══ FORENSEC COMMAND ARSENAL ═══
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" role="list">
                {Object.entries(categories).map(([cat, desc]) => (
                  <p key={cat} role="listitem" className="text-text-secondary">
                    <span className="text-accent-cyan font-mono font-bold">{cat}</span> - {desc}
                  </p>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-border-glass space-y-1 text-xs">
                <p className="text-accent-purple">💡 <span className="text-accent-neon font-bold">guide</span> - Open full interactive user guide</p>
                <p className="text-accent-purple">💡 <span className="text-accent-neon font-bold">cheatsheet</span> - Categorized cheatsheet</p>
                <p className="text-accent-purple">💡 <span className="text-accent-neon font-bold">helpcat &lt;category&gt;</span> - View commands in category</p>
                <p className="text-accent-purple">💡 <span className="text-accent-neon font-bold">explain &lt;command&gt;</span> - Forensic context & usage</p>
                <p className="text-accent-purple">💡 <span className="text-accent-neon font-bold">3d [network|ram|hdd|malware]</span> - 3D visualizers</p>
                <p className="text-accent-purple">💡 <span className="text-accent-neon font-bold">trace / mem scan / hash verify</span> - Launch labs</p>
              </div>
            </div>
          );
        }
        break;

      case 'guide':
      case 'tutorial':
        setIsGuideOpen(true);
        output = (
          <div className="space-y-2">
            <p className="text-accent-neon font-bold">📘 COMMAND CENTER USER GUIDE</p>
            <p className="text-text-secondary text-sm">Opened the interactive cheatsheet & guide modal. You can review all command categories, usage syntax, and trigger 1-click execution.</p>
            <div className="p-3 bg-bg-dark/70 rounded-lg border border-border-glass text-xs space-y-1">
              <p className="text-white font-bold">Quick Navigation Tips:</p>
              <p className="text-text-secondary">• Type any forensic tool name (e.g. <code className="text-accent-cyan font-bold">volatility</code>, <code className="text-accent-cyan font-bold">wireshark</code>, <code className="text-accent-cyan font-bold">dd</code>) to simulate execution.</p>
              <p className="text-text-secondary">• Press <code className="text-accent-neon font-bold">Tab</code> to autocomplete command names.</p>
              <p className="text-text-secondary">• Press <code className="text-accent-neon font-bold">Ctrl+K</code> anytime to open the instant Command Palette.</p>
            </div>
          </div>
        );
        break;

      case 'cheatsheet':
      case 'commands':
      case 'arsenal':
        output = (
          <div className="space-y-3">
            <p className="text-accent-neon font-bold text-base">═══ FORENSIC CHEATSHEET & QUICK COMMANDS ═══</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-bg-dark/80 p-3 rounded-lg border border-accent-cyan/30">
                <p className="text-accent-cyan font-bold mb-1">🔍 Memory & Triage</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">volatility</span> - Memory dump process & C2 analysis</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">mem scan</span> - Interactive volatility lab</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">rekall</span> - Live kernel rootkit inspection</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">3d ram</span> - 3D RAM memory model</p>
              </div>
              <div className="bg-bg-dark/80 p-3 rounded-lg border border-accent-purple/30">
                <p className="text-accent-purple font-bold mb-1">🌐 Network Forensics</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">wireshark</span> - Deep packet inspection</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">trace</span> - Interactive netflow trace lab</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">tcpdump</span> - Packet capture filter simulation</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">3d network</span> - 3D holographic network</p>
              </div>
              <div className="bg-bg-dark/80 p-3 rounded-lg border border-green-500/30">
                <p className="text-green-400 font-bold mb-1">💾 Disk & Data Carving</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">dd</span> - Raw bit-stream disk imaging</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">bulk_extractor</span> - Carve emails, cards, URLs</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">sleuthkit</span> - Inode file system analysis</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">3d hdd / 3d carving</span> - 3D storage models</p>
              </div>
              <div className="bg-bg-dark/80 p-3 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-400 font-bold mb-1">🎯 Challenges & Integrity</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">hash verify</span> - Cryptographic hash lab</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">stego detect</span> - LSB steganography lab</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">mission list</span> - Guided challenges</p>
                <p className="text-text-secondary"><span className="text-accent-neon font-bold">quiz triage</span> - Tiered knowledge quiz</p>
              </div>
            </div>
          </div>
        );
        break;

      case 'labs':
        output = (
          <div className="space-y-2">
            <p className="text-accent-neon font-bold">═══ INTERACTIVE FORENSIC LABS ═══</p>
            <div className="space-y-1.5 text-xs">
              <p className="text-text-primary">▸ <span className="text-accent-cyan font-bold">trace</span> - NetFlow packet flow triage and anomaly flags</p>
              <p className="text-text-primary">▸ <span className="text-accent-purple font-bold">timeline [case-id]</span> - Interactive case timeline graph</p>
              <p className="text-text-primary">▸ <span className="text-green-400 font-bold">hash verify [hash]</span> - Cryptographic evidence integrity comparison</p>
              <p className="text-text-primary">▸ <span className="text-yellow-400 font-bold">mem scan</span> - Volatility memory process anomaly filter console</p>
              <p className="text-text-primary">▸ <span className="text-red-400 font-bold">stego detect</span> - Multi-stage LSB carrier extraction pipeline</p>
              <p className="text-text-primary">▸ <span className="text-accent-neon font-bold">3d &lt;model&gt;</span> - 3D Forensic Holographic Inspection Lab (network, ram, hdd, malware, carving)</p>
            </div>
            <p className="text-accent-purple mt-2 text-xs">Type any lab command to launch its interactive console.</p>
          </div>
        );
        break;

      case 'sysinfo':
      case 'status':
        output = (
          <div className="space-y-2">
            <p className="text-accent-neon font-bold">═══ FORENSIC WORKSTATION TELEMETRY ═══</p>
            <div className="grid grid-cols-2 gap-2 text-xs bg-bg-dark/80 p-3 rounded border border-border-glass">
              <div><span className="text-text-secondary">Host:</span> <span className="text-white font-mono">forensec-station-01</span></div>
              <div><span className="text-text-secondary">OS:</span> <span className="text-accent-cyan font-mono">Forensix Linux 6.8-DFIR</span></div>
              <div><span className="text-text-secondary">RAM:</span> <span className="text-white font-mono">128 GB ECC DDR5 (Clean)</span></div>
              <div><span className="text-text-secondary">Write Blocker:</span> <span className="text-green-400 font-mono">TABLEAU-T8u (ACTIVE)</span></div>
              <div><span className="text-text-secondary">Session ID:</span> <span className="text-accent-neon font-mono">#{sessionId}</span></div>
              <div><span className="text-text-secondary">Security Clearance:</span> <span className="text-accent-purple font-mono">LEVEL-3 (EXAMINER)</span></div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = 'root@forensec (Forensic Investigator Clearance Level 3 - Read-Only Evidence Access)';
        break;

      case 'pwd':
        output = '/home/forensec/cases/case-2024-001/evidence';
        break;

      case 'date':
        output = new Date().toUTCString();
        break;

      case 'ls':
      case 'dir':
        output = (
          <div className="space-y-1 font-mono text-xs">
            <p className="text-accent-cyan font-bold">Directory: /evidence/case-2024-001/</p>
            <p className="text-text-secondary">drwxr-xr-x  4 root forensec  4096 Aug 25 10:00 .</p>
            <p className="text-text-secondary">-rw-r--r--  1 root forensec  500G Aug 25 10:14 <span className="text-green-400">suspect_workstation.E01</span> (Expert Witness Image)</p>
            <p className="text-text-secondary">-rw-r--r--  1 root forensec   32G Aug 25 10:20 <span className="text-yellow-400">patient_zero_memory.raw</span> (Volatility Dump)</p>
            <p className="text-text-secondary">-rw-r--r--  1 root forensec  1.2G Aug 25 10:35 <span className="text-accent-cyan">traffic_capture.pcap</span> (Wireshark Capture)</p>
            <p className="text-text-secondary">-rw-r--r--  1 root forensec  450M Aug 25 10:48 <span className="text-accent-purple">extracted_phone.tar.gz</span> (Mobile Backup)</p>
            <p className="text-text-secondary">-rw-r--r--  1 root forensec  2.4K Aug 25 10:50 <span className="text-white">case_notes.txt</span></p>
          </div>
        );
        break;

      case 'cat':
        if (args.length === 0) {
          output = 'Usage: cat <filename>';
          status = 'error';
        } else {
          const file = args[0].toLowerCase();
          if (file.includes('notes') || file.includes('readme')) {
            output = 'CASE #2024-001 NOTES:\nTarget system acquired at 09:30 UTC. Memory preserved via FTK Imager. Network isolated at switch level. Suspected C2 beaconing to 203.0.113.87.';
          } else {
            output = `[Binary file '${args[0]}' displayed with hex preview]\n00000000: 45 56 46 09 0d 0a ff 00 01 00 00 00 00 00 00 00  EVF.............`;
          }
        }
        break;

      case 'ps':
      case 'top':
        output = (
          <div className="font-mono text-xs space-y-1">
            <p className="text-accent-neon font-bold">PID  USER     %CPU %MEM COMMAND</p>
            <p className="text-text-secondary"> 1   root      0.0  0.1 systemd</p>
            <p className="text-text-secondary">420  analyst   2.1  1.4 autopsy-core</p>
            <p className="text-text-secondary">1180 SYSTEM    0.0  0.8 lsass.exe [EVIDENCE SNAPSHOT]</p>
            <p className="text-red-400">2336 svc_admin 85.2  4.2 powershell.exe [SUSPICIOUS]</p>
            <p className="text-text-secondary">3104 analyst   0.4  0.5 wireshark</p>
          </div>
        );
        break;

      case 'netstat':
      case 'ifconfig':
      case 'ip':
        output = (
          <div className="font-mono text-xs space-y-1">
            <p className="text-accent-cyan font-bold">ACTIVE FORENSIC NETWORK SOCKETS:</p>
            <p className="text-text-secondary">tcp  0  0  10.10.24.7:49812   203.0.113.87:8443   ESTABLISHED (C2 BEACON)</p>
            <p className="text-text-secondary">tcp  0  0  10.10.33.12:5985   10.10.45.5:5985     TIME_WAIT   (WinRM)</p>
            <p className="text-text-secondary">udp  0  0  10.10.24.7:53      198.51.100.24:53                (DNS)</p>
          </div>
        );
        break;

      case 'history':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-accent-neon font-bold">COMMAND HISTORY:</p>
            {history.filter(h => h.input).slice(-10).map((h, i) => (
              <p key={i} className="text-text-secondary">
                <span className="text-text-tertiary">[{new Date(h.timestamp).toLocaleTimeString()}]</span> $ {h.input}
              </p>
            ))}
          </div>
        );
        break;

      case 'helpcat':
        if (args.length === 0) {
          output = 'Usage: helpcat <category>\nAvailable categories: ' + Object.keys(COMMAND_HELP.categories).join(', ');
          status = 'error';
        } else {
          const category = args[0].toLowerCase();
          const cmds = ENHANCED_COMMANDS.filter(c => c.category?.toLowerCase() === category);
          const basicCmds = BASIC_COMMANDS.filter(c => c.category?.toLowerCase().includes(category));
          
          if (cmds.length > 0 || basicCmds.length > 0) {
            output = (
              <div className="space-y-2">
                <p className="text-accent-neon font-bold">═══ {category.toUpperCase()} COMMANDS ═══</p>
                <div className="space-y-2 mt-2" role="list">
                  {cmds.map(command => (
                    <div key={command.name} role="listitem" className="border border-border-glass/50 rounded-lg p-2.5 bg-bg-dark/60">
                      <p className="text-accent-neon font-mono font-bold">{command.name}</p>
                      <p className="text-text-secondary text-xs mt-0.5">{command.description}</p>
                    </div>
                  ))}
                  {basicCmds.map(command => (
                    <div key={command.command} role="listitem" className="border border-border-glass/50 rounded-lg p-2.5 bg-bg-dark/60">
                      <p className="text-accent-cyan font-mono font-bold">{command.command}</p>
                      <p className="text-text-secondary text-xs mt-0.5">{command.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          } else {
            output = `Category '${category}' not found. Type 'help' for available categories.`;
            status = 'error';
          }
        }
        break;

      case 'glossary':
        if (args.length === 0) {
          const terms = Object.keys(forensicGlossary.terms).slice(0, 12);
          output = (
            <div className="space-y-2">
              <p className="text-accent-neon font-bold">═══ FORENSIC GLOSSARY (Top Terms) ═══</p>
              {terms.map(term => (
                <p key={term} className="text-xs">
                  <span className="text-accent-cyan font-bold">{term}</span>: {forensicGlossary.terms[term as keyof typeof forensicGlossary.terms].definition}
                </p>
              ))}
              <p className="text-accent-purple mt-2 text-xs">💡 Use <span className="text-accent-neon font-bold">glossary &lt;term&gt;</span> for detailed definitions.</p>
            </div>
          );
        } else {
          const term = args[0].toLowerCase().replace(/-/g, '_');
          const termData = forensicGlossary.terms[term as keyof typeof forensicGlossary.terms];
          const acronym = forensicGlossary.acronyms[args[0].toUpperCase() as keyof typeof forensicGlossary.acronyms];
          if (termData) {
            output = (
              <div className="space-y-2">
                <p className="text-accent-neon font-bold text-base">{term.toUpperCase()}</p>
                <p className="text-text-primary text-xs"><span className="text-accent-purple font-bold">Definition:</span> {termData.definition}</p>
                <p className="text-text-secondary text-xs"><span className="text-accent-purple font-bold">Context:</span> {termData.context}</p>
              </div>
            );
          } else if (acronym) {
            output = (
              <div className="space-y-1 text-xs">
                <p className="text-accent-neon font-bold text-sm">{args[0].toUpperCase()}</p>
                <p className="text-text-secondary">{acronym}</p>
              </div>
            );
          } else {
            output = `Term '${args[0]}' not found in glossary.`;
            status = 'error';
          }
        }
        break;

      case 'workflow':
        if (args.length === 0) {
          output = (
            <div className="space-y-2 text-xs">
              <p className="text-accent-neon font-bold text-sm">═══ INVESTIGATION WORKFLOWS ═══</p>
              <p className="text-text-secondary">Available workflows: {Object.keys(COMMAND_HELP.common_workflows).join(', ')}</p>
              <p className="text-accent-purple">Usage: <span className="text-accent-neon">workflow incident_response</span></p>
            </div>
          );
        } else {
          const workflowType = args.join('_');
          const workflow = COMMAND_HELP.common_workflows[workflowType as keyof typeof COMMAND_HELP.common_workflows];
          if (workflow) {
            output = (
              <div className="space-y-2">
                <p className="text-accent-neon font-bold">═══ {workflowType.toUpperCase().replace(/_/g, ' ')} WORKFLOW ═══</p>
                <div className="space-y-1 text-xs" role="list">
                  {workflow.map((step: string, idx: number) => (
                    <p key={idx} role="listitem" className="text-text-secondary pl-2">• {step}</p>
                  ))}
                </div>
              </div>
            );
          } else {
            output = `Workflow '${workflowType}' not found. Available: ${Object.keys(COMMAND_HELP.common_workflows).join(', ')}`;
            status = 'error';
          }
        }
        break;

      case 'clear':
        setHistory([]);
        setCurrentQuiz(null);
        setCurrentQuizBank(null);
        return;

      case 'explain':
      case 'info':
      case 'man':
        if (args.length === 0) {
          output = 'Usage: explain <command>';
          status = 'error';
        } else {
          const target = args[0].toLowerCase();
          let cmdData: EnhancedCommandEntry | BasicCommandEntry | undefined =
            ENHANCED_COMMANDS.find(c => c.name.toLowerCase() === target || (c.aliases && c.aliases.includes(target)));
          const isEnhanced = Boolean(cmdData);
          if (!cmdData) {
            cmdData = BASIC_COMMANDS.find(c => c.command.toLowerCase() === target);
          }
          if (cmdData) {
            const title = isEnhanced
              ? (cmdData as EnhancedCommandEntry).name
              : (cmdData as BasicCommandEntry).command;
            const context = isEnhanced
              ? (cmdData as EnhancedCommandEntry).explain
              : (cmdData as BasicCommandEntry).forensicUse;
            output = (
              <div className="space-y-2 text-xs">
                <p className="text-accent-neon font-bold text-sm">═══ {title.toUpperCase()} ═══</p>
                <p className="text-text-primary"><span className="text-accent-purple font-bold">Category:</span> {cmdData.category}</p>
                <p className="text-text-secondary mt-1">{cmdData.description}</p>
                <p className="text-text-primary mt-2">
                  <span className="text-accent-purple font-bold">Forensic Context:</span><br />
                  <span className="text-text-secondary">{context || 'Context unavailable.'}</span>
                </p>
              </div>
            );
          } else {
            output = `Command '${args[0]}' not found in forensic index.`;
            status = 'error';
          }
        }
        break;

      case 'quiz':
        {
          const tier = args[0]?.toLowerCase() as 'foundation' | 'triage' | 'deep-dive' | undefined;
          const validTiers = ['foundation', 'triage', 'deep-dive'];

          if (tier && validTiers.includes(tier)) {
            const tieredQuestions = (forensicQuizBank as QuizBankQuestion[]).filter(q => q.tier === tier);
            if (tieredQuestions.length === 0) {
              output = `No questions available for tier '${tier}'. Try: quiz foundation | quiz triage | quiz deep-dive`;
              status = 'error';
              break;
            }
            const randomTieredQuiz = tieredQuestions[Math.floor(Math.random() * tieredQuestions.length)];
            setCurrentQuizBank(randomTieredQuiz);
            setCurrentQuiz(null);

            const tierColors: Record<string, string> = {
              foundation: 'text-green-400',
              triage: 'text-yellow-400',
              'deep-dive': 'text-red-400'
            };

            output = (
              <div className="space-y-2">
                <p className="text-accent-neon font-bold">═══ FORENSIC KNOWLEDGE TEST ═══</p>
                <p className={`${tierColors[tier]} text-xs font-bold uppercase`}>
                  ◆ {tier.replace('-', ' ')} TIER
                </p>
                <p className="text-text-primary text-sm mt-1">{randomTieredQuiz.question}</p>
                <div className="mt-2 space-y-1 text-xs">
                  {randomTieredQuiz.options.map((opt, idx) => (
                    <p key={idx} className="text-text-secondary pl-2">{opt}</p>
                  ))}
                </div>
                <p className="text-accent-purple mt-3 text-xs">
                  Type your answer: <span className="text-accent-neon font-bold">a</span>, <span className="text-accent-neon font-bold">b</span>, <span className="text-accent-neon font-bold">c</span>, or <span className="text-accent-neon font-bold">d</span>
                </p>
              </div>
            );
          } else {
            const randomQuiz = forensicQuiz[Math.floor(Math.random() * forensicQuiz.length)];
            setCurrentQuiz(randomQuiz);
            setCurrentQuizBank(null);
            output = (
              <div className="space-y-2">
                <p className="text-accent-neon font-bold">═══ FORENSIC KNOWLEDGE TEST ═══</p>
                <p className="text-text-secondary text-xs">💡 Tip: Use <span className="text-accent-neon">quiz [foundation|triage|deep-dive]</span> for tiered challenges</p>
                <p className="text-text-primary text-sm mt-1">{randomQuiz.question}</p>
                <div className="mt-2 space-y-1 text-xs">
                  {randomQuiz.options.map((opt, idx) => (
                    <p key={idx} className="text-text-secondary pl-2">{opt}</p>
                  ))}
                </div>
                <p className="text-accent-purple mt-3 text-xs">
                  Type your answer: <span className="text-accent-neon font-bold">a</span>, <span className="text-accent-neon font-bold">b</span>, <span className="text-accent-neon font-bold">c</span>, or <span className="text-accent-neon font-bold">d</span>
                </p>
              </div>
            );
          }
        }
        break;

      case 'case':
        {
          let caseData;
          if (args.length > 0) {
            caseData = cases.find(c => c.id === args[0]);
          } else {
            caseData = cases[Math.floor(Math.random() * cases.length)];
          }

          if (caseData) {
            output = (
              <div className="space-y-2 text-xs max-h-96 overflow-y-auto">
                <p className="text-accent-neon font-bold text-sm">═══ CASE FILE: {caseData.id.toUpperCase()} ═══</p>
                <p className="text-text-primary"><span className="text-accent-purple font-bold">Scenario:</span><br />{caseData.scenario}</p>
                <p className="text-accent-purple font-bold mt-2">▸ Evidence Artifacts:</p>
                {caseData.artifacts.slice(0, 3).map((artifact, idx) => (
                  <p key={idx} className="text-text-secondary pl-2">• {artifact.type}: {artifact.description}</p>
                ))}
                <p className="text-accent-cyan mt-2">💡 Type <span className="text-accent-neon font-bold">timeline {caseData.id}</span> to explore its timeline in the lab.</p>
              </div>
            );
          } else {
            output = `Case '${args[0]}' not found. Available: ${cases.map(c => c.id).join(', ')}`;
            status = 'error';
          }
        }
        break;

      case 'mission':
        {
          const missionSubCmd = args[0]?.toLowerCase();
          const missionsList = missions as Mission[];

          if (!missionSubCmd || missionSubCmd === 'list') {
            output = (
              <div className="space-y-2 text-xs">
                <p className="text-accent-neon font-bold text-sm">═══ CHALLENGE MISSIONS ═══</p>
                <div className="space-y-2 mt-2">
                  {missionsList.map(m => {
                    const isComplete = completedMissions.has(m.id);
                    const isActive = activeMission?.missionId === m.id;
                    return (
                      <div key={m.id} className={`p-2.5 rounded border ${isActive ? 'border-accent-neon bg-accent-neon/10' : isComplete ? 'border-green-500/50 bg-green-900/20' : 'border-border-glass'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isComplete ? 'text-green-400' : 'text-text-primary'}`}>{m.title}</span>
                          <span className="text-accent-cyan font-mono">{m.id}</span>
                        </div>
                        <p className="text-text-secondary mt-1">{m.description}</p>
                        <p className="text-accent-purple text-[11px] mt-1">⏱ {m.estimatedTime} • {m.steps.length} steps • +{m.reward.xp} XP</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-accent-purple mt-2">Start a mission: <span className="text-accent-neon font-bold">mission start mission-1</span></p>
              </div>
            );
          } else if (missionSubCmd === 'start') {
            const missionId = args[1];
            if (!missionId) {
              output = 'Usage: mission start <id> (e.g., mission start mission-1)';
              status = 'error';
            } else if (activeMission) {
              output = 'Mission already in progress. Use mission abandon to quit current mission first.';
              status = 'error';
            } else {
              const mission = missionsList.find(m => m.id === missionId);
              if (mission) {
                setActiveMission({
                  missionId: mission.id,
                  currentStep: 0,
                  startedAt: Date.now(),
                  completedSteps: []
                });

                const firstStep = mission.steps[0];
                output = (
                  <div className="space-y-2 text-xs">
                    <p className="text-accent-neon font-bold text-sm">═══ MISSION STARTED ═══</p>
                    <p className="text-accent-cyan font-bold">{mission.title}</p>
                    <p className="text-text-secondary">{mission.description}</p>
                    <div className="mt-2 p-2.5 bg-surface-elevated/50 border-l-2 border-accent-neon">
                      <p className="text-accent-cyan font-bold">OBJECTIVE 1/{mission.steps.length}:</p>
                      <p className="text-text-primary mt-1">{firstStep.instruction}</p>
                    </div>
                    <p className="text-accent-purple mt-2">💡 Type <span className="text-accent-neon">mission hint</span> if you need help.</p>
                  </div>
                );
              } else {
                output = `Mission '${missionId}' not found.`;
                status = 'error';
              }
            }
          } else if (missionSubCmd === 'status') {
            if (!activeMission) {
              output = 'No active mission. Use mission list to see available missions.';
              status = 'info';
            } else {
              const mission = missionsList.find(m => m.id === activeMission.missionId);
              if (mission) {
                const currentStep = mission.steps[activeMission.currentStep];
                output = (
                  <div className="space-y-2 text-xs">
                    <p className="text-accent-neon font-bold text-sm">═══ MISSION PROGRESS ═══</p>
                    <p className="text-accent-cyan font-bold">{mission.title} ({activeMission.currentStep + 1}/{mission.steps.length})</p>
                    <div className="mt-2 p-2.5 bg-surface-elevated/50 border-l-2 border-accent-neon">
                      <p className="text-accent-cyan font-bold">CURRENT OBJECTIVE:</p>
                      <p className="text-text-primary mt-1">{currentStep.instruction}</p>
                    </div>
                  </div>
                );
              }
            }
          } else if (missionSubCmd === 'hint') {
            if (!activeMission) {
              output = 'No active mission. Start one with: mission start mission-1';
              status = 'error';
            } else {
              const mission = missionsList.find(m => m.id === activeMission.missionId);
              if (mission) {
                const currentStep = mission.steps[activeMission.currentStep];
                output = (
                  <div className="space-y-1.5 text-xs">
                    <p className="text-accent-cyan font-bold">💡 MISSION HINT</p>
                    <p className="text-text-secondary">{currentStep.hint}</p>
                    <p className="text-accent-purple">Required command: <span className="text-accent-neon font-mono font-bold">{currentStep.requiredCommand}</span></p>
                  </div>
                );
                status = 'info';
              }
            }
          } else if (missionSubCmd === 'abandon') {
            setActiveMission(null);
            output = 'Mission abandoned. Progress reset.';
            status = 'info';
          } else {
            output = `Unknown mission command: ${missionSubCmd}. Available: list, start, status, hint, abandon`;
            status = 'error';
          }
        }
        break;

      default:
        {
          // Check Forensic Tool Registry (Name or Alias)
          const enhancedMatch = ENHANCED_COMMANDS.find(
            c => c.name.toLowerCase() === mainCmd || (c.aliases && c.aliases.map(a => a.toLowerCase()).includes(mainCmd))
          );
          const basicMatch = BASIC_COMMANDS.find(
            c => c.command.toLowerCase() === mainCmd
          );
          const cmdData = (enhancedMatch ?? basicMatch) as (EnhancedCommandEntry | BasicCommandEntry | undefined);

          if (cmdData) {
            setExecutedCategories(prev => new Set(prev).add(cmdData.category.toUpperCase()));

            const outputText = enhancedMatch
              ? enhancedMatch.output_example
              : (basicMatch as BasicCommandEntry | undefined)?.simulatedOutput;

            if (outputText) {
              setHistory(prev => [
                ...prev,
                {
                  input: cmd,
                  output: (
                    <div className="space-y-2 text-xs">
                      <p className="text-accent-purple font-mono font-bold">▸ {cmdData.description}</p>
                      <div className="text-text-secondary font-mono text-xs mt-2 whitespace-pre-wrap bg-bg-dark/70 p-3 rounded border border-border-glass/40">
                        <StreamingText text={outputText} speed={6} />
                      </div>
                      <p className="text-accent-purple text-xs mt-2">
                        💡 Type <span className="text-accent-neon font-bold">explain {mainCmd}</span> for forensic context.
                      </p>
                    </div>
                  ),
                  timestamp: Date.now(),
                  status: 'success',
                }
              ]);
              setTerminalState('success');
              setTimeout(() => setTerminalState('idle'), 1000);
              return;
            }

            output = `Command '${mainCmd}' recognized. Simulated execution complete.`;
            status = 'info';
          } else {
            // Fuzzy match for helpful typo recovery
            const closeMatches = allCommands.filter(c => c.toLowerCase().includes(mainCmd) || mainCmd.includes(c.toLowerCase())).slice(0, 3);
            output = (
              <div className="space-y-1.5 text-xs">
                <p className="text-red-400 font-bold">⚠ Command not found: <span className="text-accent-neon font-mono">{mainCmd}</span></p>
                {closeMatches.length > 0 && (
                  <p className="text-text-secondary">
                    Did you mean: {closeMatches.map((m, i) => (
                      <button
                        key={m}
                        onClick={() => handleCommand(m)}
                        className="text-accent-neon underline hover:text-white mr-2"
                      >
                        {m}{i < closeMatches.length - 1 ? ',' : ''}
                      </button>
                    ))}
                  </p>
                )}
                <p className="text-text-tertiary">
                  Type <span className="text-accent-neon font-bold">guide</span> or <span className="text-accent-neon font-bold">help</span> to view available forensic commands.
                </p>
              </div>
            );
            status = 'error';
          }
        }
    }

    addToHistory(cmd, output, status);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions.length > 0) {
        const selectedCmd = suggestions[activeSuggestionIndex];
        setInput('');
        setActiveSuggestionIndex(-1);
        setSuggestions([]);
        handleCommand(selectedCmd);
        setHistoryIndex(-1);
      } else {
        handleCommand(input);
        setInput('');
        setHistoryIndex(-1);
        setSuggestions([]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveSuggestionIndex(prev => Math.max(0, prev - 1));
      } else {
        const cmds = history.filter(h => h.input).map(h => h.input);
        if (cmds.length > 0) {
          const newIndex = historyIndex === -1 ? cmds.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(cmds[newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveSuggestionIndex(prev => Math.min(suggestions.length - 1, prev + 1));
      } else {
        const cmds = history.filter(h => h.input).map(h => h.input);
        if (historyIndex !== -1) {
          const newIndex = Math.min(cmds.length - 1, historyIndex + 1);
          setHistoryIndex(newIndex);
          setInput(cmds[newIndex]);
        } else {
          setInput('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[activeSuggestionIndex >= 0 ? activeSuggestionIndex : 0]);
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  };

  const exportSession = (format: 'copy' | 'download') => {
    const text = history.map(h => {
      return `[${new Date(h.timestamp).toLocaleTimeString()}] $ ${h.input}\n${typeof h.output === 'string' ? h.output : '[Interactive Rich Output]'}\n`;
    }).join('\n');

    if (format === 'copy') {
      navigator.clipboard.writeText(text);
    } else {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forensec-session-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'network': return <Wifi className="w-3.5 h-3.5" />;
      case 'disk': return <Database className="w-3.5 h-3.5" />;
      case 'memory': return <Cpu className="w-3.5 h-3.5" />;
      case 'malware': return <Shield className="w-3.5 h-3.5" />;
      case 'labs': return <Activity className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const renderLabContent = () => {
    if (!activeLab) return null;
    switch (activeLab) {
      case 'netflow':
        return (
          <NetflowLab
            records={NETFLOW_FIXTURE}
            sortKey={labSessions.netflow.sortKey}
            sortDirection={labSessions.netflow.sortDirection}
            showOnlyFlagged={labSessions.netflow.showOnlyFlagged}
            onSortChange={updateNetflowSort}
            onToggleFlagFilter={toggleNetflowFlag}
          />
        );
      case 'timeline':
        return (
          <TimelineLab
            datasets={TIMELINE_DATASETS}
            activeCaseId={labSessions.timeline.activeCaseId}
            onCaseChange={changeTimelineCase}
          />
        );
      case 'hash':
        return (
          <HashVerifyLab
            state={labSessions.hash}
            onInputChange={handleHashInputChange}
            onVerify={handleHashVerify}
          />
        );
      case 'memory':
        return (
          <MemoryTriageLab
            processes={MEMORY_FIXTURE}
            riskFilter={labSessions.memory.riskFilter}
            showOnlyAnomalies={labSessions.memory.showOnlyAnomalies}
            onRiskChange={changeRiskFilter}
            onToggleAnomalyFilter={toggleAnomalyFilter}
          />
        );
      case 'stego':
        return (
          <StegoDetectLab
            state={labSessions.stego}
            onRun={runStegoPipeline}
          />
        );
      case '3d':
        return (
          <VisualizationLab initialScene={labSessions.threeD.activeScene} />
        );
      default:
        return null;
    }
  };

  const closeLab = useCallback(() => setActiveLab(null), []);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-3 font-mono text-sm">
      {/* Interactive Quick-Action Command Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-accent-neon/30">
        <span className="text-text-tertiary text-xs font-bold shrink-0 flex items-center gap-1 pl-1">
          <Sparkles className="w-3.5 h-3.5 text-accent-neon" /> Quick Run:
        </span>
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip.cmd}
            onClick={() => handleCommand(chip.cmd)}
            className={`shrink-0 px-2.5 py-1 rounded-md text-xs border font-mono font-medium transition-all hover:scale-105 ${chip.color}`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="h-[680px] flex gap-4">
        {/* Sidebar - Stats, Guidance & Badges */}
        <div className="hidden md:flex w-64 flex-col gap-3">
          {/* Quick Guide Launch Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="p-3 rounded-xl bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/50 hover:border-accent-neon text-white font-bold text-xs flex items-center justify-between shadow-lg transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent-cyan" />
              <span>User Guide & Cheatsheet</span>
            </div>
            <ChevronRight className="w-4 h-4 text-accent-neon" />
          </button>

          {/* System Status */}
          <div className="glass-panel p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-accent-neon border-b border-border-glass pb-1.5">
              <Activity className="w-4 h-4" />
              <span className="font-bold text-xs">SYSTEM STATUS</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Workstation</span>
                <span className="text-green-400 font-bold">READY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Write-Blocker</span>
                <span className="text-accent-neon">HARDWARE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Session ID</span>
                <span className="text-text-primary font-mono">#{sessionId}</span>
              </div>
            </div>
          </div>

          {/* Active Modules (Badges) */}
          <div className="glass-panel p-3.5 flex-1 flex flex-col gap-2.5 overflow-hidden">
            <div className="flex items-center gap-2 text-accent-purple border-b border-border-glass pb-1.5">
              <Cpu className="w-4 h-4" />
              <span className="font-bold text-xs">ACTIVE DOMAINS</span>
            </div>
            <div className="flex flex-wrap gap-1.5 overflow-y-auto">
              {Array.from(executedCategories).map(cat => (
                <div key={cat} className="flex items-center gap-1 bg-accent-neon/10 border border-accent-neon/30 px-2 py-0.5 rounded text-[11px] text-accent-neon">
                  {getCategoryIcon(cat)}
                  <span>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Controls */}
          <div className="glass-panel p-3 flex flex-col gap-1.5">
            <button onClick={() => exportSession('copy')} className="flex items-center gap-2 text-text-secondary hover:text-accent-neon transition-colors text-xs p-1.5 hover:bg-white/5 rounded">
              <Copy className="w-3.5 h-3.5" /> Copy Session Log
            </button>
            <button onClick={() => exportSession('download')} className="flex items-center gap-2 text-text-secondary hover:text-accent-neon transition-colors text-xs p-1.5 hover:bg-white/5 rounded">
              <Download className="w-3.5 h-3.5" /> Export Transcript
            </button>
          </div>
        </div>

        {/* Main Terminal Screen */}
        <div
          className={`flex-1 flex flex-col overflow-hidden shadow-2xl border rounded-xl transition-all duration-300 relative
            ${terminalState === 'error' ? 'border-red-500/50 terminal-glow-error' :
              terminalState === 'success' ? 'border-accent-neon/50 terminal-glow-active' :
                'border-accent-neon/30 terminal-glow'}
          `}
          style={{ backdropFilter: 'blur(14px)', backgroundColor: 'rgba(8, 12, 22, 0.92)' }}
        >
          {/* Scanline Effects */}
          <div className="scanline pointer-events-none" />
          <div className="scanline-moving pointer-events-none" />

          {/* Terminal Header */}
          <div className="bg-bg-darker/95 p-3 flex items-center justify-between border-b border-accent-neon/30 z-20">
            <div className="flex items-center gap-3 text-text-secondary text-xs">
              <TerminalIcon className="w-4 h-4 text-accent-neon" />
              <span className="text-accent-neon font-bold">root@forensec</span>
              <span className="text-accent-purple hidden sm:inline">~/investigation/case-2024-001</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-1 text-[11px] text-accent-cyan hover:text-accent-neon bg-accent-cyan/10 hover:bg-accent-cyan/20 px-2 py-1 rounded border border-accent-cyan/30 transition-colors"
                title="Open Command Guide"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">User Guide</span>
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-text-tertiary bg-bg-dark px-2 py-1 rounded border border-border-glass">
                <Command className="w-3 h-3" />
                <span>CMD+K</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="w-3.5 h-3.5 cursor-pointer hover:text-accent-neon transition-colors" />
                <Square className="w-3 h-3 cursor-pointer hover:text-accent-purple transition-colors" />
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Terminal Output Stream */}
          <div
            ref={(el) => {
              if (el) {
                (messagesRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                (terminalBodyRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
              }
            }}
            tabIndex={0}
            className="flex-1 p-4 md:p-5 overflow-y-auto bg-transparent text-text-primary scrollbar-thin scrollbar-thumb-accent-neon/30 scrollbar-track-transparent cursor-text z-10 relative"
            onClick={focusInput}
          >
            {history.map((entry, i) => (
              <div key={i} className="mb-4 group">
                {entry.input && (
                  <div className="flex gap-2 text-accent-neon/90 items-center text-xs">
                    <span className="font-bold opacity-50 font-mono">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                    <span className="font-bold text-accent-neon">$</span>
                    <span className="flex-1 font-semibold text-white font-mono">{entry.input}</span>
                    {entry.status === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                    {entry.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                )}
                <div className={`whitespace-pre-wrap mt-1 pl-3.5 border-l-2 ${entry.status === 'error' ? 'border-red-500/30 text-red-200' : 'border-accent-neon/20 text-text-secondary'}`}>
                  {entry.output}
                </div>
              </div>
            ))}

            {/* Input Prompt Area */}
            <div className="flex gap-2 items-center text-accent-neon relative mt-2">
              <span className="font-bold animate-pulse text-base">$</span>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none text-text-primary caret-accent-neon font-bold text-sm font-mono"
                  placeholder="Type a forensic command (e.g. guide, volatility, trace, 3d network, quiz)..."
                  spellCheck={false}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls={suggestions.length > 0 ? suggestionListId : undefined}
                  aria-activedescendant={activeSuggestionIndex >= 0 ? `${suggestionListId}-${activeSuggestionIndex}` : undefined}
                />
                {/* Autocomplete Dropdown */}
                {suggestions.length > 0 && (
                  <div
                    id={suggestionListId}
                    role="listbox"
                    aria-label="Command suggestions"
                    className="absolute bottom-full left-0 mb-2 w-72 bg-bg-darker border border-accent-neon/40 rounded-lg shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                  >
                    {suggestions.map((s, idx) => (
                      <div
                        key={s}
                        role="option"
                        aria-selected={idx === activeSuggestionIndex}
                        className={`px-3 py-2 cursor-pointer flex items-center justify-between text-xs font-mono ${idx === activeSuggestionIndex ? 'bg-accent-neon/20 text-accent-neon font-bold' : 'text-text-secondary hover:bg-white/5'}`}
                        onClick={() => {
                          setSuggestions([]);
                          setInput('');
                          setActiveSuggestionIndex(-1);
                          handleCommand(s);
                          setHistoryIndex(-1);
                          inputRef.current?.focus({ preventScroll: true });
                        }}
                      >
                        <span>{s}</span>
                        {idx === activeSuggestionIndex && <ChevronRight className="w-3 h-3" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Command Palette (Ctrl+K) */}
      {isPaletteOpen && (
        <div
          className={`fixed inset-0 z-[100] flex items-start justify-center pt-32 bg-black/60 ${supportsBackdrop ? 'backdrop-blur-sm' : 'bg-black/80'}`}
          onClick={() => setIsPaletteOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-bg-darker border border-accent-neon/50 rounded-xl shadow-neon-strong overflow-hidden animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border-glass flex items-center gap-3">
              <Search className="w-5 h-5 text-accent-neon" />
              <input
                ref={paletteInputRef}
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-base text-text-primary placeholder-text-tertiary font-mono"
                placeholder="Type to search all 200+ forensic commands..."
                aria-autocomplete="list"
                aria-controls={paletteListId}
                aria-activedescendant={paletteActiveIndex >= 0 ? `${paletteListId}-${paletteActiveIndex}` : undefined}
                value={paletteSearch}
                onChange={e => {
                  setPaletteSearch(e.target.value);
                  setPaletteActiveIndex(0);
                }}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setIsPaletteOpen(false);
                    setPaletteActiveIndex(0);
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setPaletteActiveIndex(prev => Math.min(filteredCommands.length - 1, prev + 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setPaletteActiveIndex(prev => Math.max(0, prev - 1));
                  } else if (e.key === 'Enter' && filteredCommands.length > 0) {
                    e.preventDefault();
                    const targetCmd = paletteActiveIndex >= 0 ? filteredCommands[paletteActiveIndex] : filteredCommands[0];
                    handleCommand(targetCmd);
                    setIsPaletteOpen(false);
                    setPaletteSearch('');
                    setPaletteActiveIndex(0);
                  }
                }}
              />
              <div className="text-xs text-text-tertiary border border-border-glass px-2 py-1 rounded font-mono">ESC</div>
            </div>
            <div id={paletteListId} role="listbox" aria-label="Command palette" className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-text-tertiary font-mono text-xs">No commands found</div>
              ) : (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={cmd}
                    id={`${paletteListId}-${idx}`}
                    role="option"
                    aria-selected={idx === paletteActiveIndex}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between group hover:bg-accent-neon/10 transition-colors mb-1 ${idx === paletteActiveIndex ? 'bg-accent-neon/20 text-accent-neon' : 'bg-white/5'}`}
                    onClick={() => {
                      handleCommand(cmd);
                      setIsPaletteOpen(false);
                      setPaletteSearch('');
                      setPaletteActiveIndex(0);
                    }}
                  >
                    <span className={`font-mono text-xs ${idx === paletteActiveIndex ? 'text-accent-neon font-bold' : 'text-text-primary group-hover:text-accent-neon'}`}>{cmd}</span>
                    <span className="text-[11px] text-text-tertiary group-hover:text-accent-neon/70 font-mono">Run ↵</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Guide & Cheatsheet Modal */}
      <Suspense fallback={null}>
        <CommandGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
          onExecuteCommand={handleCommand}
        />
      </Suspense>

      {/* Interactive Labs & 3D Lab Modal Panel */}
      <ErrorBoundary fallback={<div className="text-red-400 p-4 text-center">Lab failed to load. Please try again.</div>}>
        <Suspense fallback={<div className="text-accent-neon p-4 text-center animate-pulse">Loading lab...</div>}>
          <LabPanel
            isOpen={!!activeLab}
            title={activeLab ? LAB_METADATA[activeLab].title : ''}
            subtitle={activeLab ? LAB_METADATA[activeLab].subtitle : ''}
            onClose={closeLab}
          >
            {renderLabContent()}
          </LabPanel>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}