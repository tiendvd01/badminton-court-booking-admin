
import React from 'react';
import { Modal } from '../ui/modal';
import CourtFormCard from '../location-manage/CourtFormCard';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    locationId?: number;
    courtId?: number;
};

function CourtModal({ isOpen, onClose, locationId, courtId }: Props) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[650px] p-5 lg:p-10 max-h-[98vh]">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                Thông tin sân
            </h4>
            <CourtFormCard onSaveSuccess={onClose} locationId={locationId} courtId={courtId}/>
        </Modal>
    );
}

export default CourtModal;

