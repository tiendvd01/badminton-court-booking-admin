import { create } from 'zustand';

export interface IUser {
    id: number;
    name?: string;
    email: string;
    phone?: string;
    role: string;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
}

type AuthState = {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: IUser, token: string) => void;
    logout: () => void;
    initUserFromLocalStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
    const login = (user: IUser, token: string) => {
        set({
            user,
            token,
            isAuthenticated: true,
        })
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    }
    const logout = () => {
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        })
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    const initUserFromLocalStorage = () => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
            set({
                user: JSON.parse(user),
                token,
                isAuthenticated: true,
            })
        }
    }

    return {
        user: null,
        token: null,
        isAuthenticated: false,
        login,
        logout,
        initUserFromLocalStorage    
    }
})