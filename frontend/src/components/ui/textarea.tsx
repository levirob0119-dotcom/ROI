import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                "flex min-h-28 w-full resize-y rounded-control bg-slate-50/95 px-3 py-2 text-sm text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)] transition-[box-shadow,background-color,color] placeholder:text-slate-400 focus-visible:outline-none focus-visible:bg-white focus-visible:shadow-[inset_0_0_0_1px_rgba(100,116,139,0.28),0_0_0_4px_rgba(19,127,236,0.12)] aria-invalid:bg-red-50/45 aria-invalid:text-red-700 aria-invalid:shadow-[inset_0_0_0_1px_rgba(220,38,38,0.4),0_0_0_4px_rgba(220,38,38,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)]",
                className
            )}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
