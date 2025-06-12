import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { IPaymentMethod } from '@/types/payment';
import Image from 'next/image';
import { useModal } from '@/hooks/useModal';
import useDeletePaymentMethodMutation from '@/hooks/api/payments/useDeletePaymentMethodMutation';
import { toast } from 'react-toastify';

import QRCodeModal from '@/components/modals/payment/QRCodeModal';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { EyeIcon, PencilIcon, TrashBinIcon } from '@/icons';
import PaymentMethodModal from '@/components/modals/payment/PaymentMethodModal';

interface PaymentTableRowProps {
    payment: IPaymentMethod;
    showOwner?: boolean;
}

const PaymentTableRow = ({ payment, showOwner = false }: PaymentTableRowProps) => {
    const { isOpen: isQROpen, openModal: openQRModal, closeModal: closeQRModal } = useModal();
    const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
    const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
    const deletePaymentMethodMutation = useDeletePaymentMethodMutation();

    const handleDelete = () => {
        deletePaymentMethodMutation.mutate(payment.id, {
            onSuccess: () => {
                toast.success('Xóa phương thức thanh toán thành công');
                closeDeleteModal();
            },
            onError: (error) => {
                toast.error(`Lỗi: ${error.response?.data?.message || 'Không thể xóa phương thức thanh toán'}`);
            },
        });
    };

    return (
        <>
            <TableRow className="text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <TableCell>{payment.id}</TableCell>

                {showOwner && (
                    <TableCell>
                        <div className="flex items-center gap-2.5">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                                <Image
                                    src={payment.owner?.avatar_url || '/images/user/default_user.jpg'}
                                    alt={payment.owner?.name || 'Owner'}
                                    width={40}
                                    height={40}
                                    className="object-cover h-full w-full"
                                />
                            </div>
                            <span>{payment.owner?.name || 'Unknown'}</span>
                        </div>
                    </TableCell>
                )}

                <TableCell>{payment.account_name}</TableCell>
                <TableCell>{payment.payment_number}</TableCell>
                <TableCell>{payment.bank_info.name}</TableCell>

                <TableCell>
                    <div className="cursor-pointer p-3 w-[128px] h-[128px] overflow-hidden" onClick={openQRModal}>
                        <Image
                            src={`https://img.vietqr.io/image/${payment.bank_info.bin}-${payment.payment_number}-qr_only.png`}
                            alt="QR Code"
                            width={128}
                            height={128}
                            className="object-cover h-full w-full"
                        />
                    </div>
                </TableCell>

                <TableCell>
                    <span
                        className={`px-2 py-1 rounded-full text-xs ${
                            payment.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {payment.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                </TableCell>

                <TableCell>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openQRModal}
                            className="flex justify-center items-center"
                        >
                            <EyeIcon width={18} height={18} />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openEditModal}
                            className="flex justify-center items-center"
                        >
                            <PencilIcon width={18} height={18} />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={openDeleteModal}
                            className="flex justify-center items-center"
                        >
                            <TrashBinIcon width={18} height={18} />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            {/* QR Code Modal */}
            <QRCodeModal isOpen={isQROpen} onClose={closeQRModal} payment={payment} />

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} className="max-w-[500px]">
                <div className="p-5 text-center">
                    <h4 className="mb-5 text-xl font-medium text-gray-800 dark:text-white/90">Xác nhận xóa</h4>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">Bạn có chắc chắn muốn xóa thẻ ?</p>
                    <div className="flex justify-center gap-4">
                        <Button onClick={closeDeleteModal} variant="outline">
                            Hủy
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-500 text-white"
                            loading={deletePaymentMethodMutation.isPending}
                        >
                            Xóa
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <PaymentMethodModal
                isOpen={isEditOpen}
                onClose={closeEditModal}
                ownerId={payment.owner_id}
                paymentId={payment.id.toString()}
            />
        </>
    );
};

export default PaymentTableRow;
