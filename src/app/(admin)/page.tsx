'use client'
import { useNotificationsQuery } from '@/hooks/api/notification';
import { useRouter } from 'next/navigation';

function NotificationsPage() {
  const router = useRouter();
  const { isLoading } = useNotificationsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">

    </div>
  );
}

export default NotificationsPage;
