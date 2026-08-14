import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import './Toast.css';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: React.ReactNode;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  success: (message: React.ReactNode, duration?: number) => void;
  error: (message: React.ReactNode, duration?: number) => void;
  warning: (message: React.ReactNode, duration?: number) => void;
  info: (message: React.ReactNode, duration?: number) => void;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const icons = {
  success: <CheckCircle2 size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerRemove = useCallback(() => {
    setIsRemoving(true);
    // Wait for animation to finish before removing from DOM
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // 300ms matches transition-normal
  }, [toast.id, onRemove]);

  React.useEffect(() => {
    if (toast.duration !== Infinity) {
      timerRef.current = setTimeout(() => {
        triggerRemove();
      }, toast.duration || 5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.duration, triggerRemove]);

  return (
    <div
      className={`ui-toast ui-toast--${toast.variant} ${isRemoving ? 'ui-toast--removing' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="ui-toast__icon">{icons[toast.variant]}</div>
      <div className="ui-toast__content">{toast.message}</div>
      <button
        className="ui-toast__close"
        onClick={triggerRemove}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: React.ReactNode, variant: ToastVariant, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => {
        const newToasts = [...prev, { id, message, variant, duration }];
        // Limit to 5 max toasts
        if (newToasts.length > 5) {
          return newToasts.slice(newToasts.length - 5);
        }
        return newToasts;
      });
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const api = React.useMemo(
    () => ({
      success: (msg: React.ReactNode, duration?: number) => addToast(msg, 'success', duration),
      error: (msg: React.ReactNode, duration?: number) => addToast(msg, 'error', duration),
      warning: (msg: React.ReactNode, duration?: number) => addToast(msg, 'warning', duration),
      info: (msg: React.ReactNode, duration?: number) => addToast(msg, 'info', duration),
      remove: removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="ui-toast-container">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
