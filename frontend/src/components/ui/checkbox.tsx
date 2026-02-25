import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
    onCheckedChange?: (checked: boolean) => void
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, defaultChecked, onCheckedChange, onChange, ...props }, ref) => {
        return (
            <label className="relative inline-flex cursor-pointer items-center">
                <input
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    defaultChecked={defaultChecked}
                    onChange={(event) => {
                        onCheckedChange?.(event.target.checked)
                        onChange?.(event)
                    }}
                    className="peer sr-only"
                    {...props}
                />
                <span
                    className={cn(
                        "inline-flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-white/92 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.2),0_1px_1px_rgba(15,23,42,0.03)] transition-[background-color,box-shadow]",
                        "peer-checked:bg-primary peer-checked:shadow-[0_1px_1px_rgba(19,127,236,0.22),0_6px_14px_rgba(19,127,236,0.28)]",
                        "peer-focus-visible:ring-4 peer-focus-visible:ring-primary/15",
                        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                        className
                    )}
                >
                    <Check className="h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                </span>
            </label>
        )
    }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
