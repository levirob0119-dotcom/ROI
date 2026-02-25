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
                    "h-6 w-10 rounded-full bg-slate-300/90 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.2)] transition-[background-color,box-shadow] peer-focus-visible:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-primary/15 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:bg-primary peer-checked:shadow-[0_6px_14px_rgba(19,127,236,0.25)]",
                    className
                )} />
                <span className={cn(
                    "absolute left-[2px] top-[2px] block h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.24)] transition-transform peer-checked:translate-x-4",
                    "pointer-events-none"
                )} />
            </label>
        )
    }
)
Toggle.displayName = "Toggle"

export { Toggle }
