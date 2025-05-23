import React from 'react';
import ComponentCard from '../common/ComponentCard';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import TextArea from '../form/input/TextArea';
import { UseFieldArrayReturn, useFormContext } from 'react-hook-form';
import { TrashBinIcon } from '@/icons';
import Button from '../ui/button/Button';

type Props = Partial<UseFieldArrayReturn> & { index: number };
function CourtFormCard({ index, remove }: Props) {
    const {
        register,
        formState: { errors },
        getValues,
    } = useFormContext();

    const courts = getValues("courts");

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
                </div>
            </ComponentCard>
        </div>
    );
}

export default CourtFormCard;
