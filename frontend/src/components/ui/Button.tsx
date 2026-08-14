import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'ui-button',
      `ui-button--${variant}`,
      loading ? 'ui-button--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="ui-button__spinner" size={16} />}
        {!loading && leftIcon && <span className="ui-button__icon">{leftIcon}</span>}
        <span className="ui-button__content">{children}</span>
        {!loading && rightIcon && <span className="ui-button__icon">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
