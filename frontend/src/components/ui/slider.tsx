import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value?: number
    min?: number
    max?: number
    step?: number
    showValue?: boolean
    unit?: string
    onChange?: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    ({ className, value = 0, min = 0, max = 100, step = 1, showValue = true, unit = '%', onChange, ...props }, ref) => {
        const percentage = ((value - min) / (max - min)) * 100

        return (
            <div className="w-full space-y-2">
                {showValue && (
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{min}{unit}</span>
                        <span className="text-sm font-semibold text-primary">{value}{unit}</span>
                        <span className="text-xs text-muted-foreground">{max}{unit}</span>
                    </div>
                )}
                <div className="relative h-2 w-full">
                    {/* Track Background */}
                    <div className="absolute inset-0 rounded-full bg-secondary" />

                    {/* Filled Track */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                    />

                    {/* Input */}
                    <input
                        type="range"
                        ref={ref}
                        value={value}
                        min={min}
                        max={max}
                        step={step}
                        onChange={(e) => onChange?.(parseInt(e.target.value))}
                        className={cn(
                            "absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent",
                            "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-white [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                            "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md",
                            "focus-visible:outline-none",
                            className
                        )}
                        {...props}
                    />
                </div>
            </div>
        )
    }
)
Slider.displayName = "Slider"

export { Slider }
