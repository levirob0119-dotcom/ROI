import { createContext } from "react"

export interface SSOUser {
    username: string;
    displayName: string;
}

export interface AuthContextType {
    user: SSOUser | null
    isAuthenticated: boolean
    isLoading: boolean
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
