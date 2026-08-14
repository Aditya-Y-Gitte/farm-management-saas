import React from 'react';
import { Button, ButtonProps } from './Button';
import './IconButton.css';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string; // Enforce accessible name
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className = '', 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={`ui-icon-button ${className}`}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
