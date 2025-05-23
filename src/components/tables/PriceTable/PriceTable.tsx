'use client';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import usePriceTablesQuery from '@/hooks/api/prices/usePriceTablesQuery';
import { useAuthStore } from '@/stores/authStore';
import React from 'react';
import PriceTableRow from './PriceTableRow';
import EmptyState from '@/components/common/EmptyState';

function PriceTable() {
    const { user } = useAuthStore();
    const isOwner = user?.role === 'owner';
    const { data: priceTablesData } = usePriceTablesQuery(isOwner ? user?.id : undefined);

    const headers = [
        { field: 'id', label: 'ID' },
        { field: 'name', label: 'Tên bảng giá' },
        { field: 'description', label: 'Mô tả bảng giá' },
        { field: 'owner', label: 'Chủ sân' },
        { field: 'action', label: 'Hành động' },
    ];

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        {priceTablesData?.data?.length ? (
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
                                    {priceTablesData?.data.map((priceTable, rowIndex) => (
                                        <PriceTableRow key={rowIndex} data={priceTable} />
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

export default PriceTable;
