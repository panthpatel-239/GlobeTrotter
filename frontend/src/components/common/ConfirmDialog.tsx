import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center pt-2 pb-2">
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-3 ${
            variant === 'danger'
              ? 'bg-red-500/10 text-[#FF3B30] dark:text-[#FF453A]'
              : 'bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF]'
          }`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">{title}</h3>
        <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mb-5 leading-relaxed">{message}</p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading} className="text-xs">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="text-xs"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
