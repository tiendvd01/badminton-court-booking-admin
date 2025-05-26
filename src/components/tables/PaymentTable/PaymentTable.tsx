'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import usePaymentMethodsQuery from '@/hooks/api/payments/usePaymentMethodsQuery';
import { useAuthStore } from '@/stores/authStore';
import PaymentTableRow from './PaymentTableRow';
import EmptyState from '@/components/common/EmptyState';
import { useModal } from '@/hooks/useModal';
import PaymentMethodModal from '@/components/modals/payment/PaymentMethodModal';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';

interface PaymentTableProps {
    ownerId?: string;
}

const PaymentTable = ({ ownerId }: PaymentTableProps) => {
    const { user } = useAuthStore();
    const isOwner = user?.role === 'owner';
    const { isOpen, openModal, closeModal } = useModal();

    // If user is owner and no ownerId is provided, use the current user's id
    const effectiveOwnerId = isOwner && !ownerId ? user?.id?.toString() : ownerId;

    const { data: paymentMethods, isLoading } = usePaymentMethodsQuery(effectiveOwnerId);

    const headers = [
        { field: 'id', label: 'ID' },
        { field: 'account_name', label: 'Tên tài khoản' },
        { field: 'payment_number', label: 'Số tài khoản' },
        { field: 'bank_name', label: 'Ngân hàng' },
        { field: 'qr_image', label: 'Mã QR' },
        { field: 'is_active', label: 'Trạng thái' },
        { field: 'action', label: 'Hành động' },
    ];

    // Add owner column for admin users
    if (!isOwner) {
        headers.splice(1, 0, { field: 'owner', label: 'Chủ sân' });
    }

    return (
        <>
            <div className="flex justify-end">
                <Button size="sm" onClick={openModal} variant="primary" startIcon={<PlusIcon />}>
                    Thêm tài khoản thanh toán
                </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        {isLoading ? (
                            <div className="p-4 text-center">Đang tải...</div>
                        ) : paymentMethods?.length ? (
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
                                    {paymentMethods.map((payment) => (
                                        <PaymentTableRow 
                                            key={payment.id} 
                                            payment={payment} 
                                            showOwner={!isOwner} 
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>

            <PaymentMethodModal 
                isOpen={isOpen} 
                onClose={closeModal} 
                ownerId={effectiveOwnerId} 
            />
        </>
    );
};

export default PaymentTable;
