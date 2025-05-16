"use client";
import OwnerTable from "@/components/tables/OwnerTable/OwnerTable";
import React from "react";

function OwnerManagePage() {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-gray-800 dark:text-white/90">Chủ sân</div>
      <OwnerTable />
    </div>
  );
}

export default OwnerManagePage;
