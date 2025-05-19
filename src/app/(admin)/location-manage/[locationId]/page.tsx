'use client';
import LocationFormCard from '@/components/location-manage/LocationFormCard';
import React from 'react';

function LocationEditPage() {
  return (
    <>
      <div className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Tạo địa điểm sân</div>
      <LocationFormCard />
    </>
  );
}

export default LocationEditPage;
