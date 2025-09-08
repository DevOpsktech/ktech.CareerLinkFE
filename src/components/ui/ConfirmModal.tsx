import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="text-center">
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onCancel}
            variant="outline"
            size="md"
            className="rounded-full min-w-24"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant="red"
            size="md"
            className="rounded-full min-w-24"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
