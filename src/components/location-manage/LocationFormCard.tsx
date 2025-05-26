import React, { useEffect, useRef } from 'react';
import ComponentCard from '../common/ComponentCard';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import useCreateLocationMutation from '@/hooks/api/courts/useCreateLocationMutation';
import useUpdateLocationMutation from '@/hooks/api/courts/useUpdateLocationMutation';
import { toast } from 'react-toastify';
import TextArea from '../form/input/TextArea';
import { CirclePlusIcon, TrashBinIcon } from '@/icons';
import Image from 'next/image';
import styles from './index.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import useUploadImageMutation from '@/hooks/api/upload/useUploadImageMutation';
import { useAuthStore } from '@/stores/authStore';
import SelectUser from '../form/SelectUser';
import Button from '../ui/button/Button';
import useLocationQuery from '@/hooks/api/courts/useLocationQuery';
import useAddLocationImagesMutation from '@/hooks/api/courts/useAddLocationImageMutation';
import useLocationImagesQuery from '@/hooks/api/courts/useLocationImagesQuery';

type FormValues = {
    name: string;
    address: string;
    description: string;
    owner_id: string;
    images: string[];
};

type Props = {
    onSaveSuccess?: (locationId: string) => void;
    locationId?: number;
};

function LocationFormCard({ onSaveSuccess, locationId }: Props) {
    const uploadImageRef = useRef<HTMLInputElement>(null);
    const { user } = useAuthStore();
    const locationQuery = useLocationQuery(locationId);
    const locationImagesQuery = useLocationImagesQuery(locationId);
    const isEditMode = !!locationId;

    const methods = useForm<FormValues>({
        defaultValues: {
            name: '',
            address: '',
            description: '',
            owner_id: '',
            images: [],
        },
    });

    const { setValue, getValues } = methods;

    const uploadFrames = getValues('images');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = methods;

    const uploadImageMutation = useUploadImageMutation();
    const createLocationMutation = useCreateLocationMutation();
    const updateLocationMutation = useUpdateLocationMutation();
    const addLocationImagesMutation = useAddLocationImagesMutation();

    const onSubmit = async (data: FormValues) => {
        try {
            let ownerId: string | undefined = data.owner_id;
            if (user?.role === 'owner') {
                ownerId = user?.id?.toString();
            }

            if (isEditMode) {
                // Update existing location
                await updateLocationMutation.mutateAsync({
                    id: locationId,
                    data: {
                        name: data.name,
                        address: data.address,
                        description: data.description,
                        owner_id: ownerId,
                    },
                });

                // Add new images if any
                const existingImageUrls = locationImagesQuery.data?.map((img) => img.image_url) || [];
                const newImageUrls = data.images.filter((url) => !existingImageUrls.includes(url));

                if (newImageUrls.length > 0) {
                    await addLocationImagesMutation.mutateAsync({
                        locationId: locationId,
                        imageUrls: newImageUrls,
                    });
                }

                onSaveSuccess?.(locationId.toString());
                toast.success('Location updated successfully');
            } else {
                // Create new location
                const createdLocation = await createLocationMutation.mutateAsync({
                    ...data,
                    owner_id: ownerId ?? '',
                });

                if (data.images.length > 0) {
                    await addLocationImagesMutation.mutateAsync({
                        locationId: createdLocation.data.id,
                        imageUrls: data.images,
                    });
                }

                onSaveSuccess?.(createdLocation.data.id.toString());
                reset();
                toast.success('Location created successfully');
            }
        } catch (error) {
            toast.error(isEditMode ? 'Failed to update location' : 'Failed to create location');
            console.error(isEditMode ? 'Error updating location:' : 'Error creating location:', error);
        }
    };

    const handleClickUploadLocationImage = () => {
        if (uploadImageMutation.isPending) {
            return;
        }
        uploadImageRef?.current?.click();
    };

    const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadImageMutation.mutate(file, {
                onSuccess: (data) => {
                    setValue('images', [...uploadFrames, data.data.url]);
                },
                onError: (error) => {
                    toast.error('Failed to upload image');
                    console.error('Error uploading image:', error);
                },
            });
        }
    };

    useEffect(() => {
        if (locationQuery.data) {
            const location = locationQuery.data;
            reset({
                name: location.name,
                address: location.address,
                description: location.description || '',
                owner_id: location.owner_id?.toString() ?? '',
                images: [],
            });
        }
    }, [locationQuery.data, reset]);

    useEffect(() => {
        if (isEditMode && locationImagesQuery.data) {
            const imageUrls = locationImagesQuery.data.map((img) => img.image_url);
            setValue('images', imageUrls);
        }
    }, [locationImagesQuery.data, setValue, isEditMode]);

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ComponentCard title="Thông tin chung" defaultCollapsed={false}>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <div className="w-full sm:w-1/2">
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
                                <div className="w-full sm:w-1/2">
                                    <Label htmlFor="address">Địa chỉ sân</Label>
                                    <Input
                                        id="address"
                                        error={!!errors.address}
                                        hint={errors.address?.message}
                                        placeholder="Nhập địa chỉ sân"
                                        {...register('address', {
                                            required: 'Địa chỉ sân không được để trống',
                                        })}
                                    />
                                </div>
                            </div>
                            {user?.role === 'admin' && (
                                <div>
                                    <Label htmlFor="owner_id">Chủ sân</Label>
                                    <SelectUser
                                        role="owner"
                                        {...register('owner_id', {
                                            required: 'Chủ sân không được để trống',
                                        })}
                                        onChange={(value) => {
                                            setValue('owner_id', value, { shouldValidate: true });
                                        }}
                                        defaultValue={getValues('owner_id') || user?.id?.toString()}
                                        placeholder="Chọn chủ sân"
                                        error={!!errors.owner_id}
                                        hint={errors.owner_id?.message}
                                    />
                                </div>
                            )}
                            <div>
                                <Label htmlFor="description">Mô tả</Label>
                                <TextArea
                                    id="description"
                                    placeholder="Nhập mô tả về sân"
                                    {...register('description')}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Thêm ảnh mô tả về sân</Label>
                                <div className="flex flex-wrap gap-2">
                                    {uploadFrames.map((frame, index) => {
                                        return (
                                            <div
                                                key={frame}
                                                className="w-32 h-32 rounded-md flex items-center justify-center relative"
                                            >
                                                <div className="absolute top-2 right-2 z-10">
                                                    <button
                                                        className="bg-gray-500 text-white rounded-full w-6 h-6 hover:bg-gray-800 flex justify-center items-center"
                                                        onClick={() => {
                                                            setValue(
                                                                'images',
                                                                uploadFrames.filter((_, i) => i !== index),
                                                            );
                                                        }}
                                                    >
                                                        <TrashBinIcon fill="white" />
                                                    </button>
                                                </div>
                                                <Image
                                                    src={frame}
                                                    alt="preview"
                                                    className="w-32 h-32 object-cover rounded-md"
                                                    width={128}
                                                    height={128}
                                                />
                                            </div>
                                        );
                                    })}
                                    <div
                                        className={`w-32 h-32 rounded-md flex items-center justify-center ${styles['custom-dashed']} transition-transform duration-200 hover:scale-105 hover:border-white/70`}
                                        onClick={handleClickUploadLocationImage}
                                    >
                                        {uploadImageMutation.isPending ? (
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
                                        ) : (
                                            <CirclePlusIcon width={48} height={48} fill="#eee" />
                                        )}
                                    </div>
                                    <input
                                        onChange={handleSelectImage}
                                        type="file"
                                        className="hidden"
                                        ref={uploadImageRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </ComponentCard>
                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={createLocationMutation.isPending || updateLocationMutation.isPending}
                            loading={createLocationMutation.isPending || updateLocationMutation.isPending}
                        >
                            {isEditMode ? 'Cập nhật địa điểm' : 'Lưu địa điểm'}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}

export default LocationFormCard;
