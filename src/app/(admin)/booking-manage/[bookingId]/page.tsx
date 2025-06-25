'use client';
import PageBackButton from '@/components/common/PageBackButton';
import React from 'react';
import { useRouter } from 'next/navigation';
import ComponentCard from '@/components/common/ComponentCard';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import useBookingQuery from '@/hooks/api/bookings/useBookingQuery';
import useLocationQuery from '@/hooks/api/courts/useLocationQuery';
import Badge from '@/components/ui/badge/Badge';
import { BookingStatus } from '@/types/booking';
import Button from '@/components/ui/button/Button';
import useUpdateBookingStatusMutation from '@/hooks/api/bookings/useUpdateBookingStatusMutation';

function BookingDetailPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const bookingQuery = useBookingQuery(parseInt(bookingId));
    const locationQuery = useLocationQuery(bookingQuery.data?.location_id);
    const updateBookingStatus = useUpdateBookingStatusMutation();
    const router = useRouter();
    const handleClickBackBtn = () => {
        router.push('/booking-manage');
    };

    // Calculate total hours
    const calculateTotalHours = () => {
        return (
            bookingQuery.data?.slots?.reduce((total, slot) => {
                const [startHours, startMinutes] = slot.start_time.split(':').map(Number);
                const [endHours, endMinutes] = slot.end_time.split(':');

                const startDate = new Date();
                startDate.setHours(startHours, startMinutes, 0, 0);

                const endDate = new Date();
                endDate.setHours(Number(endHours), Number(endMinutes), 0, 0);

                return total + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
            }, 0) || 0
        );
    };

    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING:
                return <Badge color="warning">Chờ thanh toán</Badge>;
            case BookingStatus.CONFIRMED:
                return <Badge color="success">Đã xác nhận</Badge>;
            case BookingStatus.CANCELLED:
                return <Badge color="error">Đã hủy</Badge>;
            case BookingStatus.COMPLETED:
                return <Badge color="info">Hoàn thành</Badge>;
            default:
                return <Badge color="light">{status}</Badge>;
        }
    };

    const handleAdminConfirmBooking = () => {
        updateBookingStatus.mutate({
            id: parseInt(bookingId),
            status: BookingStatus.COMPLETED,
        });
    };

    const handleAdminCancelBooking = () => {
        updateBookingStatus.mutate({
            id: parseInt(bookingId),
            status: BookingStatus.CANCELLED,
        });
    };

    return (
        <>
            <div className="mb-6">
                <PageBackButton onClick={handleClickBackBtn} />
            </div>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Chi tiết đặt sân</h1>
                {getStatusBadge(bookingQuery.data?.status as BookingStatus)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Info Card */}
                <div className="md:col-span-1">
                    <ComponentCard title="Thông tin khách hàng" collapsible={false}>
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="relative w-24 h-24 mb-4 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20">
                                <Image
                                    src="/images/user/cat.png"
                                    alt="Customer"
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {bookingQuery.data?.customer_info.name || 'Khách hàng'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                <svg
                                    className="w-4 h-4 inline-block mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                {bookingQuery.data?.customer_info.phone_number || 'N/A'}
                            </p>
                        </div>
                    </ComponentCard>
                </div>

                {/* Booking Details Card */}
                <div className="md:col-span-2">
                    <ComponentCard title="Thông tin đặt lịch" collapsible={false}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <span className="text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">
                                        Mã lịch đặt
                                    </span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {bookingQuery.data?.booking_code || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">Cụm sân</span>
                                    <div>
                                        <div className="font-medium text-gray-800 dark:text-gray-200">
                                            {locationQuery.data?.name || 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {locationQuery.data?.address || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">
                                        Ngày đặt
                                    </span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {bookingQuery.data?.booking_date
                                            ? new Date(bookingQuery.data.booking_date).toLocaleDateString('vi-VN', {
                                                  day: '2-digit',
                                                  month: '2-digit',
                                                  year: 'numeric',
                                              })
                                            : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <span className="text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">
                                        Tổng giờ đặt
                                    </span>
                                    <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                        {calculateTotalHours().toFixed(1)} giờ
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">
                                        Tổng tiền
                                    </span>
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {bookingQuery.data?.total_price
                                            ? new Intl.NumberFormat('vi-VN', {
                                                  style: 'currency',
                                                  currency: 'VND',
                                              }).format(bookingQuery.data.total_price)
                                            : 'N/A'}
                                    </span>
                                </div>
                                {bookingQuery.data?.note && (
                                    <div className="flex items-start pt-2">
                                        <span className="text-gray-500 dark:text-gray-400 w-32 flex-shrink-0">
                                            Ghi chú
                                        </span>
                                        <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-gray-700 dark:text-gray-300">{bookingQuery.data.note}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Slot Information */}
                        {bookingQuery.data?.slots && bookingQuery.data.slots.length > 0 && (
                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                                    Chi tiết các khung giờ
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(
                                        bookingQuery.data.slots.reduce<Record<string, typeof bookingQuery.data.slots>>(
                                            (acc, slot) => {
                                                if (!slot) return acc;
                                                const courtId = slot.court_id?.toString() || 'unknown';
                                                acc[courtId] = acc[courtId] || [];
                                                acc[courtId].push(slot);
                                                return acc;
                                            },
                                            {},
                                        ),
                                    ).map(([courtId, slots]) => (
                                        <div key={courtId} className="mb-4">
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Sân {courtId}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {slots?.map(
                                                    (slot, idx) =>
                                                        slot && (
                                                            <div
                                                                key={`${courtId}-${idx}`}
                                                                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-md text-sm font-medium"
                                                            >
                                                                {slot.start_time} - {slot.end_time}
                                                            </div>
                                                        ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </ComponentCard>
                </div>

                {/* Payment Info Card */}
                <div className="md:col-span-3">
                    <ComponentCard title="Thông tin thanh toán">
                        {bookingQuery.data?.payment_image ? (
                            <div className="flex justify-center p-4">
                                <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                    <Image
                                        src={bookingQuery.data.payment_image}
                                        alt="Payment proof"
                                        width={600}
                                        height={400}
                                        className="object-contain w-full h-auto"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="p-4 mb-4 rounded-full bg-gray-100 dark:bg-gray-800">
                                    <svg
                                        className="w-10 h-10 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    Không có hình ảnh thanh toán
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Khách hàng chưa tải lên ảnh thanh toán
                                </p>
                            </div>
                        )}
                    </ComponentCard>
                </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
                {bookingQuery.data?.status === BookingStatus.CONFIRMED && (
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleAdminConfirmBooking}
                        className="bg-success-50 text-success-600 hover:bg-success-100 hover:text-success-700 dark:bg-success-500/15 dark:text-success-500 dark:hover:bg-success-500/25 dark:hover:text-success-400 transition-colors duration-200"
                    >
                        HOÀN THÀNH
                    </Button>
                )}

                {bookingQuery.data?.status !== BookingStatus.CANCELLED &&
                    bookingQuery.data?.status !== BookingStatus.COMPLETED && (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleAdminCancelBooking}
                            className="bg-error-50 text-error-600 hover:bg-error-100 hover:text-error-700 dark:bg-error-500/15 dark:text-error-500 dark:hover:bg-error-500/25 dark:hover:text-error-400 transition-colors duration-200"
                        >
                            HỦY LỊCH
                        </Button>
                    )}
            </div>
        </>
    );
}

export default BookingDetailPage;
