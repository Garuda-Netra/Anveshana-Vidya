import { useState, useMemo } from 'react';
import {
  BookOpen, Terminal, Zap, Search,
  ArrowRight, Keyboard
} from 'lucide-react';
import Modal from '../ui/Modal';

interface CommandGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (cmd: string) => void;
}

interface CommandGuideItem {
  cmd: string;
  category: string;
  desc: string;
  example?: string;
  tag: 'core' | 'lab' | 'mission' | 'quiz' | '3d';
}

const GUIDE_COMMANDS: CommandGuideItem[] = [
  // Core & Navigation
  { cmd: 'help', category: 'General', desc: 'Display categorized list of available forensic command categories', tag: 'core' },
  { cmd: 'guide', category: 'General', desc: 'Interactive step-by-step tutorial on how to operate the command center', tag: 'core' },
  { cmd: 'cheatsheet', category: 'General', desc: 'Comprehensive formatted matrix of forensic tools and usage', tag: 'core' },
  { cmd: 'clear', category: 'General', desc: 'Clear the terminal output screen buffer', tag: 'core' },
  { cmd: 'sysinfo', category: 'General', desc: 'Display simulated forensic workstation specs, kernel, and active drives', tag: 'core' },
  { cmd: 'history', category: 'General', desc: 'Show executed command history with timestamps', tag: 'core' },
  { cmd: 'ls', category: 'General', desc: 'List files and evidence images in current working directory', tag: 'core' },
  { cmd: 'whoami', category: 'General', desc: 'Show current active forensic investigator identity and clearance', tag: 'core' },
  
  // Interactive Forensic Labs & 3D
  { cmd: 'trace', category: 'Interactive Labs', desc: 'Open interactive NetFlow packet trace analyzer lab', tag: 'lab' },
  { cmd: 'timeline', category: 'Interactive Labs', desc: 'Open multi-stage case timeline graph and event dataset pivot', tag: 'lab' },
  { cmd: 'hash verify', category: 'Interactive Labs', desc: 'Open SHA-256 cryptographic evidence hash verification lab', tag: 'lab' },
  { cmd: 'mem scan', category: 'Interactive Labs', desc: 'Open Volatility memory triage console with risk anomaly filtering', tag: 'lab' },
  { cmd: 'stego detect', category: 'Interactive Labs', desc: 'Open multi-phase LSB steganography extraction pipeline', tag: 'lab' },
  { cmd: '3d network', category: '3D Visualizers', desc: 'Launch 3D holographic network flow & C2 beacon visualizer', tag: '3d' },
  { cmd: '3d ram', category: '3D Visualizers', desc: 'Launch 3D volatile RAM module & shellcode injection visualizer', tag: '3d' },
  { cmd: '3d hdd', category: '3D Visualizers', desc: 'Launch 3D spinning magnetic platter & sector geometry visualizer', tag: '3d' },
  { cmd: '3d ssd', category: '3D Visualizers', desc: 'Launch 3D NAND flash & wear leveling visualizer', tag: '3d' },
  { cmd: '3d carving', category: '3D Visualizers', desc: 'Launch 3D cluster matrix & file signature carving visualizer', tag: '3d' },
  { cmd: '3d mobile', category: '3D Visualizers', desc: 'Launch 3D smartphone partition & extraction bridge visualizer', tag: '3d' },
  { cmd: '3d malware', category: '3D Visualizers', desc: 'Launch 3D malware sandbox containment capsule visualizer', tag: '3d' },
  { cmd: '3d stego', category: '3D Visualizers', desc: 'Launch 3D RGB bitplane slices & LSB extraction visualizer', tag: '3d' },
  { cmd: '3d vault', category: '3D Visualizers', desc: 'Launch 3D cryptographic evidence chain-of-custody safe visualizer', tag: '3d' },

  // Challenges & Missions
  { cmd: 'mission list', category: 'Missions', desc: 'List all guided forensic challenge scenarios, XP rewards, and badges', tag: 'mission' },
  { cmd: 'mission start mission-1', category: 'Missions', desc: 'Start Mission 1: Ransomware patient-zero incident response', tag: 'mission' },
  { cmd: 'mission status', category: 'Missions', desc: 'Check current mission objective progress and time elapsed', tag: 'mission' },
  { cmd: 'mission hint', category: 'Missions', desc: 'Get a helpful hint for the current active mission objective', tag: 'mission' },
  { cmd: 'mission abandon', category: 'Missions', desc: 'Abort current mission and reset step tracking', tag: 'mission' },

  // Quizzes & Assessments
  { cmd: 'quiz', category: 'Quizzes', desc: 'Take a quick digital forensics knowledge question (Random)', tag: 'quiz' },
  { cmd: 'quiz foundation', category: 'Quizzes', desc: 'Tier 1 challenge: Core principles, hashing, and evidence handling', tag: 'quiz' },
  { cmd: 'quiz triage', category: 'Quizzes', desc: 'Tier 2 challenge: Incident response, log parsing, and memory triage', tag: 'quiz' },
  { cmd: 'quiz deep-dive', category: 'Quizzes', desc: 'Tier 3 challenge: File system internals, rootkits, and anti-forensics', tag: 'quiz' },

  // Forensic Arsenal Tools
  { cmd: 'volatility', category: 'Forensic Tools', desc: 'Simulate Volatility memory forensics framework (Processes, C2s, Rootkits)', example: 'volatility -f memory.raw pslist', tag: 'core' },
  { cmd: 'wireshark', category: 'Forensic Tools', desc: 'Simulate Wireshark packet capture analysis & exfiltration detection', example: 'wireshark -r capture.pcap', tag: 'core' },
  { cmd: 'dd', category: 'Forensic Tools', desc: 'Simulate bit-by-bit raw forensic disk acquisition', example: 'dd if=/dev/sda of=image.dd', tag: 'core' },
  { cmd: 'strings', category: 'Forensic Tools', desc: 'Extract printable strings from memory dump or executable', example: 'strings evidence.bin', tag: 'core' },
  { cmd: 'bulk_extractor', category: 'Forensic Tools', desc: 'Scan raw binary stream for emails, credit cards, and URLs', example: 'bulk_extractor -o out/ image.E01', tag: 'core' },
  { cmd: 'sleuthkit', category: 'Forensic Tools', desc: 'Perform low-level NTFS/ext4 file system inode analysis', example: 'fls -r -p image.dd', tag: 'core' },
  { cmd: 'hashcalc', category: 'Forensic Tools', desc: 'Calculate and verify MD5, SHA-1, and SHA-256 cryptographic hashes', example: 'hashcalc evidence.E01', tag: 'core' },
  { cmd: 'recover', category: 'Forensic Tools', desc: 'Simulate file recovery and signature carving from unallocated clusters', tag: 'core' },
  { cmd: 'explain volatility', category: 'Forensic Tools', desc: 'Get deep educational forensic context & usage guidelines for any tool', tag: 'core' },
  { cmd: 'glossary ram', category: 'Forensic Tools', desc: 'Look up digital forensics terminology, acronyms, and legal definitions', tag: 'core' },
  { cmd: 'workflow incident_response', category: 'Forensic Tools', desc: 'Step-by-step standard operating procedure for major IR incident types', tag: 'core' },
];

export default function CommandGuideModal({ isOpen, onClose, onExecuteCommand }: CommandGuideModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const filteredCommands = useMemo(() => {
    return GUIDE_COMMANDS.filter(item => {
      const matchesSearch =
        item.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === 'all' || item.tag === selectedTag;
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  const handleRun = (cmd: string) => {
    onExecuteCommand(cmd);
    onClose();
  };

  const getTagBadge = (tag: CommandGuideItem['tag']) => {
    switch (tag) {
      case '3d':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40 font-mono font-bold">3D Visualizer</span>;
      case 'lab':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/40 font-mono font-bold">Interactive Lab</span>;
      case 'mission':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-accent-neon/20 text-accent-neon border border-accent-neon/40 font-mono font-bold">Mission</span>;
      case 'quiz':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 font-mono font-bold">Quiz</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40 font-mono font-bold">CLI Command</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="COMMAND CENTER • INTERACTIVE USER GUIDE & CHEATSHEET"
    >
      <div className="space-y-6 text-sm text-text-secondary">
        {/* Quick Start How-To Card */}
        <div className="bg-gradient-to-r from-accent-cyan/10 via-surface-dark to-accent-purple/10 p-5 rounded-xl border border-accent-cyan/30 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent-cyan/20 rounded-lg text-accent-cyan">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-base font-mono">How to Use the Command Center</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-bg-dark/60 p-3 rounded-lg border border-border-glass">
              <div className="flex items-center gap-2 text-accent-neon font-bold mb-1">
                <Terminal className="w-4 h-4" />
                <span>1. Run Commands</span>
              </div>
              <p className="text-text-tertiary">Type any forensic command (e.g. <code className="text-accent-cyan">volatility</code>, <code className="text-accent-cyan">trace</code>) or click on any command pill.</p>
            </div>
            <div className="bg-bg-dark/60 p-3 rounded-lg border border-border-glass">
              <div className="flex items-center gap-2 text-accent-cyan font-bold mb-1">
                <Keyboard className="w-4 h-4" />
                <span>2. Shortcuts & Autocomplete</span>
              </div>
              <p className="text-text-tertiary">Press <code className="text-accent-neon">Tab</code> to autocomplete, <code className="text-accent-neon">↑/↓</code> for history, and <code className="text-accent-neon">Ctrl+K</code> for quick search.</p>
            </div>
            <div className="bg-bg-dark/60 p-3 rounded-lg border border-border-glass">
              <div className="flex items-center gap-2 text-accent-purple font-bold mb-1">
                <Zap className="w-4 h-4" />
                <span>3. Interactive Labs & 3D</span>
              </div>
              <p className="text-text-tertiary">Run <code className="text-accent-neon">3d network</code>, <code className="text-accent-neon">trace</code>, <code className="text-accent-neon">mem scan</code> to open dedicated interactive forensic lab consoles.</p>
            </div>
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search commands, tools, or descriptions..."
              className="w-full pl-9 pr-4 py-2 bg-bg-dark border border-border-glass rounded-lg text-text-primary text-xs focus:outline-none focus:border-accent-neon font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            {[
              { id: 'all', label: 'All' },
              { id: '3d', label: '3D Models' },
              { id: 'lab', label: 'Labs' },
              { id: 'mission', label: 'Missions' },
              { id: 'quiz', label: 'Quizzes' },
              { id: 'core', label: 'Tools' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTag(tab.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${selectedTag === tab.id ? 'bg-accent-neon text-bg-dark font-bold' : 'bg-surface-dark text-text-secondary hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Command Cards List */}
        <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-accent-neon/30">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-text-tertiary font-mono">
              No matching commands found for "{searchTerm}".
            </div>
          ) : (
            filteredCommands.map((item) => (
              <div
                key={item.cmd}
                className="bg-bg-dark/70 hover:bg-surface-dark/80 border border-border-glass hover:border-accent-neon/40 p-3 rounded-lg transition-all flex items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-accent-neon font-mono font-bold text-sm bg-bg-dark px-2 py-0.5 rounded border border-border-glass">
                      $ {item.cmd}
                    </span>
                    {getTagBadge(item.tag)}
                    <span className="text-text-tertiary text-xs">({item.category})</span>
                  </div>
                  <p className="text-text-secondary text-xs">{item.desc}</p>
                  {item.example && (
                    <p className="text-text-tertiary text-[11px] font-mono">
                      Example: <span className="text-accent-cyan">{item.example}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleRun(item.cmd)}
                  className="shrink-0 px-3 py-1.5 bg-accent-neon/10 hover:bg-accent-neon text-accent-neon hover:text-bg-dark font-bold font-mono text-xs rounded border border-accent-neon/40 transition-all flex items-center gap-1.5 shadow-sm"
                  title={`Run ${item.cmd} in terminal`}
                >
                  <span>Execute</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
