import EditUserModal from "@/components/modals/EditUserModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { TableCell, TableRow } from "@/components/ui/table";
import { useModal } from "@/hooks/useModal";
import useDeleteUserMutation from "@/hooks/api/users/useDeleteUserMutation";
import { IUser } from "@/stores/authStore";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { UsersQueryKey } from "@/hooks/api/auth/useUsersQuery";

type Props = {
  data: IUser;
};

function CustomerTableRow({ data }: Props) {
  const queryClient = useQueryClient();
  const {
    isOpen: isOpenEdit,
    openModal: openModalEdit,
    closeModal: closeModalEdit,
  } = useModal();
  const {
    isOpen: isOpenDel,
    openModal: openModalDel,
    closeModal: closeModalDel,
  } = useModal();

  const deleteUserMutation = useDeleteUserMutation();

  const mappedUserData = {
    id: data.id,
    name: data.name || "None",
    phone: data.phone || "None",
    email: data.email,
    address: data.address || "None",
    avatar_url: data.avatar_url || "/images/user/default_user.jpg",
  };

  const handleClickDelete = () => {
    openModalDel();
  };

  const handleConfirmDelete = () => {
    if (data.id) {
      deleteUserMutation.mutate(data.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: UsersQueryKey("customer") });
          toast.success("Xóa người dùng thành công");
          closeModalDel();
        },
        onError: (error) => {
          toast.error("Xóa người dùng thất bại: " + error.message);
        },
      });
    }
  };

  return (
    <>
      <EditUserModal isOpen={isOpenEdit} onClose={closeModalEdit} user={data} />
      <TableRow>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {mappedUserData.id}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <Image
                width={40}
                height={40}
                src={mappedUserData.avatar_url}
                alt={mappedUserData.name}
              />
            </div>
            <div>
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {mappedUserData.name}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {mappedUserData.phone}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {mappedUserData.email}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {mappedUserData.address}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={openModalEdit}>
              Sửa
            </Button>
            <Button
              size="sm"
              className="bg-red-500 text-white"
              onClick={handleClickDelete}
            >
              Xóa
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <Modal
        isOpen={isOpenDel}
        onClose={closeModalDel}
        className="max-w-[500px]"
      >
        <div className="p-5 text-center">
          <h4 className="mb-5 text-xl font-medium text-gray-800 dark:text-white/90">
            Xác nhận xóa
          </h4>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa người dùng này không?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={closeModalDel}
              className="min-w-[120px]"
            >
              Hủy
            </Button>
            <Button
              className="min-w-[120px] bg-red-500 text-white"
              onClick={handleConfirmDelete}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CustomerTableRow;