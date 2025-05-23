import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../ui/table';
import useUsersQuery from '@/hooks/api/auth/useUsersQuery';
import CustomerTableRow from './CustomerTableRow';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import CreateCustomerModal from '@/components/modals/CreateCustomerModal';
import { useModal } from '@/hooks/useModal';
import EmptyState from '@/components/common/EmptyState';

export default function CustomerTable() {
    const { data: usersData } = useUsersQuery({ role: 'customer' });
    const { isOpen, openModal, closeModal } = useModal();

    const headers = [
        { field: 'id', label: 'ID' },
        { field: 'name', label: 'Tên khách hàng' },
        { field: 'phone', label: 'Số điện thoại' },
        { field: 'email', label: 'Email' },
        { field: 'address', label: 'Địa chỉ' },
        { field: 'action', label: 'Hành động' },
    ];

    return (
        <>
            <CreateCustomerModal isOpen={isOpen} onClose={closeModal} />
            <div className="flex justify-end">
                <Button size="sm" onClick={openModal} variant="primary" startIcon={<PlusIcon />}>
                    Thêm khách hàng
                </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        {usersData?.data?.length ? (
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
                                    {usersData?.data.map((user, rowIndex) => (
                                        <CustomerTableRow key={rowIndex} data={user} />
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
