import { useState } from 'react';
import cases from '../../data/cases.json';
import slokas from '../../data/slokas.json';
import Accordion from '../ui/Accordion';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Canvas3D from '../3d/Canvas3D';
import { Box, ShieldCheck, ArrowRight } from 'lucide-react';

function getCase3DScene(caseId: string): { scene: string; label: string } {
  const id = caseId.toLowerCase();
  if (id.includes('ransomware') || id.includes('malware')) {
    return { scene: 'malware-capsule-model', label: 'Isolated Ransomware Payload & Memory Space' };
  }
  if (id.includes('network') || id.includes('intrusion') || id.includes('exfiltration')) {
    return { scene: 'network-packet-flow', label: 'Network Exfiltration & C2 Traffic Mesh' };
  }
  if (id.includes('mobile') || id.includes('phone') || id.includes('app')) {
    return { scene: 'mobile-forensic-model', label: 'Mobile Device & SQLite Artifact Dump' };
  }
  if (id.includes('insider') || id.includes('fraud') || id.includes('theft')) {
    return { scene: 'forensic-workstation', label: 'Forensic Triage & Write-Blocker Station' };
  }
  if (id.includes('stego') || id.includes('hidden')) {
    return { scene: 'stego-matrix-model', label: 'Steganography Bitplane Analysis' };
  }
  return { scene: 'evidence-vault', label: 'Chain-of-Custody Cryptographic Vault' };
}

export default function CaseStudies() {
  const [selectedCase3D, setSelectedCase3D] = useState<{ id: string; title: string; scene: string; label: string } | null>(null);

  // Use investigation/truth focused śloka for case studies
  const caseStudySloka = slokas.find(s => s.context === 'investigation') || slokas[0];

  const accordionItems = cases.map((caseStudy) => {
    const sceneInfo = getCase3DScene(caseStudy.id);

    return {
      id: caseStudy.id,
      title: caseStudy.scenario.substring(0, 80) + '...',
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-accent-neon font-bold mb-2">Scenario</h4>
            <p className="text-text-secondary">{caseStudy.scenario}</p>
          </div>

          {/* 3D Evidence Inspection Trigger */}
          <div className="bg-bg-dark/50 border border-accent-cyan/30 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent-cyan/10 text-accent-cyan rounded-lg border border-accent-cyan/30">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-sm font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-neon" />
                  3D Evidence Artifact Model
                </p>
                <p className="text-text-tertiary text-xs">{sceneInfo.label}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCase3D({
                id: caseStudy.id,
                title: `Case Evidence: ${caseStudy.id.toUpperCase()}`,
                scene: sceneInfo.scene,
                label: sceneInfo.label,
              })}
              className="px-4 py-2 bg-accent-cyan/20 hover:bg-accent-cyan/30 border border-accent-cyan/50 text-accent-cyan text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-2"
            >
              <span>Inspect 3D Evidence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-accent-neon font-bold mb-2">Key Artifacts</h4>
              <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                {caseStudy.artifacts.slice(0, 4).map((artifact, idx) => (
                  <li key={idx}>
                    <span className="text-text-primary">{artifact.type}:</span> {artifact.description}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-accent-neon font-bold mb-2">Outcomes</h4>
              <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                {caseStudy.outcomes.slice(0, 4).map((outcome, idx) => (
                  <li key={idx}>{outcome}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-accent-neon font-bold mb-2">Investigation Workflow</h4>
            <div className="space-y-3">
              {caseStudy.workflow.slice(0, 3).map((step) => (
                <div key={step.step} className="flex gap-3 items-start bg-bg-dark/30 p-3 rounded border border-border-glass">
                  <Badge variant="outline">{step.step}</Badge>
                  <div>
                    <p className="text-text-primary text-sm font-medium">{step.action}</p>
                    <p className="text-text-tertiary text-xs mt-1">Tool: {step.tool}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    };
  });

  return (
    <section id="cases" className="py-24 px-4 min-h-screen flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Sanskrit Śloka Banner */}
        <div className="mb-8 glass-panel border border-accent-neon/30 rounded-lg p-6 backdrop-blur-xl bg-gradient-to-r from-accent-neon/5 via-accent-purple/5 to-accent-cyan/5">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-5xl" role="img" aria-label={caseStudySloka.symbolMeaning}>
              {caseStudySloka.symbol}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-neon to-accent-cyan mb-1" style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.4)' }}>
                {caseStudySloka.devanagari}
              </div>
              <div className="text-sm text-accent-neon/70 italic mb-1">
                {caseStudySloka.transliteration}
              </div>
              <div className="text-xs text-text-secondary">
                {caseStudySloka.english}
              </div>
            </div>
          </div>
        </div>

        <SectionHeader 
          title="Real-World Cases" 
          subtitle="Analyze real forensic investigations with interactive 3D evidence reconstruction and multi-stage workflow analysis."
        />
        
        <Accordion items={accordionItems} allowMultiple />
      </div>

      {/* 3D Evidence Inspection Modal */}
      <Modal
        isOpen={!!selectedCase3D}
        onClose={() => setSelectedCase3D(null)}
        title={selectedCase3D?.title}
      >
        <div className="w-full h-[60vh]">
          {selectedCase3D && (
            <Canvas3D scene={selectedCase3D.scene} title={selectedCase3D.label} />
          )}
        </div>
        <div className="mt-4 text-text-secondary text-sm flex items-center justify-between">
          <p>Interactive 3D Evidence Reconstruction. Rotate and zoom to examine digital crime scene artifacts.</p>
        </div>
      </Modal>
    </section>
  );
}
