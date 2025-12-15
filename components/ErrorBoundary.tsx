import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, ShieldCheck } from 'lucide-react';
import { analyzeRuntimeError } from '../services/geminiService';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  aiDiagnosis: { rootCause: string, fix: string } | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      aiDiagnosis: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, aiDiagnosis: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 1. Silent Log to Console
    console.error('CARS Manager Critical Error:', error, errorInfo);

    // 2. Trigger Silent Gemini Analysis (Async)
    this.runSilentDiagnosis(error, errorInfo);
  }

  private runSilentDiagnosis = async (error: Error, errorInfo: ErrorInfo) => {
      try {
          const stack = errorInfo.componentStack || '';
          const diagnosis = await analyzeRuntimeError(error.message, stack);
          
          this.setState({ aiDiagnosis: diagnosis });

          // 3. Persist to "System Logs" (Simulated via localStorage for Admin view)
          const newLogEntry = {
              id: Date.now().toString(),
              level: 'ERROR', // Flagged as error but resolved by AI
              messageKey: `AUTO-RESOLVED: ${diagnosis.rootCause}`,
              user: 'Gemini Watchdog',
              timestamp: new Date().toLocaleString(),
              aiFix: diagnosis.fix // Specific field for AI fix
          };

          const existingLogs = JSON.parse(localStorage.getItem('sys_logs_backlog') || '[]');
          localStorage.setItem('sys_logs_backlog', JSON.stringify([newLogEntry, ...existingLogs]));

      } catch (e) {
          console.error("Silent diagnosis failed", e);
      }
  }

  public render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error instanceof Error 
        ? this.state.error.toString() 
        : String(this.state.error);

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center border border-gray-200 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

            <div className="flex justify-center mb-6">
              <div className="bg-red-50 p-4 rounded-full border border-red-100 shadow-inner">
                <AlertTriangle size={48} className="text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-slate-900 mb-2">Application Paused</h1>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              The system encountered an unexpected issue.
              <br />
              <span className="font-bold text-slate-800">Gemini Intelligence</span> has been notified and is analyzing the code.
            </p>
            
            {/* AI Diagnosis Section - Visually distinct */}
            {this.state.aiDiagnosis ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 text-left animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Auto-Diagnosis Complete</span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium mb-1">Root Cause Identified:</p>
                    <p className="text-xs text-slate-600 mb-3">{this.state.aiDiagnosis.rootCause}</p>
                    
                    <div className="bg-white rounded-lg p-3 border border-emerald-100/50">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Recommended Fix</p>
                        <code className="text-xs font-mono text-emerald-600 block whitespace-pre-wrap break-words">
                            {this.state.aiDiagnosis.fix}
                        </code>
                    </div>
                </div>
            ) : (
                <div className="mb-6 flex items-center justify-center gap-2 text-xs text-slate-400 animate-pulse">
                    <RefreshCcw size={12} className="animate-spin" />
                    Running silent diagnostic scan...
                </div>
            )}

            <div className="bg-slate-50 p-4 rounded-lg text-left mb-6 overflow-auto max-h-32 border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Raw Error:</p>
              <pre className="text-[10px] font-mono text-red-600 block break-words whitespace-pre-wrap">
                {errorMsg}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RefreshCcw size={18} />
              Reload Application
            </button>
          </div>
          <p className="mt-8 text-gray-400 text-xs font-mono">CARS Manager Systems • v2.5.0</p>
        </div>
      );
    }

    return this.props.children;
  }
}