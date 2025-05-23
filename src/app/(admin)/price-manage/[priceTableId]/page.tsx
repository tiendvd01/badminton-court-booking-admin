'use client';
import PageBackButton from '@/components/common/PageBackButton';
import PriceTableForm from '@/components/price-manage/PriceTableForm';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

function PriceTableEditPage() {
    const { priceTableId } = useParams<{ priceTableId: string }>();
    const router = useRouter();

    const handleSaveSuccess = (priceTableId: string) => {
        router.replace(`/price-manage/${priceTableId}`);
    };

    return (
        <>
            <div className="flex justify-start mb-2">
                <PageBackButton onClick={() => router.push("/price-manage")}/>
            </div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                {priceTableId == 'add' ? 'Tạo bảng giá' : 'Chỉnh sửa bảng giá'}
            </div>
            <PriceTableForm
                priceTableId={priceTableId == 'add' ? undefined : priceTableId}
                onSaveSuccess={handleSaveSuccess}
            />
        </>
    );
}

export default PriceTableEditPage;
