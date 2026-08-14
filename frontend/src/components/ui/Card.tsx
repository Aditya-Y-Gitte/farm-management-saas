import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardWrapper = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`ui-card ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardWrapper.displayName = 'Card';

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', title, children, ...props }, ref) => {
    return (
      <div ref={ref} className={`ui-card__header ${className}`} {...props}>
        {title ? <h3 className="ui-card__header-title">{title}</h3> : children}
      </div>
    );
  }
);
CardHeader.displayName = 'Card.Header';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`ui-card__body ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardBody.displayName = 'Card.Body';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`ui-card__footer ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'Card.Footer';

export const Card = Object.assign(CardWrapper, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
