import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export interface SelectOption {
    label: string
    value: string
    disabled?: boolean
}

const selectVariants = cva(
    "w-full appearance-none rounded-control bg-white/88 px-3 pr-9 text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.14),0_1px_1px_rgba(15,23,42,0.02)] transition-[box-shadow,background-color,color] focus-visible:outline-none focus-visible:bg-white focus-visible:shadow-[inset_0_0_0_1px_rgba(100,116,139,0.24),0_0_0_4px_rgba(19,127,236,0.11),0_8px_20px_rgba(19,127,236,0.08)] aria-invalid:bg-red-50/45 aria-invalid:text-red-700 aria-invalid:shadow-[inset_0_0_0_1px_rgba(220,38,38,0.34),0_0_0_4px_rgba(220,38,38,0.1)] disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:text-slate-500 disabled:shadow-[inset_0_0_0_1px_rgba(148,163,184,0.1)]",
    {
        variants: {
            controlSize: {
                sm: "h-9 text-xs",
                default: "h-11 text-sm",
                lg: "h-12 text-base",
            },
            placeholderState: {
                true: "text-slate-400",
                false: "text-slate-900",
            },
        },
        defaultVariants: {
            controlSize: "default",
            placeholderState: false,
        },
    }
)

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "size">, VariantProps<typeof selectVariants> {
    options: SelectOption[]
    placeholder?: string
    onValueChange?: (value: string) => void
    helperText?: string
    errorText?: string
    invalid?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            className,
            options,
            placeholder,
            value,
            defaultValue,
            onValueChange,
            controlSize,
            helperText,
            errorText,
            invalid,
            ...props
        },
        ref
    ) => {
        const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
            typeof defaultValue !== "undefined" ? String(defaultValue) : ""
        )

        React.useEffect(() => {
            if (typeof value === "undefined") {
                setUncontrolledValue(typeof defaultValue !== "undefined" ? String(defaultValue) : "")
            }
        }, [defaultValue, value])

        const selectedValue = typeof value !== "undefined" ? String(value) : uncontrolledValue
        const isPlaceholderActive = Boolean(placeholder) && selectedValue === ""
        const hasError = Boolean(errorText || invalid)

        return (
            <div className="space-y-1.5">
                <div className="relative w-full">
                    <select
                        ref={ref}
                        className={cn(selectVariants({ controlSize, placeholderState: isPlaceholderActive }), className)}
                        value={selectedValue}
                        onChange={(event) => {
                            if (typeof value === "undefined") {
                                setUncontrolledValue(event.target.value)
                            }
                            onValueChange?.(event.target.value)
                        }}
                        aria-invalid={hasError || undefined}
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
                {errorText ? <p className="text-xs text-destructive">{errorText}</p> : null}
                {!errorText && helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select }
