'use client';
import AdminTable from '@/components/tables/AdminTable/AdminTable';
import { withAuth } from '@/HOC/withAuth';
import React from 'react';

function AdminManagePage() {
    return (
        <div className="space-y-6">
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90">Admin</div>
            <AdminTable />
        </div>
    );
}

const AdminManagePageWithAuth = withAuth(AdminManagePage, {
    requiredRoles: ['admin'],
});

export default AdminManagePageWithAuth;
