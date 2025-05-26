'use client';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import useCourtsQuery from '@/hooks/api/courts/useCourtsQuery';
import React from 'react';
import CourtTableRow from './CourtTableRow';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import CreateCourtModal from '@/components/modals/CourtModal';
import { useModal } from '@/hooks/useModal';

interface CourtTableProps {
    locationId: number;
}

function CourtTable({ locationId }: CourtTableProps) {
    const { isOpen: isOpenCreate, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
    const { data: courtsData } = useCourtsQuery(locationId);

    const headers = [
        { field: 'id', label: 'ID' },
        { field: 'name', label: 'Tên sân' },
        { field: 'description', label: 'Mô tả' },
        { field: 'price_table', label: 'Bảng giá' },
        { field: 'is_active', label: 'Trạng thái' },
        { field: 'action', label: 'Hành động' },
    ];

    const handleAddCourt = () => {
        openCreateModal();
    }

    return (
        <>
            <CreateCourtModal isOpen={isOpenCreate} onClose={closeCreateModal} locationId={locationId} />
            <div>
                <div className="flex justify-end">
                    <Button size="sm" variant="primary" startIcon={<PlusIcon />} onClick={handleAddCourt}>
                        Thêm sân
                    </Button>
                </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        {courtsData?.length ? (
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
                                    {courtsData?.map((court) => (
                                        <CourtTableRow key={court.id} data={court} locationId={locationId} />
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

export default CourtTable;
