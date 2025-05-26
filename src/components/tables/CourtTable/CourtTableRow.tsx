import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import { useModal } from '@/hooks/useModal';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useDeleteCourtMutation from '@/hooks/api/courts/useDeleteCourtMutation';
import { ICourt } from '@/types/court';
import { Modal } from '@/components/ui/modal';
import CourtModal from '@/components/modals/CourtModal';

interface CourtTableRowProps {
    data: ICourt;
    locationId: number;
}

function CourtTableRow({ data, locationId }: CourtTableRowProps) {
    const queryClient = useQueryClient();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
    const { isOpen: isOpenDel, openModal: openModalDel, closeModal: closeModalDel } = useModal();

    const deleteCourtMutation = useDeleteCourtMutation();

    const handleClickDelete = () => {
        openModalDel();
    };

    const handleConfirmDelete = () => {
        deleteCourtMutation.mutate(
            data.id,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['courts', locationId] });
                    toast.success('Xóa sân thành công');
                    closeModalDel();
                },
                onError: (error) => {
                    toast.error('Xóa sân thất bại: ' + error.message);
                },
            },
        );
    };

    const handleEditCourt = () => {
        openModalEdit();
    };

    return (
        <>
            <TableRow>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.description || '-'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {data.priceTable?.name || '-'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span
                        className={`px-2 py-1 rounded-full text-xs ${
                            data.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {data.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                        <Button size="sm" variant="primary" onClick={handleEditCourt}>
                            Sửa
                        </Button>
                        <Button size="sm" className="bg-red-500 text-white" onClick={handleClickDelete}>
                            Xóa
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <Modal isOpen={isOpenDel} onClose={closeModalDel} className="max-w-[500px]">
                <div className="p-5 text-center">
                    <h4 className="mb-5 text-xl font-medium text-gray-800 dark:text-white/90">Xác nhận xóa</h4>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn sân này không?
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
            <CourtModal isOpen={isOpenEdit} onClose={closeModalEdit} locationId={locationId} courtId={data.id} />
        </>
    );
}

export default CourtTableRow;
