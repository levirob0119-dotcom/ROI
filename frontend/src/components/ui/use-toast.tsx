import * as React from "react"

import { Toast, type ToastProps } from "@/components/ui/toast"

interface ToastState {
    message: string
    type: ToastProps["type"]
    isVisible: boolean
}

export function useToast() {
    const [toast, setToast] = React.useState<ToastState>({
        message: "",
        type: "info",
        isVisible: false,
    })

    const showToast = React.useCallback((message: string, type: ToastProps["type"] = "info") => {
        setToast({ message, type, isVisible: true })
    }, [])

    const hideToast = React.useCallback(() => {
        setToast((previous) => ({ ...previous, isVisible: false }))
    }, [])

    const ToastComponent = React.useCallback(
        () => (
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        ),
        [hideToast, toast]
    )

    return { showToast, hideToast, ToastComponent }
}
