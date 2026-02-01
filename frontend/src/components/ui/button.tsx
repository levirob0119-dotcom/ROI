import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button 组件 - 多尺寸 + 多变体 + 微动效
 * 融合 Vercel/Raycast/Linear 设计
 */
const buttonVariants = cva(
    // 基础样式
    [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
        "font-medium",
        "cursor-pointer select-none",
        "transition-all duration-100 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[hsl(214_94%_64%_/_0.2)]",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.97]",
    ].join(" "),
    {
        variants: {
            variant: {
                // Primary - NIO Blue + 发光阴影
                default: [
                    "bg-[hsl(214_94%_64%)] text-white",
                    "shadow-[0_2px_8px_hsl(214_94%_64%_/_0.25)]",
                    "hover:bg-[hsl(214_94%_56%)]",
                    "hover:shadow-[0_4px_12px_hsl(214_94%_64%_/_0.3)]",
                    "hover:-translate-y-[1px]",
                ].join(" "),

                // Destructive
                destructive: [
                    "bg-destructive text-destructive-foreground",
                    "shadow-[0_2px_8px_hsl(0_84%_60%_/_0.2)]",
                    "hover:bg-[hsl(0_84%_55%)]",
                    "hover:shadow-[0_4px_12px_hsl(0_84%_60%_/_0.3)]",
                ].join(" "),

                // Outline
                outline: [
                    "border border-[hsl(214_94%_64%_/_0.3)] bg-transparent",
                    "text-[hsl(214_94%_64%)]",
                    "hover:bg-[hsl(214_94%_64%_/_0.05)]",
                    "hover:border-[hsl(214_94%_64%_/_0.5)]",
                ].join(" "),

                // Secondary
                secondary: [
                    "bg-black/[0.04] text-foreground",
                    "hover:bg-black/[0.08]",
                ].join(" "),

                // Ghost
                ghost: [
                    "text-muted-foreground",
                    "hover:bg-elevated hover:text-foreground",
                ].join(" "),

                // Link
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                // xs - 28px - 表格内/标签
                xs: "h-7 px-3 text-[12px] rounded-[4px]",

                // sm - 32px - 卡片内/工具栏  
                sm: "h-8 px-3.5 text-[13px] rounded-[6px]",

                // default/md - 36px - 默认/表单
                default: "h-9 px-4 text-[14px] rounded-[8px]",

                // lg - 44px - 主 CTA/Hero
                lg: "h-11 px-6 text-[15px] rounded-[10px]",

                // icon
                icon: "h-9 w-9 rounded-[8px]",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
