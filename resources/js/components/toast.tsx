// resources/js/components/Toast.tsx
import { useEffect, useState } from 'react';

type ToastProps = {
    message: string;
    variant?: 'success' | 'error';
    duration?: number;
};

export default function Toast({ message, variant = 'success', duration = 4000 }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    const styles = variant === 'success'
        ? 'bg-green-50 border-green-300 text-green-800'
        : 'bg-red-50 border-red-300 text-red-800';

    return (
        <div
            role="status"
            className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg border px-4 py-3 shadow-md ${styles}`}
        >
            <div className="flex items-start gap-3">
                <p className="text-sm flex-1">{message}</p>
                <button
                    onClick={() => setVisible(false)}
                    aria-label="Dismiss"
                    className="text-sm opacity-60 hover:opacity-100"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}