import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

interface DialogContextValue {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext() {
    const context = React.useContext(DialogContext)
    if (!context) {
        throw new Error("Dialog components must be used within <Dialog>.")
    }
    return context
}

interface DialogProps {
    children: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

function Dialog({ children, open, defaultOpen = false, onOpenChange }: DialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const isControlled = open !== undefined
    const resolvedOpen = isControlled ? open : uncontrolledOpen

    const handleOpenChange = React.useCallback(
        (nextOpen: boolean) => {
            if (!isControlled) {
                setUncontrolledOpen(nextOpen)
            }
            onOpenChange?.(nextOpen)
        },
        [isControlled, onOpenChange]
    )

    return (
        <DialogContext.Provider value={{ open: resolvedOpen, onOpenChange: handleOpenChange }}>
            {children}
        </DialogContext.Provider>
    )
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    closeOnOverlayClick?: boolean
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({ className, children, closeOnOverlayClick = true, ...props }, ref) => {
        const { open, onOpenChange } = useDialogContext()

        React.useEffect(() => {
            if (!open) return

            const handleEscape = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    onOpenChange(false)
                }
            }

            document.addEventListener("keydown", handleEscape)
            return () => document.removeEventListener("keydown", handleEscape)
        }, [open, onOpenChange])

        React.useEffect(() => {
            if (!open) return

            const { overflow } = document.body.style
            document.body.style.overflow = "hidden"

            return () => {
                document.body.style.overflow = overflow
            }
        }, [open])

        if (!open) return null

        return createPortal(
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4 backdrop-blur-sm animate-in fade-in duration-200"
                onMouseDown={() => {
                    if (closeOnOverlayClick) {
                        onOpenChange(false)
                    }
                }}
            >
                <div
                    ref={ref}
                    role="dialog"
                    aria-modal="true"
                    className={cn(
                        "w-full max-w-lg rounded-card border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.16)] animate-in zoom-in-95 duration-200",
                        className
                    )}
                    onMouseDown={(event) => event.stopPropagation()}
                    {...props}
                >
                    {children}
                </div>
            </div>,
            document.body
        )
    }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-1.5 p-6 pb-0", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex flex-col-reverse gap-2 px-6 pb-6 pt-4 sm:flex-row sm:justify-end", className)} {...props} />
    )
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h2 ref={ref} className={cn("text-ds-title-sm font-semibold text-text-primary", className)} {...props} />
    )
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-ds-body-sm text-text-secondary", className)} {...props} />
    )
)
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }
