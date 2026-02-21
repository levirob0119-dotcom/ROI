import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card 组件 - Linear 发光边框 + Raycast 毛玻璃
 */
const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            // 基础样式
            "rounded-[12px] bg-white/95 backdrop-blur-sm text-card-foreground",
            // 柔和边界：弱 ring 代替明显边框
            "ring-1 ring-slate-900/5",
            // 阴影 - 多层次
            "shadow-[0_6px_24px_rgba(15,23,42,0.06),0_2px_8px_rgba(15,23,42,0.04)]",
            // 过渡
            "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            // Hover - 上浮 + 阴影层次增强
            "hover:translate-y-[-3px]",
            "hover:ring-primary/15",
            "hover:shadow-[0_10px_30px_rgba(15,23,42,0.1),0_4px_12px_rgba(15,23,42,0.06)]",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col gap-1.5 p-5", className)}
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
            "text-[16px] font-semibold leading-tight tracking-[-0.02em]",
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
        className={cn("text-[13px] text-muted-foreground leading-relaxed", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-5 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
