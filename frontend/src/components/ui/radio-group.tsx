import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioOption {
    value: string
    label: string
    description?: string
}

interface RadioGroupProps {
    options: RadioOption[]
    value?: string
    name: string
    onChange?: (value: string) => void
    className?: string
    orientation?: 'horizontal' | 'vertical'
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    options,
    value,
    name,
    onChange,
    className,
    orientation = 'horizontal'
}) => {
    return (
        <div className={cn(
            "flex gap-3",
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            className
        )}>
            {options.map((option) => (
                <label
                    key={option.value}
                    className={cn(
                        "relative flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all",
                        "ring-1 ring-slate-900/8 hover:bg-primary/5 hover:ring-primary/30",
                        value === option.value
                            ? "bg-primary/10 text-primary shadow-[0_8px_20px_rgba(19,127,236,0.16)] ring-primary/35"
                            : "bg-white text-foreground"
                    )}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="sr-only"
                    />

                    {/* Label Content */}
                    <span className={cn(
                        "text-sm font-medium",
                        value === option.value ? "text-primary" : "text-foreground"
                    )}>
                        {option.label}
                    </span>
                    {option.description && (
                        <span className="text-xs text-muted-foreground ml-1">{option.description}</span>
                    )}
                </label>
            ))}
        </div>
    )
}
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }
export type { RadioOption }
