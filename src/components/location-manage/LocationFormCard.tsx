import React, { useRef } from 'react';
import ComponentCard from '../common/ComponentCard';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import useCreateLocationMutation from '@/hooks/api/courts/useCreateLocationMutation';
import { toast } from 'react-toastify';
import TextArea from '../form/input/TextArea';
import { CirclePlusIcon, PlusIcon, TrashBinIcon } from '@/icons';
import Image from 'next/image';
import styles from './index.module.css';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import useUploadImageMutation from '@/hooks/api/upload/useUploadImageMutation';
import { useAuthStore } from '@/stores/authStore';
import SelectUser from '../form/SelectUser';
import CourtFormCard from './CourtFormCard';
import Button from '../ui/button/Button';

type FormValues = {
    name: string;
    address: string;
    description: string;
    owner_id: string;
    courts: {
        name: string;
        description: string;
        image_url: string;
        price_table_id?: number | null;
    }[];
    images: string[];
};

function LocationFormCard() {
    const uploadImageRef = useRef<HTMLInputElement>(null);
    const { user } = useAuthStore();

    const methods = useForm<FormValues>({
        defaultValues: {
            name: '',
            address: '',
            description: '',
            owner_id: '',
            courts: [{
                name: '',
                description: '',
                image_url: '',
                price_table_id: null,
            }],
            images: []
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

    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: 'courts',
    });

    const uploadImageMutation = useUploadImageMutation();
    const createLocationMutation = useCreateLocationMutation();

    const onSubmit = (data: FormValues) => {
        console.log("🚀 ~ onSubmit ~ data:", data)
        return;
        createLocationMutation.mutate(data, {
            onSuccess: () => {
                toast.success('Location created successfully');
                reset(); // Reset form fields// Reset upload frames
            },
            onError: (error) => {
                toast.error('Failed to create location');
                console.error('Error creating location:', error);
            },
        });
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

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ComponentCard>
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
                                        onChange={(value) => {
                                            register('owner_id').onChange({ target: { value } });
                                        }}
                                        defaultValue={user?.id?.toString()}
                                        placeholder="Chọn chủ sân"
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
                                                            setValue('images', (uploadFrames.filter((_, i) => i !== index)));
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
                    <ComponentCard className="mt-4">
                        {
                            fields.map((field, index) => {
                                return (
                                    <CourtFormCard {...field} index={index} key={field.id} remove={remove} />
                                );
                            })
                        }
                        <Button
                            startIcon={<PlusIcon />}
                            onClick={() => append({ name: '', description: '', image_url: '', price_table_id: 0 })}
                        >
                            Thêm sân
                        </Button>
                    </ComponentCard>
                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={createLocationMutation.isPending}
                            loading={createLocationMutation.isPending}
                        >
                            Lưu địa điểm
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}

export default LocationFormCard;
