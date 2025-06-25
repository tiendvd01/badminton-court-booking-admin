'use client'
import { useNotificationsQuery, useMarkAllAsReadMutation } from '@/hooks/api/notification';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';

function NotificationsPage() {
  const router = useRouter();
  const { data: notifications, isLoading } = useNotificationsQuery();
  console.log("🚀 ~ NotificationsPage ~ notifications:", notifications)
  const markAllAsReadMutation = useMarkAllAsReadMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">Thông báo</h1>
        <Button 
          onClick={() => markAllAsReadMutation.mutate()}
          disabled={markAllAsReadMutation.isPending}
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      {notifications?.data?.length === 0 ? (
        <div className="text-center py-8">
          <p>Không có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications?.data?.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 py-3 border-b">
                <div className="text-sm font-medium">
                  {notification.title}
                </div>
                <Badge
                  color={notification.is_read ? "info" : "success"}
                >
                  {notification.is_read ? "Đã đọc" : "Chưa đọc"}
                </Badge>
              </div>
              <div className="px-4 py-3">
                <div className="text-sm text-gray-600">
                  {notification.message}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary"
                    onClick={() => {
                      // Navigate to booking details page
                      router.push(`/booking-manage/${notification.data?.booking?.id}`);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
