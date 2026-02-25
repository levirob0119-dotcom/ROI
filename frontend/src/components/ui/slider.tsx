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
                        <span className="text-xs text-slate-500">{min}{unit}</span>
                        <span className="text-sm font-semibold text-slate-900 tabular-nums">{value}{unit}</span>
                        <span className="text-xs text-slate-500">{max}{unit}</span>
                    </div>
                )}
                <div className="relative h-2.5 w-full">
                    {/* Track Background */}
                    <div className="absolute inset-0 rounded-full bg-slate-200/75 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.14)]" />

                    {/* Filled Track */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-primary shadow-[0_1px_1px_rgba(19,127,236,0.22),0_4px_10px_rgba(19,127,236,0.24)] transition-all"
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
                        onChange={(e) => onChange?.(Number(e.target.value))}
                        className={cn(
                            "absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent",
                            "[&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_1px_1px_rgba(19,127,236,0.2),0_6px_14px_rgba(15,23,42,0.22)]",
                            "[&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-[0_1px_1px_rgba(19,127,236,0.2),0_6px_14px_rgba(15,23,42,0.22)]",
                            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
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
