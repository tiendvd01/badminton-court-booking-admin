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
  isYou?: boolean;
};

function AdminTableRow({ data, isYou = false }: Props) {
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
          queryClient.invalidateQueries({ queryKey: UsersQueryKey("admin") });
          toast.success("Xóa admin thành công");
          closeModalDel();
        },
        onError: (error) => {
          toast.error("Xóa admin thất bại: " + error.message);
        },
      });
    }
  };

  return (
    <>
      <EditUserModal isOpen={isOpenEdit} onClose={closeModalEdit} user={data} />
      <TableRow className={isYou ? "opacity-50" : ""}>
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
                {`${mappedUserData.name} ${isYou ? '(Bạn)' : ''}`}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {mappedUserData.email}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {mappedUserData.phone}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {mappedUserData.address}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {!isYou ? (
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
          ) : null}
        </TableCell>
      </TableRow>
      <Modal
        isOpen={isOpenDel}
        onClose={closeModalDel}
        className="max-w-[500px]"
      >
        <div className="min-h-[200px] p-6 lg:p-10 text-white flex flex-col justify-between">
          <h4 className="mr-2">Bạn có chắc chắn muốn xóa admin này?</h4>
          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModalDel}>
              Hủy
            </Button>
            <Button
              className="bg-red-500 text-white"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AdminTableRow;
