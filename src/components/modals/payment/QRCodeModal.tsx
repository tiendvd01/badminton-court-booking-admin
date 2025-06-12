import React from 'react';
import { IPaymentMethod } from '@/types/payment';
import Image from 'next/image';
import { Modal } from '@/components/ui/modal';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: IPaymentMethod;
}

const QRCodeModal = ({ isOpen, onClose, payment }: QRCodeModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-4">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Mã QR thanh toán</h4>

            <div className="flex flex-col items-center py-4">
                <div className="w-64 h-64 relative mb-4">
                    <Image
                        src={`https://img.vietqr.io/image/${payment.bank_info.bin}-${payment.payment_number}-qr_only.png`}
                        alt={`QR code for ${payment.account_name}`}
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="text-center text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex gap-3 items-center">
                        <div className='bg-white rounded-full p-2'>
                          <Image
                            src={payment.bank_info.logo}
                            alt={payment.bank_info.name}
                            width={48}
                            height={48}
                          />
                        </div>
                        <p className="font-medium ">{payment.bank_info.name}</p>
                    </div>
                    <p className="uppercase text-lg">{payment.account_name}</p>
                    <p className="font-medium text-lg">{payment.payment_number}</p>
                </div>
            </div>
        </Modal>
    );
};

export default QRCodeModal;
