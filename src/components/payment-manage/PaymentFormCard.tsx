import React, { useEffect, useRef } from 'react';
import BankSelect from '../form/BankSelect';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import SelectUser from '../form/SelectUser';
import Button from '../ui/button/Button';
import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';
import useCreatePaymentMethodMutation from '@/hooks/api/payments/useCreatePaymentMethodMutation';
import useUploadImageMutation from '@/hooks/api/upload/useUploadImageMutation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useUpdatePaymentMethodMutation from '@/hooks/api/payments/useUpdatePaymentMethodMutation';
import usePaymentMethodQuery from '@/hooks/api/payments/usePaymentMethodQuery';
import Switch from '../form/switch/Switch';

interface FormValues {
    account_name: string;
    payment_number: string;
    bank_code: string;
    bank_info: object;
    owner_id?: string;
    is_active: boolean;
}

type Props = {
    ownerId?: string;
    onSaveSuccess: () => void;
    paymentId?: string;
};

function PaymentFormCard({ ownerId, onSaveSuccess, paymentId }: Props) {
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'admin';
    const isEditMode = !!paymentId;
    const createPaymentMethodMutation = useCreatePaymentMethodMutation();
    const updatePaymentMethodMutation = useUpdatePaymentMethodMutation();
    const paymentMethodQuery = usePaymentMethodQuery(paymentId ? +paymentId : undefined);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            account_name: '',
            payment_number: '',
            bank_code: '',
            bank_info: undefined,
            owner_id: ownerId,
            is_active: true,
        },
    });

    const watchOwnerId = watch('owner_id');
    const isActive = watch('is_active');

    const onSubmit = async (data: FormValues) => {
        try {
            let ownerId: string | undefined = data.owner_id;
            if (user?.role === 'owner') {
                ownerId = user?.id?.toString();
            }

            if (isEditMode) {
                await updatePaymentMethodMutation.mutateAsync({
                    id: +paymentId,
                    data: {
                        ...data,
                    },
                });
                toast.success('Cập nhật phương thức thanh toán thành công');
            } else {
                await createPaymentMethodMutation.mutateAsync({
                    ...data,
                    owner_id: ownerId ?? '',
                });
                toast.success('Thêm phương thức thanh toán thành công');
            }
            reset();
            onSaveSuccess();
        } catch (error: any) {
            toast.error(`Lỗi: ${error.response?.data?.message || 'Không thể thực hiện thao tác'}`);
        }
    };



    useEffect(() => {
        if (paymentMethodQuery.data) {
            const paymentMethod = paymentMethodQuery.data;
            reset({
                account_name: paymentMethod.account_name,
                payment_number: paymentMethod.payment_number,
                bank_code: paymentMethod.bank_code,
                bank_info: paymentMethod.bank_info,
                owner_id: paymentMethod.owner_id,
                is_active: paymentMethod.is_active,
            });
        }
    }, [paymentMethodQuery.data, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isAdmin && !ownerId && (
                <div className="space-y-2">
                    <Label htmlFor="owner_id">Chủ sân</Label>
                    <SelectUser
                        role="owner"
                        value={watchOwnerId}
                        onChange={(value) => setValue('owner_id', value, { shouldValidate: true })}
                    />
                    {errors.owner_id && <p className="text-sm text-red-500">{errors.owner_id.message}</p>}
                </div>
            )}

            <div>
                <Label htmlFor="bank_code">Ngân hàng</Label>
                <BankSelect
                    {...register('bank_code', { required: 'Vui lòng chọn ngân hàng' })}
                    value={watch('bank_code')}
                    onChange={(value, bank) => {
                        setValue('bank_info', bank ?? {}, { shouldValidate: true });
                        setValue('bank_code', bank?.code || '', { shouldValidate: true });
                    }}
                    error={!!errors.bank_code}
                    hint={errors.bank_code?.message}
                    placeholder="Chọn ngân hàng"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="account_name">Tên tài khoản</Label>
                <Input
                    id="account_name"
                    {...register('account_name', { required: 'Vui lòng nhập tên tài khoản' })}
                    placeholder="VD: NGUYEN VAN A"
                />
                {errors.account_name && <p className="text-sm text-red-500">{errors.account_name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="payment_number">Số tài khoản</Label>
                <Input
                    id="payment_number"
                    {...register('payment_number', { required: 'Vui lòng nhập số tài khoản' })}
                    placeholder="VD: 1234567890"
                />
                {errors.payment_number && <p className="text-sm text-red-500">{errors.payment_number.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Switch
                    label={isActive ? 'Hoạt động' : 'Không hoạt động'}
                    defaultChecked={isActive}
                    onChange={(checked) => setValue('is_active', checked)}
                />
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <Button
                    type="submit"
                    disabled={createPaymentMethodMutation.isPending}
                    loading={createPaymentMethodMutation.isPending}
                >
                    {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            </div>
        </form>
    );
}

export default PaymentFormCard;
