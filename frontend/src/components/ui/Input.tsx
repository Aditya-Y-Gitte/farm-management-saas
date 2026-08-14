import React, { useId } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const defaultId = useId();
    const inputId = id || defaultId;
    const descriptionId = `${inputId}-desc`;
    const errorId = `${inputId}-error`;

    const fieldClasses = [
      'ui-input-field',
      error ? 'ui-input-field--error' : '',
      leftIcon ? 'ui-input-field--with-left-icon' : '',
      rightIcon ? 'ui-input-field--with-right-icon' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="ui-input-wrapper">
        {label && (
          <label
            htmlFor={inputId}
            className={`ui-input-label ${required ? 'ui-input-label--required' : ''}`}
          >
            {label}
          </label>
        )}
        {description && (
          <span id={descriptionId} className="ui-input-description">
            {description}
          </span>
        )}
        
        <div className="ui-input-container">
          {leftIcon && <span className="ui-input-icon--left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={fieldClasses}
            required={required}
            aria-invalid={!!error}
            aria-describedby={[
              description ? descriptionId : undefined,
              error ? errorId : undefined,
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          {rightIcon && <span className="ui-input-icon--right">{rightIcon}</span>}
        </div>

        {error && (
          <span id={errorId} className="ui-input-error-text" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
