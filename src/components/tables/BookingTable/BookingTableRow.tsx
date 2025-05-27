import React from 'react';
import { TableCell, TableRow } from '../../ui/table';
import { Booking, BookingStatus } from '@/types/booking';
import { format } from 'date-fns';
import Badge from '@/components/ui/badge/Badge';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';

interface BookingTableRowProps {
    data: Booking;
}

export default function BookingTableRow({ data }: BookingTableRowProps) {
    const router = useRouter();

    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.PENDING:
                return <Badge color="warning">Chờ xác nhận</Badge>;
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
    const timeRange = `${data.start_time.substring(0, 5)} - ${data.end_time.substring(0, 5)}`;

    return (
        <TableRow>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {data.id}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {data.court?.name || `Sân #${data.court_id}`}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {customerName}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {formattedDate}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {timeRange}
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {data.total_price}đ
            </TableCell>
            <TableCell className="px-5 py-4 text-theme-sm text-gray-600 dark:text-gray-300">
                {getStatusBadge(data.status)}
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