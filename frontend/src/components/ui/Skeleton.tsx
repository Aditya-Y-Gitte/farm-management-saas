import React from 'react';
import './Skeleton.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  shape?: 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height = '1rem',
  shape = 'rect',
  className = '',
  style,
  ...props
}) => {
  const inlineStyle = {
    width,
    height,
    ...style,
  };

  return (
    <div
      className={`ui-skeleton ui-skeleton--${shape} ${className}`}
      style={inlineStyle}
      aria-hidden="true" // Usually decorative
      {...props}
    />
  );
};
