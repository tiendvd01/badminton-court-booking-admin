'use client';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useProfileQuery from '@/hooks/api/auth/useProfileQuery';

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
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
  const { initUserFromLocalStorage, login, isAuthenticated } = useAuthStore();
  const { data: profileData } = useProfileQuery();

  useEffect(() => {
    initUserFromLocalStorage();
  }, []);

  useEffect(() => {
    if (isAuthenticated && profileData?.data?.user) {
      // Update the user data with the latest from the server
      // We keep the same token
      const token = localStorage.getItem('token') || '';
      login(profileData.data.user, token);
    }
  }, [profileData, isAuthenticated, login]);

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
      <body className={`${jetbrainsMono.className} dark:bg-gray-900`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SidebarProvider>
              <AppInitializer />
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
