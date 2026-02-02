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
                        "relative flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all",
                        "hover:border-primary/50 hover:bg-primary/5",
                        value === option.value
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border bg-card"
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

                    {/* Custom Radio Circle */}
                    <div className={cn(
                        "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                        value === option.value
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/50"
                    )}>
                        {value === option.value && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                    </div>

                    {/* Label Content */}
                    <div className="flex flex-col">
                        <span className={cn(
                            "text-sm font-medium",
                            value === option.value ? "text-primary" : "text-foreground"
                        )}>
                            {option.label}
                        </span>
                        {option.description && (
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                        )}
                    </div>
                </label>
            ))}
        </div>
    )
}
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }
export type { RadioOption }
