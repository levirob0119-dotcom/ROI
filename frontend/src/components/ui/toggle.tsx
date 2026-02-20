import * as React from "react"
import { cn } from "@/lib/utils"

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <label className="relative inline-flex cursor-pointer items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    ref={ref}
                    {...props}
                />
                <div className={cn(
                    "h-6 w-11 rounded-full border-2 border-transparent bg-slate-200 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:bg-primary",
                    className
                )} />
                <span className={cn(
                    "absolute left-0.5 top-0.5 block h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5",
                    "pointer-events-none"
                )} />
            </label>
        )
    }
)
Toggle.displayName = "Toggle"

export { Toggle }
