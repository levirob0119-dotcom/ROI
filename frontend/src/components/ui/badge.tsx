import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 font-semibold tracking-[0.01em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-primary/14 text-primary",
                secondary:
                    "bg-slate-200/70 text-slate-700",
                destructive:
                    "bg-destructive/12 text-destructive",
                success:
                    "bg-success/12 text-success",
                warning:
                    "bg-warning/12 text-warning",
                outline: "surface-inset text-slate-700",
            },
            size: {
                sm: "px-2 py-0.5 text-[10px]",
                default: "px-2.5 py-0.5 text-[11px]",
                lg: "px-3 py-1 text-xs",
            },
            shape: {
                pill: "rounded-full",
                rounded: "rounded-md",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shape: "pill",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    withDot?: boolean
}

function Badge({ className, variant, size, shape, withDot = false, children, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant, size, shape }), className)} {...props}>
            {withDot ? <span className="size-1.5 rounded-full bg-current/70" aria-hidden="true" /> : null}
            {children}
        </span>
    )
}

export { Badge }
