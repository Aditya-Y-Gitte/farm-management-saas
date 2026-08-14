import React from 'react';
import { Input, InputProps } from './Input';

export interface NumberInputProps extends Omit<InputProps, 'type'> {
  step?: number | string;
  min?: number | string;
  max?: number | string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    return <Input ref={ref} type="number" {...props} />;
  }
);

NumberInput.displayName = 'NumberInput';
