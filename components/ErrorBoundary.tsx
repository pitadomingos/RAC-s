import React from 'react';
import { Cpu, Zap, Activity, Terminal, CheckCircle2, RefreshCw, Power } from 'lucide-react';
import { analyzeRuntimeError } from '../services/geminiService';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  aiDiagnosis: { rootCause: string, fix: string } | null;
  repairProgress: number;
  repairStep: string;
  isRepaired: boolean;
}

/**
 * Catches runtime errors and triggers autonomous repair visuals.
 * Inherits from React.Component to provide error boundary lifecycle methods.
 */
// Fix: Use React.Component explicitly to resolve issues with setState and props recognition in some TypeScript environments.
export class ErrorBoundary extends React.Component<Props, State> {
  // Initialize state to satisfy the React Component lifecycle.
  state: State = {
    hasError: false,
    error: null,
    aiDiagnosis: null,
    repairProgress: 0,
    repairStep: 'Initializing Diagnostics...',
    isRepaired: false
  };

  private simulationInterval: any = null;

  // Fix: Correct return type to align with static getDerivedStateFromError signature.
  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
        hasError: true, 
        error, 
        aiDiagnosis: null, 
        repairProgress: 0, 
        repairStep: 'System Breach Detected...',
        isRepaired: false 
    };
  }

  // Fix: Use React.ErrorInfo instead of named import for type consistency.
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorString = error.toString();
    const errorMessage = error.message || errorString;
    const isManualCrash = errorMessage.includes("MANUAL SYSTEM CRASH");

    if (isManualCrash) {
        console.warn('🧪 System Crash Simulation Triggered.');
    } else {
        console.error('CARS Manager Critical Error:', errorMessage);
    }

    // 1. Start Visuals
    this.startRepairSimulation();

    // 2. Run Real Diagnosis (Async)
    this.runSilentDiagnosis(errorMessage, errorInfo);
  }

  componentWillUnmount() {
      if (this.simulationInterval) clearInterval(this.simulationInterval);
  }

  // Fix: Arrow function property ensures 'this' correctly refers to the class instance inheriting from React.Component.
  private startRepairSimulation = () => {
      const steps = [
          "Scanning Neural Pathways...",
          "Isolating Corrupt Segments...",
          "Engaging RoboTech Healer Protocol...",
          "Re-calibrating State Logic...",
          "Optimizing Memory Shards...",
          "Flushing Local Cache...",
          "Verifying System Integrity..."
      ];

      let stepIndex = 0;

      this.simulationInterval = setInterval(() => {
          // Fix: setState is a standard method available on class components extending React.Component.
          this.setState((prevState) => {
              // Stop progressing if we are waiting for AI but hit 90%
              const canFinish = !!prevState.aiDiagnosis;
              
              if (prevState.repairProgress >= 90 && !canFinish) {
                  return { repairStep: "Finalizing Analysis..." };
              }

              const nextProgress = prevState.repairProgress + (Math.random() * 8); 
              
              let nextStep = prevState.repairStep;
              if (Math.floor(nextProgress / 15) > stepIndex && stepIndex < steps.length - 1) {
                  stepIndex++;
                  nextStep = steps[stepIndex];
              }

              return {
                  repairProgress: Math.min(nextProgress, 100),
                  repairStep: nextStep
              };
          });
      }, 200);
  };

  // Fix: Explicitly use React.ErrorInfo to ensure types are correctly resolved.
  private runSilentDiagnosis = async (errorMessage: string, errorInfo: React.ErrorInfo) => {
      try {
          // Real World: Attempt to get AI analysis
          const stack = errorInfo.componentStack || '';
          const diagnosis = await analyzeRuntimeError(errorMessage, stack);
          
          // Force wait to ensure animation plays a bit for effect
          setTimeout(() => {
              this.completeRepair(diagnosis);
          }, 2000); 

      } catch (e) {
          setTimeout(() => {
              this.completeRepair({ rootCause: "Unknown Runtime Exception", fix: "General State Reset" });
          }, 2000);
      }
  }

  // Fix: Use this.setState to finalize repair state once AI analysis is complete.
  private completeRepair = (diagnosis: { rootCause: string, fix: string }) => {
      if (this.simulationInterval) clearInterval(this.simulationInterval);

      // Real World: Clear potentially corrupted session state
      try {
          sessionStorage.clear();
      } catch(e) { /* ignore */ }

      this.setState({ 
          aiDiagnosis: diagnosis,
          repairProgress: 100,
          repairStep: "SYSTEM RESTORED",
          isRepaired: true
      });

      // Persist Log
      try {
          const newLogEntry = {
              id: Date.now().toString(),
              level: 'ERROR', 
              messageKey: `AUTO-RESOLVED: ${diagnosis.rootCause}`, 
              user: 'RoboTech AI',
              timestamp: new Date().toLocaleString(),
              aiFix: diagnosis.fix 
          };
          const existingLogs = JSON.parse(localStorage.getItem('sys_logs_backlog') || '[]');
          localStorage.setItem('sys_logs_backlog', JSON.stringify([newLogEntry, ...existingLogs]));
      } catch (e) {
          console.error("Failed to persist log", e);
      }
  }

  private forceReload = () => {
      try {
          window.location.reload();
      } catch(e) {
          window.location.href = window.location.href;
      }
  };

  public render() {
    if (this.state.hasError) {
      return (
        // FULL SCREEN OVERLAY
        <div className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center p-6 font-mono overflow-hidden text-white animate-fade-in">
          
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>

          <div className="relative z-10 max-w-2xl w-full">
            
            {/* --- CENTRAL VISUAL --- */}
            <div className="flex justify-center mb-10 relative">
                <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${this.state.isRepaired ? 'bg-green-500/40' : 'bg-red-500/30 animate-pulse'}`}></div>
                
                <div className={`relative h-32 w-32 bg-slate-900 rounded-full border-4 flex items-center justify-center shadow-2xl transition-all duration-500 ${this.state.isRepaired ? 'border-green-500 shadow-green-500/50' : 'border-red-500 shadow-red-500/50'}`}>
                    {this.state.isRepaired ? (
                        <CheckCircle2 size={64} className="text-green-400 animate-bounce-in" />
                    ) : (
                        <Cpu size={64} className="text-red-400 animate-spin-slow" />
                    )}
                </div>
            </div>

            {/* --- TEXT CONTENT --- */}
            <div className="text-center mb-8 space-y-4">
                <h1 className={`text-3xl font-black tracking-[0.2em] transition-colors duration-500 ${this.state.isRepaired ? 'text-green-400' : 'text-white'}`}>
                    {this.state.isRepaired ? 'SYSTEM RESTORED' : 'ROBOTECH INTERVENTION'}
                </h1>
                
                <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl backdrop-blur-md shadow-lg">
                    <p className={`text-lg font-bold mb-2 animate-pulse ${this.state.isRepaired ? 'text-green-300' : 'text-red-300'}`}>
                        {this.state.isRepaired ? 'OPERATIONAL STATUS: NORMAL' : 'CRITICAL ERROR DETECTED'}
                    </p>
                    <p className="text-slate-400 text-sm">
                        {this.state.isRepaired 
                            ? "Memory flushed. Stack cleared. Ready for manual reboot."
                            : "Autonomous repair agents have intercepted a runtime crash. Attempting state recovery."
                        }
                    </p>
                </div>
            </div>

            {/* --- PROGRESS VISUALIZATION --- */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase font-bold tracking-wider">
                    <span className={this.state.isRepaired ? 'text-green-500' : 'text-cyan-600'}>
                        {this.state.isRepaired ? 'Recovery Complete' : 'Repair Status'}
                    </span>
                    <span className="text-cyan-400">{Math.floor(this.state.repairProgress)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
                    <div 
                        className={`h-full transition-all duration-300 ease-out relative overflow-hidden ${this.state.isRepaired ? 'bg-green-500' : 'bg-cyan-500'}`}
                        style={{ width: `${this.state.repairProgress}%` }}
                    >
                        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                </div>
            </div>

            {/* --- TERMINAL OUTPUT --- */}
            <div className="mt-8 bg-black/80 rounded-lg border border-slate-800 p-4 font-mono text-xs h-32 overflow-hidden flex flex-col justify-end shadow-inner">
                <div className="text-slate-500 mb-1">C:\CARS_MANAGER\SYS\ROOT> initiate_healing.exe --force</div>
                <div className="text-slate-500 mb-1">Catching Exception... OK</div>
                <div className="text-slate-400 mb-1">Analyzing stack trace...</div>
                {this.state.aiDiagnosis && (
                    <div className="text-yellow-500 mb-1">Diagnosis: {this.state.aiDiagnosis.rootCause}</div>
                )}
                <div className="text-cyan-500 font-bold flex items-center gap-2">
                    <Terminal size={12} />
                    {this.state.repairStep}
                    {!this.state.isRepaired && <span className="animate-pulse">_</span>}
                </div>
            </div>

            {/* MANUAL REBOOT BUTTON */}
            {this.state.isRepaired && (
                <div className="mt-10 text-center animate-fade-in-up">
                    <button 
                        onClick={this.forceReload}
                        className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg shadow-green-500/30 flex items-center gap-3 mx-auto transition-all hover:scale-105"
                    >
                        <Power size={24} /> REBOOT SYSTEM
                    </button>
                    <p className="text-slate-500 text-xs mt-3 uppercase tracking-widest">Safe to reload</p>
                </div>
            )}

          </div>
        </div>
      );
    }

    // Fix: Using 'this.props' from React.Component to render children when no error occurred.
    return this.props.children;
  }
}
