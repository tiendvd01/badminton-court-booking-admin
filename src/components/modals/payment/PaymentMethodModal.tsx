import React from 'react';
import { Modal } from '@/components/ui/modal';
import PaymentFormCard from '@/components/payment-manage/PaymentFormCard';

interface CreatePaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    ownerId?: string;
    paymentId?: string;
}

const PaymentMethodModal = ({ isOpen, onClose, ownerId, paymentId }: CreatePaymentMethodModalProps) => {
    const isEditMode = !!paymentId;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-6">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                {isEditMode ? 'Chỉnh sửa phương thức thanh toán' : 'Thêm phương thức thanh toán'}
            </h4>
            <PaymentFormCard onSaveSuccess={onClose} ownerId={ownerId} paymentId={paymentId} />
        </Modal>
    );
};

export default PaymentMethodModal;
