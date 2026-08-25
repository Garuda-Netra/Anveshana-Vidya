import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Canvas3D from '../../../components/3d/Canvas3D';

// Mock Three.js components since we can't render WebGL in JSDOM
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas-mock">{children}</div>,
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: () => <div data-testid="perspective-camera" />,
  Float: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Stars: () => <div data-testid="stars" />,
}));

// Mock models
vi.mock('../../../components/3d/models/HDDModel', () => ({
  HDDModel: () => <div data-testid="hdd-model">HDD Model</div>,
}));

vi.mock('../../../components/3d/models/SSDModel', () => ({
  SSDModel: () => <div data-testid="ssd-model">SSD Model</div>,
}));

vi.mock('../../../components/3d/models/NetworkFlowModel', () => ({
  NetworkFlowModel: () => <div data-testid="network-model">Network Model</div>,
}));

vi.mock('../../../components/3d/models/RAMMemoryModel', () => ({
  RAMMemoryModel: () => <div data-testid="ram-model">RAM Model</div>,
}));

vi.mock('../../../components/3d/models/DataCarvingModel', () => ({
  DataCarvingModel: () => <div data-testid="carving-model">Carving Model</div>,
}));

vi.mock('../../../components/3d/models/MobileForensicsModel', () => ({
  MobileForensicsModel: () => <div data-testid="mobile-model">Mobile Model</div>,
}));

vi.mock('../../../components/3d/models/MalwareCapsuleModel', () => ({
  MalwareCapsuleModel: () => <div data-testid="malware-model">Malware Model</div>,
}));

vi.mock('../../../components/3d/models/StegoMatrixModel', () => ({
  StegoMatrixModel: () => <div data-testid="stego-model">Stego Model</div>,
}));

vi.mock('../../../components/3d/models/ForensicWorkstationModel', () => ({
  ForensicWorkstationModel: () => <div data-testid="workstation-model">Workstation Model</div>,
}));

vi.mock('../../../components/3d/models/EvidenceVaultModel', () => ({
  EvidenceVaultModel: () => <div data-testid="vault-model">Vault Model</div>,
}));

vi.mock('../../../components/3d/SceneLights', () => ({
  SceneLights: () => <div data-testid="scene-lights" />,
}));

describe('Canvas3D', () => {
  it('renders 3D view by default', () => {
    render(<Canvas3D scene="hdd" />);
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
    expect(screen.getByTestId('hdd-model')).toBeInTheDocument();
  });

  it('renders correct model based on scene prop', () => {
    const { rerender } = render(<Canvas3D scene="hdd" />);
    expect(screen.getByTestId('hdd-model')).toBeInTheDocument();

    rerender(<Canvas3D scene="ssd" />);
    expect(screen.getByTestId('ssd-model')).toBeInTheDocument();

    rerender(<Canvas3D scene="network-packet-flow" />);
    expect(screen.getByTestId('network-model')).toBeInTheDocument();

    rerender(<Canvas3D scene="ram-memory-model" />);
    expect(screen.getByTestId('ram-model')).toBeInTheDocument();
  });

  it('switches to 2D view when button is clicked', () => {
    render(<Canvas3D scene="hdd" />);
    
    const toggleButton = screen.getByText(/Switch to 2D/i);
    fireEvent.click(toggleButton);

    expect(screen.queryByTestId('canvas-mock')).not.toBeInTheDocument();
    expect(screen.getByText(/2D Forensic Architecture Diagram/i)).toBeInTheDocument();
    expect(screen.getByText(/Switch to 3D View/i)).toBeInTheDocument();
  });

  it('switches back to 3D view', () => {
    render(<Canvas3D scene="hdd" />);
    
    // Switch to 2D
    fireEvent.click(screen.getByText(/Switch to 2D/i));
    
    // Switch back to 3D
    fireEvent.click(screen.getByText(/Switch to 3D View/i));
    
    expect(screen.getByTestId('canvas-mock')).toBeInTheDocument();
  });
});
