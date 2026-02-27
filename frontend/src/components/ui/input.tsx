import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
    "flex w-full rounded-control bg-white/88 px-3 text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.14),0_1px_1px_rgba(15,23,42,0.02)] transition-[box-shadow,background-color,color] placeholder:text-slate-400 focus-visible:outline-none focus-visible:bg-white focus-visible:shadow-[inset_0_0_0_1px_rgba(100,116,139,0.24),0_0_0_4px_rgba(19,127,236,0.11),0_8px_20px_rgba(19,127,236,0.08)] aria-invalid:bg-red-50/45 aria-invalid:text-red-700 aria-invalid:shadow-[inset_0_0_0_1px_rgba(220,38,38,0.34),0_0_0_4px_rgba(220,38,38,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:text-slate-500 disabled:shadow-[inset_0_0_0_1px_rgba(148,163,184,0.1)]",
    {
        variants: {
            controlSize: {
                sm: "h-9 text-xs",
                default: "h-11 text-sm",
                lg: "h-12 text-base",
            },
        },
        defaultVariants: {
            controlSize: "default",
        },
    }
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    startAdornment?: React.ReactNode
    endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, controlSize, startAdornment, endAdornment, ...props }, ref) => {
        const hasStartAdornment = Boolean(startAdornment)
        const hasEndAdornment = Boolean(endAdornment)

        const inputNode = (
            <input
                type={type}
                className={cn(
                    inputVariants({ controlSize }),
                    hasStartAdornment && "pl-9",
                    hasEndAdornment && "pr-9",
                    className
                )}
                ref={ref}
                {...props}
            />
        )

        if (!hasStartAdornment && !hasEndAdornment) {
            return inputNode
        }

        return (
            <div className="relative w-full">
                {hasStartAdornment ? (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {startAdornment}
                    </span>
                ) : null}
                {inputNode}
                {hasEndAdornment ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {endAdornment}
                    </span>
                ) : null}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
