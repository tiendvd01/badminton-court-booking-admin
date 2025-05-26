import React, { useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/button/Button';
import { PlusIcon, TrashBinIcon } from '@/icons';
import useCreatePriceTableMutation from '@/hooks/api/prices/useCreatePriceTableMutation';
import Label from '../form/Label';
import TextArea from '../form/input/TextArea';
import Input from '../form/input/InputField';
import SelectUser from '../form/SelectUser';
import { toast } from 'react-toastify';
import usePriceTableQuery from '@/hooks/api/prices/usePriceTableQuery';
import useUpdatePriceTableMutation from '@/hooks/api/prices/useUpdatePriceTableMutation';

type FormValues = {
    name: string;
    description: string;
    owner_id: number;
    prices: {
        start_time: string;
        end_time: string;
        price: number;
    }[];
};

type Props = {
    onSaveSuccess?: (priceTableId) => void;
    priceTableId?: string;
};

function PriceTableForm({ onSaveSuccess, priceTableId }: Props) {
    const { user } = useAuthStore();
    const createPriceTableMutation = useCreatePriceTableMutation();
    const updatePriceTableMutation = useUpdatePriceTableMutation();

    const methods = useForm<FormValues>({
        defaultValues: {
            name: '',
            description: '',
            owner_id: undefined,
            prices: [
                {
                    start_time: '06:00',
                    end_time: '08:00',
                    price: 0,
                },
            ],
        },
    });

    const { getValues, setError, setValue } = methods;

    const priceTableQuery = usePriceTableQuery(priceTableId ? +priceTableId : undefined);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: 'prices',
    });

    useEffect(() => {
        if (priceTableQuery.data?.data) {
            const priceTable = priceTableQuery.data.data;
            reset({
                name: priceTable.name,
                description: priceTable.description,
                owner_id: priceTable.owner_id,
                prices: priceTable.prices.map((price) => ({
                    start_time: price.start_time,
                    end_time: price.end_time,
                    price: price.price,
                })),
            });
        }
    }, [priceTableQuery.data, reset]);

    const checkTimeOverlap = (prices: FormValues['prices']): boolean => {
        for (let i = 0; i < prices.length; i++) {
            const current = prices[i];
            const currentStart =
                parseInt(current.start_time.split(':')[0]) * 60 + parseInt(current.start_time.split(':')[1]);
            const currentEnd = parseInt(current.end_time.split(':')[0]) * 60 + parseInt(current.end_time.split(':')[1]);

            for (let j = i + 1; j < prices.length; j++) {
                const other = prices[j];
                const otherStart =
                    parseInt(other.start_time.split(':')[0]) * 60 + parseInt(other.start_time.split(':')[1]);
                const otherEnd = parseInt(other.end_time.split(':')[0]) * 60 + parseInt(other.end_time.split(':')[1]);

                if (
                    (currentStart >= otherStart && currentStart < otherEnd) ||
                    (currentEnd > otherStart && currentEnd <= otherEnd) ||
                    (currentStart <= otherStart && currentEnd >= otherEnd)
                ) {
                    setError(`prices.${i}.start_time`, {
                        type: 'manual',
                        message: 'Khung giờ này bị trùng với khung giờ khác',
                    });
                    setError(`prices.${j}.start_time`, {
                        type: 'manual',
                        message: 'Khung giờ này bị trùng với khung giờ khác',
                    });
                    return true;
                }
            }
        }
        return false;
    };

    const onSubmit = async (data: FormValues) => {
        try {
            // Check for time overlaps before submitting
            if (checkTimeOverlap(data.prices)) {
                return;
            }

            let ownerId: number | undefined = data.owner_id;
            if (user?.role === 'owner') {
                ownerId = user.id;
            }

            if (priceTableId) {
                await updatePriceTableMutation.mutateAsync({
                    id: +priceTableId,
                    data: {
                        name: data.name,
                        description: data.description,
                        owner_id: ownerId,
                        prices: data.prices,
                    },
                });
            } else {
                // Create price table first
                const createdPriceTable = await createPriceTableMutation.mutateAsync({
                    name: data.name,
                    description: data.description,
                    owner_id: ownerId ?? NaN,
                    prices: data.prices
                });
                onSaveSuccess?.(createdPriceTable.data.id.toString());
            }
            // Reset form after successful submission
            reset();

            if(priceTableId) {
                toast.success('Cập nhật bảng giá thành công');
            } else {
                toast.success('Tạo bảng giá thành công');
            }
        } catch (error) {
            toast.error('Tạo bảng giá thất bại: ' + error);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="name">Tên bảng giá</Label>
                        <Input
                            id="name"
                            error={!!errors.name}
                            hint={errors.name?.message}
                            placeholder="Nhập tên bảng giá"
                            {...register('name', {
                                required: 'Tên bảng giá không được để trống',
                            })}
                        />
                    </div>

                    {user?.role == 'admin' && (
                        <div>
                            <Label>Chủ sân</Label>
                            <SelectUser
                                role="owner"
                                {...register('owner_id', {
                                    required: 'Chủ sân không được để trống',
                                })}
                                onChange={(value) => {
                                    setValue('owner_id', parseInt(value), { shouldValidate: true });
                                }}
                                placeholder="Chọn chủ sân"
                                defaultValue={priceTableQuery.data?.data?.owner_id?.toString()}
                                error={!!errors.owner_id}
                                hint={errors.owner_id?.message}
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="description">Mô tả</Label>
                        <TextArea
                            id="description"
                            placeholder="Nhập mô tả bảng giá"
                            {...register('description')}
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="prices">Các khoảng giá</Label>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="dark:border-gray-700 dark:bg-gray-800 dark:text-white border">
                                        <th className="p-4 text-left">Giờ bắt đầu</th>
                                        <th className="p-4 text-left">Giờ kết thúc</th>
                                        <th className="p-4 text-left">Giá (VNĐ)</th>
                                        <th className="p-4 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((field, index) => (
                                        <tr
                                            key={field.id}
                                            className={`border-t border-l border-r dark:border-gray-700 ${
                                                index === fields.length - 1 ? 'border-b' : ''
                                            }`}
                                        >
                                            <td className="p-4">
                                                <Input
                                                    id={`prices.${index}.start_time`}
                                                    type="time"
                                                    error={!!errors.prices?.[index]?.start_time}
                                                    hint={errors.prices?.[index]?.start_time?.message}
                                                    {...register(`prices.${index}.start_time`, {
                                                        required: 'Giờ bắt đầu không được để trống',
                                                    })}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <Input
                                                    id={`prices.${index}.end_time`}
                                                    type="time"
                                                    error={!!errors.prices?.[index]?.end_time}
                                                    hint={errors.prices?.[index]?.end_time?.message}
                                                    {...register(`prices.${index}.end_time`, {
                                                        required: 'Giờ kết thúc không được để trống',
                                                    })}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <Input
                                                    id={`prices.${index}.price`}
                                                    type="number"
                                                    {...register(`prices.${index}.price`, {
                                                        required: 'Giá không được để trống',
                                                        valueAsNumber: true,
                                                    })}
                                                />
                                            </td>
                                            <td className="p-4">
                                                {fields.length > 1 && (
                                                    <button
                                                        onClick={() => remove(index)}
                                                        className="bg-gray-500 text-white rounded-full p-1.5 hover:bg-gray-800"
                                                    >
                                                        <TrashBinIcon />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Button
                            startIcon={<PlusIcon />}
                            onClick={() => {
                                const prevEndTime =
                                    getValues('prices')[getValues('prices').length - 1]?.end_time ?? '06:00';
                                const [hours, minutes] = prevEndTime.split(':');
                                const newEndHours = parseInt(hours) + 2;
                                const newEndTime = `${String(newEndHours).padStart(2, '0')}:${minutes}`;

                                append({
                                    start_time: prevEndTime,
                                    end_time: newEndTime,
                                    price: 0,
                                });
                            }}
                            type="button"
                            className="mt-2"
                            size="sm"
                        >
                            Thêm khung giờ
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={createPriceTableMutation.isPending}
                        loading={createPriceTableMutation.isPending}
                    >
                        Lưu bảng giá
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default PriceTableForm;
