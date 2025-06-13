import React from 'react';
import { TableCell, TableRow } from '../../ui/table';
import { Booking, BookingStatus } from '@/types/booking';
import { format } from 'date-fns';
import Badge from '@/components/ui/badge/Badge';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import useLocationQuery from '@/hooks/api/courts/useLocationQuery';
import useCourtQuery from '@/hooks/api/courts/useCourtQuery';

interface BookingTableRowProps {
    data: Booking;
}

export default function BookingTableRow({ data }: BookingTableRowProps) {
    const router = useRouter();

    const { data: courtData } = useCourtQuery(data.slots[0].court_id);
    const { data: locationData } = useLocationQuery(courtData?.location_id);

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

    const handleViewDetails = () => {
        router.push(`/booking-manage/${data.id}`);
    };

    const handleEdit = () => {
        router.push(`/booking-manage/edit/${data.id}`);
    };

    const customerName = data.customer_info?.name || 'Khách';
    const formattedDate = format(new Date(data.created_at || data.created_at), 'dd/MM/yyyy');

    return (
        <TableRow>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {data.id}
            </TableCell>
            <TableCell className="px-5 py-4 font-bold text-theme-sm text-yellow-500 dark:text-yellow-300">
                {data.booking_code.toUpperCase()}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {locationData?.name || `Unknown`}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {customerName}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {formattedDate}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.floor(data.total_price))}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {getStatusBadge(data.status as BookingStatus)}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                <div className="flex space-x-2">
                    <Button onClick={handleViewDetails} variant="outline" size="sm" className='bg-gray-300 text-black'>
                        Chi tiết
                    </Button>
                    <Button onClick={handleEdit} variant="primary" size="sm">
                        Sửa
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}