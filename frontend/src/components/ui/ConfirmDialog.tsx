import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
  cancelText,
  isDestructive = false,
}) => {
  const { t } = useTranslation();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await Promise.resolve(onConfirm());
      // Only close if successful
      onClose();
    } catch (error) {
      // Do not swallow error, do not close dialog. Let caller handle notification.
      console.error('Confirmation action failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    // Prevent accidental closing while a destructive/async action is in progress
    if (isConfirming) return;
    onClose();
  };

  const cText = confirmText || t('Confirm');
  const cancelTxt = cancelText || t('Cancel');

  const footer = (
    <>
      <Button
        variant="ghost"
        onClick={handleClose}
        disabled={isConfirming}
      >
        {cancelTxt}
      </Button>
      <Button
        variant={isDestructive ? 'danger' : 'primary'}
        onClick={handleConfirm}
        loading={isConfirming}
      >
        {cText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      footer={footer}
    >
      <p style={{ margin: 0, color: 'var(--color-text)', fontSize: 'var(--text-base)' }}>
        {message}
      </p>
    </Modal>
  );
};
