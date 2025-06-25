import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getTimeRange } from '@/utils/helper';
import usePriceTablesQuery from '@/hooks/api/prices/usePriceTablesQuery';
import useCourtsQuery from '@/hooks/api/courts/useCourtsQuery';
import useGetBookingsQuery from '@/hooks/api/bookings/useGetBookingsQuery';
import { BookingStatus } from '@/types/booking';

interface BookingSheetProps {
    bookingDate: string;
}

const states = [{
    id: 'booked',
    name: 'Đã đặt',
    color: 'bg-gray-200 dark:bg-gray-700',
    borderColor: 'border-gray-300 dark:border-gray-600',
    textColor: 'text-gray-800 dark:text-gray-200'
}];

export default function BookingSheet({ bookingDate }: BookingSheetProps) {
    const { locationId } = useParams<{ locationId: string }>();
    const locationIdNum = parseInt(locationId);

    // Fetch necessary data
    const { data: bookingsData } = useGetBookingsQuery({
        locationId: locationIdNum,
        status: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        bookingDate,
    });

    const { data: priceTablesData } = usePriceTablesQuery(locationIdNum);
    const { data: courts = [] } = useCourtsQuery(locationIdNum);

    // Process price tables data
    const priceTables = priceTablesData?.data || [];

    // Process booked slots
    const bookedSlots = useMemo(() => {
        return bookingsData?.data?.reduce(
            (acc: Record<string, Array<{ startTime: string; endTime: string }>>, booking) => {
                booking.slots?.forEach((slot) => {
                    const courtId = slot.court_id.toString();
                    if (!acc[courtId]) {
                        acc[courtId] = [];
                    }
                    acc[courtId].push({
                        startTime: slot.start_time,
                        endTime: slot.end_time,
                    });
                });
                return acc;
            },
            {},
        );
    }, [bookingsData]);

    // Generate time slots
    const timeRange = getTimeRange(priceTables);
    const timeSlots = useMemo(() => {
        const generateTimeSlots = (start: string, end: string, intervalMinutes = 30) => {
            if (!start || !end) return [];
            const slots: string[] = [];
            const [startHour, startMinute] = start.split(':').map(Number);
            const [endHour, endMinute] = end.split(':').map(Number);

            let currentHour = startHour;
            let currentMinute = startMinute;

            while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
                const formattedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute
                    .toString()
                    .padStart(2, '0')}`;
                slots.push(formattedTime);

                currentMinute += intervalMinutes;
                if (currentMinute >= 60) {
                    currentHour += Math.floor(currentMinute / 60);
                    currentMinute = currentMinute % 60;
                }
            }
            return slots;
        };

        return generateTimeSlots(timeRange?.earliestStartTime, timeRange?.latestEndTime);
    }, [timeRange]);

    // Check if a cell is booked
    const isCellBooked = (courtId: number, timeSlotIndex: number) => {
        if (!bookedSlots?.[courtId]) return false;

        const startTime = timeSlots[timeSlotIndex];
        const endTime = timeSlots[timeSlotIndex + 1] || timeRange.latestEndTime;

        return bookedSlots[courtId].some((slot: any) => slot.startTime === startTime && slot.endTime === endTime);
    };

    // Render a row of time slots for a court
    const renderRow = (court: { id: number; name?: string }) => {
        const bookedState = states.find((state) => state.id === 'booked');

        return Array.from({ length: timeSlots.length - 1 }, (_, timeSlotIndex) => {
            const isBooked = isCellBooked(court.id, timeSlotIndex);
            const baseClasses = 'h-12 border min-w-[80px]';
            
            if (isBooked) {
                return (
                    <div
                        key={timeSlotIndex}
                        className={`${baseClasses} ${bookedState?.color} ${bookedState?.borderColor}`}
                    />
                );
            }
            
            return (
                <div
                    key={timeSlotIndex}
                    className={`${baseClasses} bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
                />
            );
        });
    };

    if (!courts?.length) {
        return <div className="p-4 text-gray-500 dark:text-gray-400">Đang tải thông tin sân...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <div className="min-w-max">
                {/* Time slots header */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="w-24 border-r border-gray-200 dark:border-gray-700 p-2 font-medium text-gray-700 dark:text-gray-300">
                        Sân
                    </div>
                    <div className="flex">
                        {timeSlots.slice(0, -1).map((time, index) => (
                            <div 
                                key={index} 
                                className="w-20 border-r border-gray-200 dark:border-gray-700 p-2 text-center text-sm text-gray-700 dark:text-gray-300"
                            >
                                {time}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Court rows */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {courts.map((court) => (
                        <div key={court.id} className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex w-24 items-center justify-center border-r border-gray-200 dark:border-gray-700 p-2 font-medium text-gray-900 dark:text-gray-100">
                                {court.name || `Sân ${court.id}`}
                            </div>
                            <div className="flex">{renderRow(court)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
