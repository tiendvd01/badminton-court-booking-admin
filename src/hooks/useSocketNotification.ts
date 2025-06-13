import { useEffect } from 'react'
import socket from '@/lib/notificationSocket'
import { toast } from 'react-toastify'
import { useAuthStore } from '@/stores/authStore';

function useSocketNotification() {
  const { user, isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      socket.auth = { ...socket.auth, token };
      socket.connect();

      // Listen for new booking notifications
      socket.on(`${user.id}_new-booking`, (data) => {
        toast.info('New booking received!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })
    }

    // Cleanup on unmount
    return () => {
      socket.off(`${user?.id}_new-booking`)
      socket.disconnect();
    }
  }, [isAuthenticated])

  return { socket }
}

export default useSocketNotification