"use client";
import CustomerTable from "@/components/tables/CustomerTable/CustomerTable";
import React from "react";

function CustomerManagePage() {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-gray-800 dark:text-white/90">Khách hàng</div>
      <CustomerTable />
    </div>
  );
}

export default CustomerManagePage;
