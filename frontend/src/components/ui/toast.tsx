import * as React from "react"
import { X, AlertCircle, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
    message: string
    type?: 'info' | 'success' | 'warning' | 'error'
    isVisible: boolean
    onClose: () => void
    duration?: number
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    isVisible,
    onClose,
    duration = 3000
}) => {
    React.useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    if (!isVisible) return null

    const icons = {
        info: <Info size={16} />,
        success: <CheckCircle size={16} />,
        warning: <AlertCircle size={16} />,
        error: <AlertCircle size={16} />
    }

    const styles = {
        info: 'surface-panel text-slate-800',
        success: 'surface-tint-success text-success',
        warning: 'surface-tint-warning text-warning',
        error: 'surface-tint-error text-destructive'
    }

    return (
        <div
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300"
            role="status"
            aria-live="polite"
        >
            <div className={cn(
                "flex min-w-[280px] items-center gap-3 rounded-control px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.12)]",
                styles[type]
            )}>
                {icons[type]}
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 rounded p-1 transition-colors hover:bg-slate-200/60"
                    aria-label="关闭通知"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}
export { Toast }
export type { ToastProps }
