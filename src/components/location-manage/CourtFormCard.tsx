import React, { useState } from 'react';
import ComponentCard from '../common/ComponentCard';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import TextArea from '../form/input/TextArea';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { CirclePlusIcon, TrashBinIcon } from '@/icons';
import Image from 'next/image';
import { useRef } from 'react';
import useUploadImageMutation from '@/hooks/api/upload/useUploadImageMutation';
import Button from '../ui/button/Button';

type Props = Partial<UseFieldArrayReturn> & { index: number };
function CourtFormCard({ index, remove }: Props) {
    const {
        register,
        formState: { errors },
        getValues,
    } = useFormContext();

    const courts = getValues("courts");
    const uploadImageRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const uploadImageMutation = useUploadImageMutation();

    const handleClickUploadImage = () => {
        if (uploadImageMutation.isPending) return;
        uploadImageRef?.current?.click();
    };

    // const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //   if (!e.target.files || e.target.files.length === 0) return;

    //   const file = e.target.files[0];
    //   const formData = new FormData();
    //   formData.append('file', file);

    //   try {
    //     uploadImageMutation.mutate(formData, {
    //       onSuccess: (data) => {
    //         setImageUrl(data.url);
    //       },
    //       onError: (error) => {
    //         toast.error('Failed to upload image');
    //         console.error('Error uploading image:', error);
    //       },
    //     });
    //   } catch (error) {
    //     console.error('Error uploading image:', error);
    //   }
    // };

    return (
        <div className='relative'>
            {courts.length > 1 && (
                <Button
                    startIcon={<TrashBinIcon />}
                    size='sm'
                    variant='primary'
                    onClick={() => remove && remove(index)}
                    className="absolute top-4 right-4 bg-red-500 text-white"
                >
                    Xóa
                </Button>
            )}
            <ComponentCard title={`Sân ${index + 1}`}>
                <div className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="name">Tên sân</Label>
                        <Input
                            id="name"
                            error={!!errors.name}
                            placeholder="Nhập tên sân"
                            {...register('name', {
                                required: 'Tên sân không được để trống',
                            })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Mô tả</Label>
                        <TextArea id="description" placeholder="Nhập mô tả về sân" {...register('description')} />
                    </div>

                    <div>
                        <Label htmlFor="image">Ảnh sân</Label>
                        <div className="flex items-center gap-4">
                            {imageUrl && (
                                <div className="relative w-32 h-32">
                                    <div className="absolute top-2 right-2 z-10">
                                        <button
                                            type="button"
                                            className="bg-gray-500 text-white rounded-full w-6 h-6 hover:bg-gray-800 flex justify-center items-center"
                                            onClick={() => setImageUrl('')}
                                        >
                                            <TrashBinIcon fill="white" />
                                        </button>
                                    </div>
                                    <Image
                                        src={imageUrl}
                                        alt="Court image"
                                        className="w-32 h-32 object-cover rounded-md"
                                        width={128}
                                        height={128}
                                    />
                                </div>
                            )}

                            <div
                                className="w-32 h-32 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400"
                                onClick={handleClickUploadImage}
                            >
                                {uploadImageMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
                                ) : (
                                    <CirclePlusIcon width={48} height={48} fill="#ccc" />
                                )}
                            </div>
                            <input
                                onChange={() => {}}
                                type="file"
                                className="hidden"
                                ref={uploadImageRef}
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}

export default CourtFormCard;
