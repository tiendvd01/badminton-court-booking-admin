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
import { usePlacesWidget } from 'react-google-autocomplete';

type FormValues = {
    name: string;
    address: string;
    description: string;
    owner_id: string;
    images: string[];
    logo?: string;
    min_shift_time: number;
};

type Props = {
    onSaveSuccess?: (locationId: string) => void;
    locationId?: number;
};

function LocationFormCard({ onSaveSuccess, locationId }: Props) {
    const uploadImageRef = useRef<HTMLInputElement>(null);
    const uploadLogoRef = useRef<HTMLInputElement>(null);
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
            logo: '',
            min_shift_time: 60,
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
    const uploadLogoMutation = useUploadImageMutation();
    const createLocationMutation = useCreateLocationMutation();
    const updateLocationMutation = useUpdateLocationMutation();
    const addLocationImagesMutation = useAddLocationImagesMutation();

    const { ref } = usePlacesWidget({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
        onPlaceSelected: (place) => { setValue('address', place.formatted_address ?? ''); },
        options: {
            componentRestrictions: { country: ['vn'] },
            fields: ['place_id', 'name', 'types', 'formatted_address', 'geometry.location'],
            types: ['address'],
        },
    });

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
                        min_shift_time: +data.min_shift_time,
                        logo: data.logo,
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
                    min_shift_time: +data.min_shift_time,
                    logo: data.logo,
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
                logo: location.logo,
                images: location.images?.map((img) => img.image_url) || [],
                min_shift_time: location.min_shift_time || 60,
            });
        }
    }, [locationQuery.data, reset]);

    useEffect(() => {
        if (isEditMode && locationImagesQuery.data) {
            const imageUrls = locationImagesQuery.data.map((img) => img.image_url);
            setValue('images', imageUrls);
        }
    }, [locationImagesQuery.data, setValue, isEditMode]);

    const handleClickUploadLogo = () => {
        if (uploadLogoMutation.isPending) {
            return;
        }
        uploadLogoRef?.current?.click();
    };

    const handleUploadLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadLogoMutation.mutate(file, {
                onSuccess: (data) => {
                    setValue('logo', data.data.url);
                },
                onError: (error) => {
                    toast.error('Failed to upload logo');
                    console.error('Error uploading logo:', error);
                },
            });
        }
    };

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
                                    <input
                                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900"
                                        type="text"
                                        placeholder='Nhập địa chỉ sân'
                                        {...register('address', {
                                            required: 'Địa chỉ sân không được để trống',
                                        })}
                                        onChange={() => {
                                            setValue('address', getValues('address'), { shouldValidate: true });
                                        }}
                                        value={getValues('address')}
                                        ref={ref}
                                    />
                                    {/* <Input
                                            id="address"
                                            error={!!errors.address}
                                            hint={errors.address?.message}
                                            placeholder="Nhập địa chỉ sân"
                                        {...register('address', {
                                            required: 'Địa chỉ sân không được để trống',
                                        })}
                                    /> */}
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
                                <Label htmlFor="logo">Logo sân</Label>
                                <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                                    <input
                                        accept="image/*"
                                        onChange={handleUploadLogo}
                                        type="file"
                                        className="hidden"
                                        ref={uploadLogoRef}
                                    ></input>
                                    <div
                                        onClick={handleClickUploadLogo}
                                        className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 group"
                                    >
                                        <Image
                                            width={80}
                                            height={80}
                                            src={getValues('logo') || '/images/logo/shuttlecock_new_bg.png'}
                                            alt="logo sân"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300 group-hover:cursor-pointer">
                                            {uploadLogoMutation.isPending ? (
                                                <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                            ) : (
                                                <svg
                                                    className="w-8 h-8 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                    ></path>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="min_shift_time">Thời gian đặt sân tối thiểu (phút)</Label>
                                <Input
                                    id="min_shift_time"
                                    type="number"
                                    error={!!errors.min_shift_time}
                                    hint={errors.min_shift_time?.message}
                                    placeholder="Nhập thời gian đặt sân tối thiểu"
                                    {...register('min_shift_time', {
                                        required: 'Thời gian đặt sân tối thiểu không được để trống',
                                        validate: (value) => {
                                            return (
                                                value % 30 === 0 || 'Thời gian đặt sân tối thiểu phải là bội số của 30'
                                            );
                                        },
                                    })}
                                />
                            </div>
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
