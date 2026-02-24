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
        info: 'bg-slate-800 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-red-500 text-white'
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
                styles[type]
            )}>
                {icons[type]}
                <span className="text-sm font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}
export { Toast }
export type { ToastProps }
