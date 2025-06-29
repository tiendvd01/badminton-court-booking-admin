'use client'
import { Booking } from '@/types/booking';
import React from 'react';
import { ToastContentProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Extend the props to include all required ToastContentProps
interface NotificationToastProps extends Partial<ToastContentProps> {
    data?: Booking;
    type?: NotificationType;
}

export const BookingNotificationToast: React.FC<NotificationToastProps> = ({ data }) => {
    const { booking_code, customer_info, total_price, id } = data || {};
    const router = useRouter();

    return (
        <div className="p-4 min-w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg" onClick={() => router.push(`/booking-manage/${id}`)}>
            <div className="flex items-start">
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {booking_code?.toUpperCase()}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Đơn mới
                        </span>
                    </div>

                    <div className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-start">
                            <svg
                                className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span className="font-medium">Khách hàng: </span>{' '}
                            {customer_info?.name || 'Không có thông tin'}
                        </div>

                        <div className="flex items-start">
                            <svg
                                className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                            <span className="font-medium">SĐT: </span> {customer_info?.phone_number || 'Chưa cập nhật'}
                        </div>

                        <div className="flex items-start">
                            <svg
                                className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-medium">Tổng tiền: </span>{' '}
                            {total_price ? `${total_price.toLocaleString()} VNĐ` : 'Liên hệ'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
