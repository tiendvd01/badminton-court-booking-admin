// lib/withAuth.tsx
import { IUser } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

type WithAuthOptions = {
  requiredRoles?: string[]; // optional: restrict by role
};

export function withAuth<P extends PropsWithChildren>(
  WrappedComponent: React.FC<P>,
  options?: WithAuthOptions
) {
  const { requiredRoles } = options || {};

  const ComponentWithAuth: React.FC<P> = (props: P) => {
    const router = useRouter();
    const user: IUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

    useEffect(() => {
      if (!user) {
        router.replace('/signin'); // Redirect if not authenticated
      } else if (requiredRoles && requiredRoles.includes(user.role)) {
        router.replace('/unauthorized'); // Redirect if role doesn't match
      }
    }, []);

    // Don't render if user doesn't exist or role mismatch
    if (!user || (requiredRoles?.includes(user.role))) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
}
