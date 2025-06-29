import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getTimeRange } from '@/utils/helper';
import useCourtsQuery from '@/hooks/api/courts/useCourtsQuery';
import useGetBookingsQuery from '@/hooks/api/bookings/useGetBookingsQuery';
import { BookingStatus } from '@/types/booking';
import { usePriceTableByLocationQuery } from '@/hooks/api/prices/usePriceTableByLocationQuery';
import useLocationQuery from '@/hooks/api/courts/useLocationQuery';

interface BookingSheetProps {
    bookingDate: string;
}

const states = [
    { 
        id: 'available', 
        name: 'Trống', 
        className: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'
    },
    { 
        id: 'booked', 
        name: 'Đã đặt', 
        className: 'bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
        icon: '✓'
    },
    { 
        id: 'locked', 
        name: 'Khóa', 
        className: 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400',
        icon: '🔒'
    }
];

export default function BookingSheet({ bookingDate }: BookingSheetProps) {
    const { locationId } = useParams<{ locationId: string }>();
    const locationIdNum = parseInt(locationId);

    const locationQuery = useLocationQuery(locationIdNum);

    // Fetch necessary data
    const { data: bookingsData } = useGetBookingsQuery({
        locationId: locationIdNum,
        status: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        bookingDate,
    });

    const { data: priceTablesData } = usePriceTableByLocationQuery({ locationId: locationIdNum });
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
    const timeRange = getTimeRange(priceTables.data);

    const generateTimeSlots = (start: string, end: string, intervalMinutes = 30) => {
        if (!start || !end) return [];
        const slots: string[] = [];
        
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        
        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
            // Format the time to HH:mm
            const formattedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            slots.push(formattedTime);

            // Add interval
            currentMinute += intervalMinutes;

            // Handle hour overflow
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
        }
        
        return slots;
    };
    const timeSlots = generateTimeSlots(timeRange?.earliestStartTime, timeRange?.latestEndTime, locationQuery?.data?.min_shift_time);

    // Check if a cell is booked
    const isCellBooked = (courtId: number, timeSlotIndex: number) => {
        if (!bookedSlots?.[courtId]) return false;

        const startTime = timeSlots[timeSlotIndex];
        const endTime = timeSlots[timeSlotIndex + 1] || timeRange.latestEndTime;

        return bookedSlots[courtId].some((slot: any) => slot.startTime === startTime && slot.endTime === endTime);
    };

    // Render a row of time slots for a court
    const renderRow = (court: { id: number; name?: string }) => {
        return Array.from({ length: timeSlots.length - 1 }, (_, timeSlotIndex) => {
            const isBooked = isCellBooked(court.id, timeSlotIndex);
            const state = states.find(s => s.id === (isBooked ? 'booked' : 'available'));
            
            return (
                <div
                    key={timeSlotIndex}
                    className={`w-24 min-w-[96px] h-full border flex items-center justify-center relative ${state?.className}`}
                >
                    {isBooked && (
                        <div className={`absolute inset-0 flex items-center justify-center ${state?.className}`}>
                        </div>
                    )}
                </div>
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
                    <div className="w-24 border-r border-gray-200 dark:border-gray-700 p-2 font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center">
                        Sân
                    </div>
                    <div className="flex">
                        {timeSlots.slice(0, -1).map((startTime, index) => {
                            const endTime = timeSlots[index + 1] || timeRange?.latestEndTime;
                            return (
                                <div 
                                    key={index} 
                                    className="w-24 min-w-[96px] border-r border-gray-200 dark:border-gray-700 p-1 text-center text-xs text-gray-700 dark:text-gray-300 flex flex-col"
                                >
                                    <div>{startTime}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">-</div>
                                    <div>{endTime}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Court rows */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {courts.map((court) => (
                        <div key={court.id} className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex w-24 items-center justify-center border-r border-gray-200 dark:border-gray-700 p-2 font-medium text-gray-900 dark:text-gray-100">
                                {court.name || `Sân ${court.id}`}
                            </div>
                            <div className="flex w-[calc(100%-96px)]">{renderRow(court)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
