import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SelectOption {
    label: string
    value: string
    disabled?: boolean
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
    options: SelectOption[]
    placeholder?: string
    onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, placeholder, value, defaultValue, onValueChange, ...props }, ref) => {
        return (
            <div className="relative w-full">
                <select
                    ref={ref}
                    className={cn(
                        "h-10 w-full appearance-none rounded-control bg-white px-3 pr-9 text-sm text-foreground shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35),0_1px_2px_rgba(15,23,42,0.04)] transition-all focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(19,127,236,0.45),0_8px_20px_rgba(19,127,236,0.1)] disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={(event) => onValueChange?.(event.target.value)}
                    {...props}
                >
                    {placeholder ? (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    ) : null}
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select }
