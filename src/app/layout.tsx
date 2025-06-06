'use client';
import { Noto_Sans } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FrameGlobal from '@/layout/FrameGlobal';

const fonts = Noto_Sans({
    subsets: ['latin'],
});

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
        },
    },
});

function AppInitializer() {
    const { initUserFromLocalStorage } = useAuthStore();

    useEffect(() => {
        initUserFromLocalStorage();
    }, [initUserFromLocalStorage]);

    return null;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <title>ShuttleTime</title>
            </head>
            <body className={`${fonts.className} dark:bg-gray-900`}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <FrameGlobal>
                            <SidebarProvider>
                                <AppInitializer />
                                {children}
                            </SidebarProvider>
                        </FrameGlobal>
                    </ThemeProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
