import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import LocationTableRow from "./LocationTableRow";
import useLocationsQuery from "@/hooks/api/courts/useLocationsQuery";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function LocationTable() {
  const { data: locationsData, isLoading } = useLocationsQuery();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const isAdmin = user?.role === 'admin';

  const headers = [
    { field: "id", label: "ID" },
    { field: "name", label: "Tên địa điểm" },
    { field: "address", label: "Địa chỉ" },
    { field: "owner", label: "Chủ sân" },
    { field: "courts", label: "Số sân" },
    { field: "action", label: "Hành động" },
  ];

  const handleClickAddCourt = () => {
    router.replace('/location-manage/add');
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleClickAddCourt}
          variant="primary"
          startIcon={<PlusIcon />}
        >
          Thêm địa điểm sân
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : locationsData?.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                      Không có địa điểm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  locationsData?.map((location) => (
                    <LocationTableRow 
                      key={location.id} 
                      data={location} 
                      isAdmin={isAdmin}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}