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
                        "h-11 w-full appearance-none rounded-control bg-white/88 px-3 pr-9 text-sm text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.14),0_1px_1px_rgba(15,23,42,0.02)] transition-[box-shadow,background-color,color] focus-visible:outline-none focus-visible:bg-white focus-visible:shadow-[inset_0_0_0_1px_rgba(100,116,139,0.24),0_0_0_4px_rgba(19,127,236,0.11),0_8px_20px_rgba(19,127,236,0.08)] aria-invalid:bg-red-50/45 aria-invalid:text-red-700 aria-invalid:shadow-[inset_0_0_0_1px_rgba(220,38,38,0.34),0_0_0_4px_rgba(220,38,38,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:text-slate-500 disabled:shadow-[inset_0_0_0_1px_rgba(148,163,184,0.1)]",
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
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select }
