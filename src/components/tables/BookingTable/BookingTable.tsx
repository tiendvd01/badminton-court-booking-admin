
import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../ui/table';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import EmptyState from '@/components/common/EmptyState';
import { useRouter } from 'next/navigation';
import BookingTableRow from './BookingTableRow';
import useBookingsQuery from '@/hooks/api/bookings/useBookingsQuery';

interface BookingTableProps {
  locationId?: number;
}

export default function BookingTable({ locationId }: BookingTableProps) {
    const router = useRouter();
    const { data: bookingsData } = useBookingsQuery({ locationId });

    const headers = [
        { field: 'id', label: 'ID' },
        { field: 'court', label: 'Sân' },
        { field: 'customer', label: 'Khách hàng' },
        { field: 'booking_date', label: 'Ngày đặt' },
        { field: 'time', label: 'Thời gian' },
        { field: 'total_price', label: 'Tổng tiền' },
        { field: 'status', label: 'Trạng thái' },
        { field: 'action', label: 'Hành động' },
    ];

    const handleAddBooking = () => {
        router.push('/booking-manage/create');
    }

    return (
        <>
            {/* <div>
                <div className="flex justify-end mb-4">
                    <Button size="sm" variant="primary" startIcon={<PlusIcon />} onClick={handleAddBooking}>
                        Thêm đơn đặt sân
                    </Button>
                </div>
            </div> */}
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        {bookingsData?.data?.length ? (
                            <Table>
                                {/* Table Header */}
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        {headers.map((header, index) => (
                                            <TableCell
                                                key={index}
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                {header.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {bookingsData?.data.map((booking, rowIndex) => (
                                        <BookingTableRow key={rowIndex} data={booking} />
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

