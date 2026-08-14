import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import './Alert.css';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

const icons = {
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
  warning: <AlertTriangle size={18} />,
  error: <XCircle size={18} />,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = 'info', title, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`ui-alert ui-alert--${variant} ${className}`}
        role="alert"
        {...props}
      >
        <div className="ui-alert__icon">{icons[variant]}</div>
        <div className="ui-alert__content">
          {title && <div className="ui-alert__title">{title}</div>}
          <div>{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
