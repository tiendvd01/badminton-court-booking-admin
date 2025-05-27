'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ComponentCard from '@/components/common/ComponentCard';
import PageBackButton from '@/components/common/PageBackButton';
import BookingForm from '@/components/booking-manage/BookingForm';

function CreateBookingPage() {
    const router = useRouter();

    const handleSaveSuccess = () => {
        router.push('/booking-manage');
    };

    const handleClickBackBtn = () => {
        router.push('/booking-manage');
    };

    return (
        <>
            <div className="mb-4">
                <PageBackButton onClick={handleClickBackBtn} />
            </div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Tạo đơn đặt sân</div>
            <ComponentCard title="Thông tin đặt sân" defaultCollapsed={false}>
                <BookingForm onSaveSuccess={handleSaveSuccess} />
            </ComponentCard>
        </>
    );
}

export default CreateBookingPage;
