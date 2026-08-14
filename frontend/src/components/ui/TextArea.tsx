import React, { useId } from 'react';
import './Input.css';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      description,
      error,
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const defaultId = useId();
    const textAreaId = id || defaultId;
    const descriptionId = `${textAreaId}-desc`;
    const errorId = `${textAreaId}-error`;

    const fieldClasses = [
      'ui-input-field',
      'ui-textarea-field',
      error ? 'ui-input-field--error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="ui-input-wrapper">
        {label && (
          <label
            htmlFor={textAreaId}
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
        
        <textarea
          ref={ref}
          id={textAreaId}
          className={fieldClasses}
          required={required}
          aria-invalid={!!error}
          aria-describedby={[
            description ? descriptionId : undefined,
            error ? errorId : undefined,
          ].filter(Boolean).join(' ') || undefined}
          {...props}
        />

        {error && (
          <span id={errorId} className="ui-input-error-text" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
