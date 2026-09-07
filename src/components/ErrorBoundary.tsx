import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // Surface it in the console for debugging; the UI stays usable.
    console.error('Caught by ErrorBoundary:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: undefined });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
          color: '#e0e7ff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.4rem', margin: 0 }}>Something went wrong</h1>
        <p style={{ maxWidth: 420, opacity: 0.8, margin: 0 }}>
          The lesson hit an unexpected error. Reloading should get you back to the start.
        </p>
        {this.state.message && (
          <code style={{ fontSize: '0.75rem', opacity: 0.55, maxWidth: 420, wordBreak: 'break-word' }}>
            {this.state.message}
          </code>
        )}
        <button
          onClick={this.handleReload}
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Reload the lesson
        </button>
      </div>
    );
  }
}
