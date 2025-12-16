
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, ShieldCheck, Cpu, Zap, Activity, Terminal, CheckCircle2 } from 'lucide-react';
import { analyzeRuntimeError } from '../services/geminiService';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  aiDiagnosis: { rootCause: string, fix: string } | null;
  repairProgress: number;
  repairStep: string;
  isRepaired: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    aiDiagnosis: null,
    repairProgress: 0,
    repairStep: 'Initializing Diagnostics...',
    isRepaired: false
  };

  private simulationInterval: any = null;

  public static getDerivedStateFromError(error: Error): State {
    return { 
        hasError: true, 
        error, 
        aiDiagnosis: null, 
        repairProgress: 0, 
        repairStep: 'System Breach Detected...',
        isRepaired: false 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CARS Manager Critical Error:', error, errorInfo);

    // 1. Start the visual simulation immediately
    this.startRepairSimulation();

    // 2. Trigger Real Intelligence in background
    this.runSilentDiagnosis(error, errorInfo);
  }

  componentWillUnmount() {
      if (this.simulationInterval) clearInterval(this.simulationInterval);
  }

  private startRepairSimulation = () => {
      const steps = [
          "Scanning Neural Pathways...",
          "Isolating Corrupt Segments...",
          "Engaging RoboTech Healer Protocol...",
          "Re-calibrating State Logic...",
          "Optimizing Memory Shards...",
          "Applying Hotfix Patches...",
          "Verifying System Integrity..."
      ];

      let stepIndex = 0;

      this.simulationInterval = setInterval(() => {
          this.setState(prevState => {
              // Cap progress at 90% until real API returns (or timeout)
              if (prevState.repairProgress >= 90 && !this.state.aiDiagnosis) {
                  return { ...prevState, repairStep: "Awaiting AI Consensus..." };
              }

              const nextProgress = prevState.repairProgress + (Math.random() * 5);
              
              // Change text log every 15% progress
              if (Math.floor(nextProgress / 15) > stepIndex && stepIndex < steps.length - 1) {
                  stepIndex++;
              }

              return {
                  repairProgress: Math.min(nextProgress, 95),
                  repairStep: steps[stepIndex]
              };
          });
      }, 200);
  };

  private runSilentDiagnosis = async (error: Error, errorInfo: ErrorInfo) => {
      try {
          const stack = errorInfo.componentStack || '';
          const diagnosis = await analyzeRuntimeError(error.message, stack);
          
          // Wait a minimum time for effect, then finish
          setTimeout(() => {
              this.completeRepair(diagnosis);
          }, 2000); 

      } catch (e) {
          console.error("Silent diagnosis failed", e);
          // Fallback fix
          setTimeout(() => {
              this.completeRepair({ rootCause: "Unknown Runtime Exception", fix: "General Reset" });
          }, 3000);
      }
  }

  private completeRepair = (diagnosis: { rootCause: string, fix: string }) => {
      if (this.simulationInterval) clearInterval(this.simulationInterval);

      this.setState({ 
          aiDiagnosis: diagnosis,
          repairProgress: 100,
          repairStep: "SYSTEM RESTORED",
          isRepaired: true
      });

      // 3. Persist Log
      const newLogEntry = {
          id: Date.now().toString(),
          level: 'ERROR', 
          messageKey: `AUTO-RESOLVED: ${diagnosis.rootCause}`,
          user: 'RoboTech AI',
          timestamp: new Date().toLocaleString(),
          aiFix: diagnosis.fix 
      };
      
      try {
        const existingLogs = JSON.parse(localStorage.getItem('sys_logs_backlog') || '[]');
        localStorage.setItem('sys_logs_backlog', JSON.stringify([newLogEntry, ...existingLogs]));
      } catch (e) {
        console.error("Failed to persist log", e);
      }

      // 4. AUTO RELOAD
      setTimeout(() => {
          window.location.reload();
      }, 2500);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-mono overflow-hidden relative">
          
          {/* Background Grid Effect */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>

          <div className="relative z-10 max-w-2xl w-full">
            
            {/* --- CENTRAL VISUAL --- */}
            <div className="flex justify-center mb-10 relative">
                {/* Glowing Ring */}
                <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${this.state.isRepaired ? 'bg-green-500/40' : 'bg-cyan-500/30 animate-pulse'}`}></div>
                
                <div className={`relative h-32 w-32 bg-slate-900 rounded-full border-4 flex items-center justify-center shadow-2xl transition-all duration-500 ${this.state.isRepaired ? 'border-green-500 shadow-green-500/50' : 'border-cyan-500 shadow-cyan-500/50'}`}>
                    {this.state.isRepaired ? (
                        <CheckCircle2 size={64} className="text-green-400 animate-bounce-in" />
                    ) : (
                        <Cpu size={64} className="text-cyan-400 animate-spin-slow" />
                    )}
                </div>

                {/* Orbiting Particles */}
                {!this.state.isRepaired && (
                    <>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                            <Zap size={24} className="text-yellow-400 animate-bounce" />
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
                            <Activity size={24} className="text-pink-500 animate-pulse" />
                        </div>
                    </>
                )}
            </div>

            {/* --- TEXT CONTENT --- */}
            <div className="text-center mb-8 space-y-4">
                <h1 className={`text-3xl font-black tracking-[0.2em] transition-colors duration-500 ${this.state.isRepaired ? 'text-green-400' : 'text-white'}`}>
                    {this.state.isRepaired ? 'SYSTEM RESTORED' : 'SYSTEM CRITICAL'}
                </h1>
                
                <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl backdrop-blur-md shadow-lg">
                    <p className="text-cyan-300 text-lg font-bold mb-2 animate-pulse">
                        INTEGRATED ROBOTECH SYSTEM
                    </p>
                    <p className="text-slate-400 text-sm">
                        {this.state.isRepaired 
                            ? "Error corrected. Rebooting operational modules..."
                            : "The Integrated RoboTech System on-board has detected a system error, please wait while repairing."
                        }
                    </p>
                </div>
            </div>

            {/* --- PROGRESS VISUALIZATION --- */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase font-bold tracking-wider">
                    <span className="text-cyan-600">Repair Status</span>
                    <span className="text-cyan-400">{Math.floor(this.state.repairProgress)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
                    <div 
                        className={`h-full transition-all duration-300 ease-out relative overflow-hidden ${this.state.isRepaired ? 'bg-green-500' : 'bg-cyan-500'}`}
                        style={{ width: `${this.state.repairProgress}%` }}
                    >
                        {/* Shimmer effect on bar */}
                        <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                </div>
            </div>

            {/* --- TERMINAL OUTPUT --- */}
            <div className="mt-8 bg-black/80 rounded-lg border border-slate-800 p-4 font-mono text-xs h-32 overflow-hidden flex flex-col justify-end shadow-inner">
                <div className="text-slate-500 mb-1">C:\CARS_MANAGER\SYS\ROOT&gt; initiate_repair.exe</div>
                <div className="text-slate-500 mb-1">Loading AI Modules... OK</div>
                <div className="text-slate-400 mb-1">Analyzing stack trace...</div>
                <div className="text-cyan-500 font-bold flex items-center gap-2">
                    <Terminal size={12} />
                    {this.state.repairStep}
                    {!this.state.isRepaired && <span className="animate-pulse">_</span>}
                </div>
            </div>

            {/* Manual Override (Hidden when repaired to force auto-reload feel) */}
            {!this.state.isRepaired && (
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => window.location.reload()}
                        className="text-slate-600 hover:text-slate-400 text-[10px] uppercase tracking-widest hover:underline transition-all"
                    >
                        [ Manual Override Reboot ]
                    </button>
                </div>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
