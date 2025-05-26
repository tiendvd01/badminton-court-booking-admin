'use client';
import PageBackButton from '@/components/common/PageBackButton';
import LocationFormCard from '@/components/location-manage/LocationFormCard';
import { useParams } from 'next/navigation';
import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import { InfoIcon } from '@/icons';

function LocationEditPage() {
    const { locationId } = useParams<{ locationId: string }>();
    const router = useRouter();

    const handleClickBackBtn = () => {
        router.push('/location-manage');
    };

    const handleSaveSuccess = (id: string) => {
        router.push(`/location-manage/${id}`);
    };
    return (
        <>
            <div className="mb-4">
                <PageBackButton onClick={handleClickBackBtn} />
            </div>
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4 flex justify-between">
                <div>Tạo cụm sân</div>
                {locationId != 'add' && (
                    <Button
                        className="bg-gray-400 text-white hover:bg-gray-700"
                        size="sm"
                        variant="primary"
                        startIcon={<InfoIcon />}
                        onClick={() => router.push(`/location-manage/${locationId}/court-manage`)}
                    >
                        Quản lý sân
                    </Button>
                )}
            </div>
            <LocationFormCard
                onSaveSuccess={handleSaveSuccess}
                locationId={locationId == 'add' ? undefined : parseInt(locationId)}
            />
        </>
    );
}

export default LocationEditPage;
