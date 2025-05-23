'use client';
import LocationTable from '@/components/tables/LocationTable/LocationTable';
import React from 'react';

function LocationManagePage() {
    return (
        <div className="space-y-6">
            <div className="text-xl font-semibold text-gray-800 dark:text-white/90">Địa điểm sân</div>
            <LocationTable />
        </div>
    );
}

export default LocationManagePage;
