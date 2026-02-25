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
            "flex gap-2",
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            className
        )}>
            {options.map((option) => (
                <label
                    key={option.value}
                    className={cn(
                        "cursor-pointer",
                        orientation === 'vertical' ? "w-full" : "min-w-[120px]"
                    )}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="peer sr-only"
                    />
                    <div className={cn(
                        "flex items-start gap-2 rounded-control bg-white/86 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.14),0_1px_1px_rgba(15,23,42,0.02)] transition-[box-shadow,background-color,color]",
                        "hover:bg-white",
                        "peer-focus-visible:shadow-[inset_0_0_0_1px_rgba(100,116,139,0.24),0_0_0_4px_rgba(19,127,236,0.11)]",
                        value === option.value
                            ? "bg-white shadow-[inset_0_0_0_1px_rgba(100,116,139,0.22),0_8px_20px_rgba(15,23,42,0.08)]"
                            : ""
                    )}>
                        <span className={cn(
                            "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors shadow-[inset_0_0_0_1px_rgba(148,163,184,0.3)]",
                            value === option.value ? "bg-primary shadow-[0_6px_14px_rgba(19,127,236,0.28)]" : "bg-white"
                        )}>
                            <span className={cn(
                                "h-1.5 w-1.5 rounded-full bg-white transition-opacity",
                                value === option.value ? "opacity-100" : "opacity-0"
                            )} />
                        </span>
                        <span className="min-w-0 space-y-0.5">
                            <span className={cn(
                                "block text-sm font-medium",
                                value === option.value ? "text-slate-900" : "text-slate-700"
                            )}>
                                {option.label}
                            </span>
                            {option.description ? (
                                <span className="block text-xs text-slate-500">{option.description}</span>
                            ) : null}
                        </span>
                    </div>
                </label>
            ))}
        </div>
    )
}
RadioGroup.displayName = "RadioGroup"

export { RadioGroup }
export type { RadioOption }
