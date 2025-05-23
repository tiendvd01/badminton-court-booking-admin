'use client';
import LocationFormCard from '@/components/location-manage/LocationFormCard';
import { useParams } from 'next/navigation';
import React from 'react';

function LocationEditPage() {
  const { locationId } = useParams<{ locationId: string }>();
  return (
    <>
      <div className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Tạo địa điểm sân</div>
      <LocationFormCard />
    </>
  );
}

export default LocationEditPage;
