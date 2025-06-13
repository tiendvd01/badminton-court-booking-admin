import httpService from '../lib/httpService';

class NotificationRepository {
  // Get user notifications
  async getUserNotifications() {
    const response = await httpService.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`);
    return response.data;
  }

  // Mark notification as read
  async markAsRead(id: string) {
    const response = await httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`);
    return response.data;
  }

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await httpService.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`);
    return response.data;
  }
}

export default new NotificationRepository();
