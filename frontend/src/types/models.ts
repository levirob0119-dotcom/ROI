export interface User {
    id: string;
    username: string;
    displayName: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Project {
    id: string;
    userId: string;
    name: string;
    description: string;
    vehicles: string[];
    createdAt: string;
    updatedAt: string;
}
