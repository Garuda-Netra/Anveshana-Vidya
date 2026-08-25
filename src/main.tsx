import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@styles/index.css';

interface RootErrorBoundaryProps {
  children: ReactNode;
}

interface RootErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[RootErrorBoundary] Uncaught application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#060914',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'monospace'
        }}>
          <h1 style={{ color: '#00ffff', fontSize: '24px', marginBottom: '16px' }}>
            APPLICATION RECOVERY CONSOLE
          </h1>
          <div style={{
            backgroundColor: 'rgba(8, 16, 36, 0.9)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '600px',
            width: '100%',
            marginBottom: '20px',
            color: '#f87171'
          }}>
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00ffff',
              color: '#030508',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reload Platform
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
