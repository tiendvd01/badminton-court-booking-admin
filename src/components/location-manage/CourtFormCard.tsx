import React, { useEffect } from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import SelectPriceTable from '../form/SelectPriceTable';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '../ui/button/Button';
import useCreateCourtMutation from '@/hooks/api/courts/useCreateCourtMutation';
import useUpdateCourtMutation from '@/hooks/api/courts/useUpdateCourtMutation';
import useCourtQuery from '@/hooks/api/courts/useCourtQuery';
import { toast } from 'react-toastify';
import TextArea from '../form/input/TextArea';
import Switch from '../form/switch/Switch';

type FormValues = {
    name: string;
    price_table_id: string;
    description?: string;
    is_active: boolean;
};

type Props = {
    onSaveSuccess?: (courtId: string) => void;
    locationId?: number;
    courtId?: number;
};

function CourtFormCard({ onSaveSuccess, locationId, courtId }: Props) {
    const isEditMode = !!courtId;
    const createCourtMutation = useCreateCourtMutation();
    const updateCourtMutation = useUpdateCourtMutation();
    const { data: courtData, isLoading: isLoadingCourt } = useCourtQuery(courtId);

    const methods = useForm<FormValues>({
        defaultValues: {
            name: '',
            price_table_id: '',
            description: '',
            is_active: true,
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = methods;

    const isActive = watch('is_active');

    useEffect(() => {
        if (isEditMode && courtData) {
            reset({
                name: courtData.name,
                price_table_id: courtData.price_table_id?.toString() || '',
                description: courtData.description || '',
                is_active: courtData.is_active,
            });
        }
    }, [isEditMode, courtData, reset]);

    const onSubmit = async (data: FormValues) => {
        if (!locationId && !isEditMode) {
            toast.error('Location ID is required');
            return;
        }

        try {
            if (isEditMode) {
                // Update existing court
                await updateCourtMutation.mutateAsync({
                    id: courtId,
                    data: {
                        name: data.name,
                    description: data.description,
                    price_table_id: parseInt(data.price_table_id),
                    is_active: data.is_active,
                    }
                });
                toast.success('Court updated successfully');
                onSaveSuccess?.(courtId.toString());
            } else {
                // Create new court
                const response = await createCourtMutation.mutateAsync({
                    name: data.name,
                    location_id: locationId!,
                    description: data.description,
                    price_table_id: parseInt(data.price_table_id),
                    is_active: data.is_active,
                });
                toast.success('Court created successfully');
                onSaveSuccess?.(response.data.id.toString());
            }
        } catch (error) {
            toast.error(isEditMode ? 'Failed to update court' : 'Failed to create court');
            console.error(isEditMode ? 'Error updating court:' : 'Error creating court:', error);
        }
    };

    if (isEditMode && isLoadingCourt) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="name">Tên sân</Label>
                        <Input
                            id="name"
                            error={!!errors.name}
                            hint={errors.name?.message}
                            placeholder="Nhập tên sân"
                            {...register('name', {
                                required: 'Tên sân không được để trống',
                            })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Mô tả</Label>
                        <TextArea
                            id="description"
                            error={!!errors.description}
                            hint={errors.description?.message}
                            placeholder="Nhập mô tả sân"
                            {...register('description')}
                        />
                    </div>
                    <div>
                        <Label htmlFor="price_table_id">Bảng giá</Label>
                        <SelectPriceTable
                            {...register('price_table_id', {
                                required: 'Bảng giá không được để trống',
                            })}
                            onChange={(value) => {
                                setValue('price_table_id', value, {
                                    shouldValidate: true,
                                });
                            }}
                            defaultValue={courtData?.price_table_id?.toString()}
                            error={!!errors.price_table_id}
                            hint={errors.price_table_id?.message}
                        />
                    </div>
                    <div className='mt-4'>
                        <Label htmlFor="is_active">Trạng thái</Label>
                        <div className="flex items-center gap-2 mt-2">
                            <Switch 
                                label={isActive ? 'Hoạt động' : 'Không hoạt động'} 
                                defaultChecked={isActive} 
                                onChange={(checked) => setValue('is_active', checked)} 
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={createCourtMutation.isPending || updateCourtMutation.isPending}
                        loading={createCourtMutation.isPending || updateCourtMutation.isPending}
                    >
                        {isEditMode ? 'Cập nhật sân' : 'Tạo sân'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default CourtFormCard;
