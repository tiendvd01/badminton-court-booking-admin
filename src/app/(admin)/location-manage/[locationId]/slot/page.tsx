'use client';
import PageBackButton from '@/components/common/PageBackButton';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import useLocationQuery from '@/hooks/api/courts/useLocationQuery';
import BookingSheet from '@/components/booking-manage/BookingSheet';
import ComponentCard from '@/components/common/ComponentCard';

function PageSlot() {
    const { locationId } = useParams<{ locationId: string }>();
    const locationQuery = useLocationQuery(parseInt(locationId));
    const router = useRouter();

    const handleClickBackBtn = () => {
        router.push('/location-manage');
    };

    return (
        <>
            <div className="mb-4">
                <PageBackButton onClick={handleClickBackBtn} />
            </div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Sơ đồ đặt sân: {locationQuery.data?.name}
            </div>
            <ComponentCard className="mt-4">
                <BookingSheet bookingDate={new Date().toISOString().split('T')[0]} />
            </ComponentCard>
        </>
    );
}

export default PageSlot;
