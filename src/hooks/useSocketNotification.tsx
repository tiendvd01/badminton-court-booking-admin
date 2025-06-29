import { useEffect } from 'react'
import socket from '@/lib/notificationSocket'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/stores/authStore';
import { BookingNotificationToast } from '@/components/notifications/BookingNotificationToast';

function useSocketNotification() {
  const { user, isAuthenticated, token } = useAuthStore();


  useEffect(() => {
    if (isAuthenticated && user?.id) {
      socket.auth = { ...socket.auth, token };
      socket.connect();

      // Listen for new booking notifications
      socket.on(`${user.id}_new-booking`, (data) => {
        toast(() => <BookingNotificationToast data={data.booking} />, {
          autoClose: false,
          type: 'success',
        })
      })
    }

    // Cleanup on unmount
    return () => {
      socket.off(`${user?.id}_new-booking`)
      socket.disconnect();
    }
  }, [isAuthenticated, token, user?.id])

  return { socket }
}

export default useSocketNotification