import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import useUsersQuery from "@/hooks/api/auth/useUsersQuery";
import AdminTableRow from "./AdminTableRow";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import CreateAdminModal from "@/components/modals/CreateAdminModal";
import { useModal } from "@/hooks/useModal";
import { useAuthStore } from "@/stores/authStore";

export default function AdminTable() {
  const { data: usersData } = useUsersQuery({ role: "admin" });
  const { isOpen, openModal, closeModal } = useModal();
  const { user: currentUser } = useAuthStore();

  const headers = [
    { field: "id", label: "ID" },
    { field: "name", label: "Tên admin" },
    { field: "phone", label: "Số điện thoại" },
    { field: "email", label: "Email" },
    { field: "address", label: "Địa chỉ" },
  ];

  const sortedUsers = usersData?.data?.sort((a, b) => {
    if (a.id === currentUser?.id) return -1;
    if (b.id === currentUser?.id) return 1;
    return 0;
  });

  return (
    <>
      <CreateAdminModal isOpen={isOpen} onClose={closeModal} />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={openModal}
          variant="primary"
          startIcon={<PlusIcon />}
        >
          Thêm admin
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
              <TableBody>
                {sortedUsers?.map((user) => (
                  <AdminTableRow 
                    key={user.id} 
                    data={user}
                    isYou={user.id === currentUser?.id}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}