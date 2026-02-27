import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
    "rounded-card text-card-foreground transition-[box-shadow,transform,background-color]",
    {
        variants: {
            variant: {
                default: "surface-panel",
                subtle: "surface-panel-soft",
                elevated: "surface-panel shadow-[0_22px_46px_rgba(15,23,42,0.12)]",
            },
            interactive: {
                true: "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_1px_1px_rgba(15,23,42,0.03),0_22px_42px_rgba(15,23,42,0.14)] focus-within:-translate-y-0.5 focus-within:shadow-[0_1px_1px_rgba(15,23,42,0.03),0_22px_42px_rgba(15,23,42,0.14)]",
                false: "",
            },
        },
        defaultVariants: {
            variant: "default",
            interactive: false,
        },
    }
)

const sectionSpacing = {
    default: {
        header: "p-5 sm:p-6",
        content: "p-5 pt-0 sm:p-6 sm:pt-0",
        footer: "p-5 pt-0 sm:p-6 sm:pt-0",
    },
    compact: {
        header: "p-4 sm:p-5",
        content: "p-4 pt-0 sm:p-5 sm:pt-0",
        footer: "p-4 pt-0 sm:p-5 sm:pt-0",
    },
} as const

type CardDensity = keyof typeof sectionSpacing

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}
interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    density?: CardDensity
}

const Card = React.forwardRef<
    HTMLDivElement,
    CardProps
>(({ className, variant, interactive, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            cardVariants({ variant, interactive }),
            className,
        )}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    CardSectionProps
>(({ className, density = "default", ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col gap-1.5", sectionSpacing[density].header, className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-ds-title-sm font-semibold leading-tight text-slate-900",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-ds-body-sm leading-relaxed text-slate-500", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    CardSectionProps
>(({ className, density = "default", ...props }, ref) => (
    <div ref={ref} className={cn(sectionSpacing[density].content, className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    CardSectionProps
>(({ className, density = "default", ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center", sectionSpacing[density].footer, className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
