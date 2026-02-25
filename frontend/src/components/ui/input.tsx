import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-control bg-white/88 px-3 text-sm text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.14),0_1px_1px_rgba(15,23,42,0.02)] transition-[box-shadow,background-color,color] placeholder:text-slate-400 focus-visible:outline-none focus-visible:bg-white focus-visible:shadow-[inset_0_0_0_1px_rgba(100,116,139,0.24),0_0_0_4px_rgba(19,127,236,0.11),0_8px_20px_rgba(19,127,236,0.08)] aria-invalid:bg-red-50/45 aria-invalid:text-red-700 aria-invalid:shadow-[inset_0_0_0_1px_rgba(220,38,38,0.34),0_0_0_4px_rgba(220,38,38,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:text-slate-500 disabled:shadow-[inset_0_0_0_1px_rgba(148,163,184,0.1)]",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
