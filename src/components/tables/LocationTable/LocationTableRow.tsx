import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/ui/modal';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import useDeleteLocationMutation from '@/hooks/api/courts/useDeleteLocationMutation';
import { ILocation } from '@/types/location';

type Props = {
    data: ILocation;
    isAdmin: boolean;
};

function LocationTableRow({ data, isAdmin }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
    const { isOpen: isOpenDel, openModal: openModalDel, closeModal: closeModalDel } = useModal();

    const deleteLocationMutation = useDeleteLocationMutation();

    const handleClickDelete = () => {
        openModalDel();
    };

    const handleConfirmDelete = () => {
        deleteLocationMutation.mutate(data.id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['locations'] });
                toast.success('Xóa địa điểm thành công');
                closeModalDel();
            },
            onError: (error) => {
                toast.error('Xóa địa điểm thất bại: ' + error.message);
            },
        });
    };

    const handleViewCourts = () => {
        router.push(`/location-manage/${data.id}`);
    };

    return (
        <>
            <TableRow>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-3">
                        <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {data.name}
                            </span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.address}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.owner?.name || 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.courts?.length || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                        <Button size="sm" variant="primary" onClick={openModalEdit}>
                            Sửa
                        </Button>
                        <Button size="sm" className="bg-red-500 text-white" onClick={handleClickDelete}>
                            Xóa
                        </Button>
                        <Button size="sm" className="bg-blue-500 text-white" onClick={handleViewCourts}>
                            Quản lý sân
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <Modal isOpen={isOpenDel} onClose={closeModalDel} className="max-w-[500px]">
                <div className="p-5 text-center">
                    <h4 className="mb-5 text-xl font-medium text-gray-800 dark:text-white/90">Xác nhận xóa</h4>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa địa điểm này không?
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={closeModalDel} className="min-w-[120px]">
                            Hủy
                        </Button>
                        <Button className="min-w-[120px] bg-red-500 text-white" onClick={handleConfirmDelete}>
                            Xóa
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default LocationTableRow;
