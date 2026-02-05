import toast from 'react-hot-toast';

/**
 * Branded Toast Notifications
 * Consistent styling with Docura brand colors
 */

export const showToast = {
    /**
     * Success toast with primary brand color
     */
    success: (message: string, duration: number = 3000) => {
        toast.success(message, {
            duration,
            style: {
                borderRadius: '12px',
                background: '#10b981',  // primary-500
                color: '#fff',
                padding: '16px 20px',
                fontWeight: '500',
                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2), 0 2px 4px -1px rgba(16, 185, 129, 0.1)',
            },
        });
    },

    /**
     * Error toast with red alert color
     */
    error: (message: string, duration: number = 4000) => {
        toast.error(message, {
            duration,
            style: {
                borderRadius: '12px',
                background: '#ef4444',  // red-500
                color: '#fff',
                padding: '16px 20px',
                fontWeight: '500',
                boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2), 0 2px 4px -1px rgba(239, 68, 68, 0.1)',
            },
        });
    },

    /**
     * Info toast with accent brand color
     */
    info: (message: string, duration: number = 3000) => {
        toast(message, {
            duration,
            icon: 'ℹ️',
            style: {
                borderRadius: '12px',
                background: '#06b6d4',  // accent-500
                color: '#fff',
                padding: '16px 20px',
                fontWeight: '500',
                boxShadow: '0 4px 6px -1px rgba(6, 182, 212, 0.2), 0 2px 4px -1px rgba(6, 182, 212, 0.1)',
            },
        });
    },

    /**
     * Warning toast with amber color
     */
    warning: (message: string, duration: number = 3500) => {
        toast(message, {
            duration,
            icon: '⚠️',
            style: {
                borderRadius: '12px',
                background: '#f59e0b',  // amber-500
                color: '#fff',
                padding: '16px 20px',
                fontWeight: '500',
                boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2), 0 2px 4px -1px rgba(245, 158, 11, 0.1)',
            },
        });
    },

    /**
     * Loading toast
     */
    loading: (message: string) => {
        return toast.loading(message, {
            style: {
                borderRadius: '12px',
                background: '#fff',
                color: '#0f172a',  // slate-900
                padding: '16px 20px',
                fontWeight: '500',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
        });
    },

    /**
     * Dismiss a specific toast or all toasts
     */
    dismiss: (toastId?: string) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    }
};

export default showToast;
