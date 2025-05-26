'use client';
import PaymentTable from '@/components/tables/PaymentTable/PaymentTable';
import { withAuth } from '@/HOC/withAuth';
import React from 'react';

function PaymentManagePage() {
    return (
        <div className="space-y-6">
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90">Tài khoản thanh toán</div>
            <PaymentTable />
        </div>
    );
}

export default withAuth(PaymentManagePage, {
    requiredRoles: ['admin', 'owner'],
});
