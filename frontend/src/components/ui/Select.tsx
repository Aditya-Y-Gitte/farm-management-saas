import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import './Input.css';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      description,
      error,
      className = '',
      id,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const defaultId = useId();
    const selectId = id || defaultId;
    const descriptionId = `${selectId}-desc`;
    const errorId = `${selectId}-error`;

    const fieldClasses = [
      'ui-input-field',
      'ui-select-field',
      error ? 'ui-input-field--error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="ui-input-wrapper">
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            className={fieldClasses}
            required={required}
            aria-invalid={!!error}
            aria-describedby={[
              description ? descriptionId : undefined,
              error ? errorId : undefined,
            ].filter(Boolean).join(' ') || undefined}
            {...props}
          >
            {children}
          </select>
          <span className="ui-select-caret">
            <ChevronDown size={16} />
          </span>
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

Select.displayName = 'Select';
