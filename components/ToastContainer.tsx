
import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ToastEventDetail } from '../utils/browserNotifications';

interface Toast extends ToastEventDetail {
  id: string;
}

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((detail: ToastEventDetail) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...detail, id }]);

    // Auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      addToast(customEvent.detail);
    };

    window.addEventListener('app-toast', handleEvent);
    return () => window.removeEventListener('app-toast', handleEvent);
  }, [addToast]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={24} className="text-emerald-500" />;
      case 'error': return <AlertCircle size={24} className="text-rose-500" />;
      case 'warning': return <AlertTriangle size={24} className="text-amber-500" />;
      default: return <Info size={24} className="text-blue-500" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success': return 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-900/20 shadow-emerald-500/10';
      case 'error': return 'border-rose-500/20 bg-rose-50/90 dark:bg-rose-900/20 shadow-rose-500/10';
      case 'warning': return 'border-amber-500/20 bg-amber-50/90 dark:bg-amber-900/20 shadow-amber-500/10';
      default: return 'border-blue-500/20 bg-blue-50/90 dark:bg-blue-900/20 shadow-blue-500/10';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-500 ease-out transform animate-slide-in-right
            ${getStyles(toast.type)}
          `}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-slate-800 dark:text-white leading-tight">
              {toast.title}
            </h4>
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed opacity-90">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
