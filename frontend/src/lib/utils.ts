import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const UPPERCASE_ABBREVIATIONS = new Set(["UV", "UVA"]);

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatEnglishLabel(value: string) {
    return value
        .split(/([\s/-]+)/)
        .map((part) => {
            if (!part || /[\s/-]+/.test(part)) return part;

            const uppercase = part.toUpperCase();
            if (UPPERCASE_ABBREVIATIONS.has(uppercase)) return uppercase;

            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("");
}
