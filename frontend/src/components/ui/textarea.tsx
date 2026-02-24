import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                "flex min-h-24 w-full resize-y rounded-control bg-white px-3 py-2 text-sm shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35),0_1px_2px_rgba(15,23,42,0.04)] transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(19,127,236,0.45),0_8px_20px_rgba(19,127,236,0.1)] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
