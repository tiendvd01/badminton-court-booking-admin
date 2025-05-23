'use client'
import PriceTable from '@/components/tables/PriceTable/PriceTable';
import Button from '@/components/ui/button/Button';
import { PlusIcon } from '@/icons';
import { useRouter } from 'next/navigation';
import React from 'react';

function PriceManagePage() {
    const router = useRouter();

    const handleAddPriceTable = () => {
        router.push('/price-manage/add');
    };

    return (
        <div className="space-y-6">
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90">Bảng giá</div>
            <div className="flex justify-end">
                <Button size="sm" variant="primary" startIcon={<PlusIcon />} onClick={handleAddPriceTable}>
                    Thêm bảng giá
                </Button>
            </div>
            <PriceTable />
        </div>
    );
}

export default PriceManagePage;
