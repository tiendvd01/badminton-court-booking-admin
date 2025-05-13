import { create } from 'zustand';

export interface IUser {
    id?: number;
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
    isAuthenticated: boolean | null;
    login: (user: IUser, token: string) => void;
    logout: () => void;
    initUserFromLocalStorage: () => void;
    setUser: (user: IUser) => void;
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
    
    const setUser = (user: IUser) => {
        set({
            user,
        })
        localStorage.setItem('user', JSON.stringify(user));
    }

    return {
        user: null,
        token: null,
        isAuthenticated: null,
        login,
        logout,
        initUserFromLocalStorage,
        setUser
    }
})