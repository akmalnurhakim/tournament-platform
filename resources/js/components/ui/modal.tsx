import { X } from 'lucide-react';
import { ReactNode } from 'react';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-background rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}