import React from 'react';
import { Modal } from '../ui/modal';
import PriceTableForm from '../price-manage/PriceTableForm';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};
function CreatePriceTableModal({ isOpen, onClose }: Props) {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[650px] p-5 lg:p-10 max-h-[98vh] overflow-y-auto">
                <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                    Thông tin bảng giá
                </h4>
                <PriceTableForm onSaveSuccess={onClose} />
            </Modal>
        </>
    );
}

export default CreatePriceTableModal;
