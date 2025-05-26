import { withAuth } from '@/HOC/withAuth';
import React from 'react';

function BookingManagePage() {
    return (
        <div className="space-y-6">
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90">Quản lí đặt sân</div>
        </div>
    );
}

export default withAuth(BookingManagePage, {
    requiredRoles: ['admin', 'owner'],
});
