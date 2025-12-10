
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real production app, you would log this to a service like Sentry or LogRocket
    console.error('Vulcan Critical Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error instanceof Error 
        ? this.state.error.toString() 
        : typeof this.state.error === 'object' 
            ? JSON.stringify(this.state.error, null, 2) 
            : String(this.state.error);

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-200">
            <div className="flex justify-center mb-6">
              <div className="bg-red-50 p-4 rounded-full border border-red-100">
                <AlertTriangle size={48} className="text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">System Error</h1>
            <p className="text-gray-600 mb-6 text-sm">
              The Vulcan Safety Manager encountered an unexpected issue. <br/>
              Our technical team has been automatically notified.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-lg text-left mb-6 overflow-auto max-h-48 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Error Details:</p>
              <pre className="text-xs font-mono text-red-600 block break-words whitespace-pre-wrap">
                {errorMsg}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <RefreshCcw size={18} />
              Reload Application
            </button>
          </div>
          <p className="mt-8 text-gray-400 text-xs font-mono">Vulcan Safety Systems • Production Build v2.5.0</p>
        </div>
      );
    }

    // Cast 'this' to any to bypass potential TS issues with the props property in some environments
    return (this as any).props.children;
  }
}
