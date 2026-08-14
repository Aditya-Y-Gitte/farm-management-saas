import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import './ErrorState.css';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  isRetrying = false,
  className = '',
  ...props
}) => {
  const { t } = useTranslation(['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance']);

  const defaultTitle = t('common:errors.defaultTitle', { defaultValue: 'Error' });
  const defaultMessage = t('common:errors.defaultMessage', { defaultValue: 'Unable to load this content. Please try again.' });

  return (
    <div className={`ui-error-state ${className}`} role="alert" {...props}>
      <div className="ui-error-state__icon">
        <AlertCircle size={32} />
      </div>
      <h3 className="ui-error-state__title">{title || defaultTitle}</h3>
      <p className="ui-error-state__message">{message || defaultMessage}</p>
      {onRetry && (
        <Button
          variant="secondary"
          onClick={onRetry}
          loading={isRetrying}
          leftIcon={<RefreshCw size={16} />}
        >
          {t('common:actions.retry', { defaultValue: 'Retry' })}
        </Button>
      )}
    </div>
  );
};
