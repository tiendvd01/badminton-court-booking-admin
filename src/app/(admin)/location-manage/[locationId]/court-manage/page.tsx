'use client'
import PageBackButton from '@/components/common/PageBackButton';
import CourtTable from '@/components/tables/CourtTable/CourtTable';
import useLocationQuery from '@/hooks/api/courts/useLocationQuery';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

function CourtOfLocationPage() {
    const { locationId } = useParams<{ locationId: string }>();
    const router = useRouter();

    const locationQuery = useLocationQuery(parseInt(locationId));

    return <>
        <div className='mb-4'><PageBackButton onClick={() => router.push(`/location-manage/${locationId}`)} /></div>
        <div className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4 flex justify-between">
            <div>Cụm sân: <span className='text-blue-500'>{locationQuery.data?.name}</span> </div>
        </div>
        
        <div className="space-y-6">
            <CourtTable locationId={parseInt(locationId)} />
        </div>
    </>;
}

export default CourtOfLocationPage;
