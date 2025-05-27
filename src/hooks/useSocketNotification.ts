import { useEffect } from 'react'
import socket from '@/lib/notificationSocket'
import { toast } from 'react-toastify'

function useSocketNotification() {
  useEffect(() => {
    // Listen for new booking notifications
    socket.on('new-booking', (data) => {
      toast.info('New booking received!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    })

    // Cleanup on unmount
    return () => {
      socket.off('new-booking')
    }
  }, [])

  return { socket }
}

export default useSocketNotification