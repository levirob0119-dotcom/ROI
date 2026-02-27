import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-slate-900 text-white shadow-[0_1px_1px_rgba(15,23,42,0.18),0_10px_24px_rgba(15,23,42,0.24)] hover:bg-slate-800",
                action:
                    "bg-primary text-primary-foreground shadow-[0_1px_1px_rgba(19,127,236,0.22),0_12px_28px_rgba(19,127,236,0.32)] hover:bg-primary-hover hover:shadow-[0_1px_1px_rgba(19,127,236,0.24),0_14px_30px_rgba(19,127,236,0.36)]",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-[0_1px_1px_rgba(220,38,38,0.2),0_10px_24px_rgba(220,38,38,0.24)] hover:bg-destructive/90",
                outline:
                    "surface-inset text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:bg-white hover:text-slate-900",
                secondary:
                    "surface-panel-soft text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:bg-white",
                ghost: "text-slate-600 hover:bg-white/80 hover:text-slate-900",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-11 px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
    loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading = false, loadingText, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const content = isLoading ? (loadingText ?? children) : children
        const disabledState = disabled || isLoading

        if (asChild) {
            return (
                <Comp
                    className={cn(
                        buttonVariants({ variant, size, className }),
                        disabledState && "pointer-events-none opacity-50"
                    )}
                    ref={ref}
                    aria-disabled={disabledState || undefined}
                    {...props}
                >
                    {children}
                </Comp>
            )
        }

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                aria-busy={isLoading || undefined}
                aria-disabled={disabledState || undefined}
                disabled={disabledState}
                {...props}
            >
                {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {content}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button }
