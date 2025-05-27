'use client';

import React from 'react';
import BookingTable from '@/components/tables/BookingTable/BookingTable';

export default function BookingManagePage() {
    return (
        <>
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90">Quản lý đặt sân</div>
            <BookingTable />
        </>
    );
}
