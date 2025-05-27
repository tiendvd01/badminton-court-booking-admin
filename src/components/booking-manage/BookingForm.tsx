import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import DatePicker from '@/components/form/date-picker';
import useCreateBookingMutation from '@/hooks/api/bookings/useCreateBookingMutation';
import SelectCourt from '../form/SelectCourt';
import { format } from 'date-fns';
import SelectUser from '../form/SelectUser';
import useCourtQuery from '@/hooks/api/courts/useCourtQuery';

type FormValues = {
  court_id: number;
  customer_id?: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  customer_info: {
    name?: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
};

type Props = {
  onSaveSuccess?: () => void;
  locationId?: number;
};

function BookingForm({ onSaveSuccess, locationId }: Props) {
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  
  const createBookingMutation = useCreateBookingMutation();

  const methods = useForm<FormValues>({
    defaultValues: {
      court_id: undefined,
      customer_id: undefined,
      booking_date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '06:00',
      end_time: '07:00',
      total_price: 0,
      customer_info: {
        name: '',
        phone: '',
        email: '',
      },
      notes: '',
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = methods;

  const watchCourtId = watch('court_id');
  const watchStartTime = watch('start_time');
  const watchEndTime = watch('end_time');
  const watchBookingDate = watch('booking_date');

  const { data: courtData } = useCourtQuery(watchCourtId);

  useEffect(() => {
    if (watchCourtId && watchStartTime && watchEndTime && courtData?.priceTable) {
      const startHour = parseInt(watchStartTime.split(':')[0]);
      const endHour = parseInt(watchEndTime.split(':')[0]);
      const durationHours = endHour - startHour;
      
      const bookingDay = new Date(watchBookingDate).getDay();
      const isWeekend = bookingDay === 0 || bookingDay === 6;
      
      let totalPrice = 0;
      for (let hour = startHour; hour < endHour; hour++) {
        const priceForHour = isWeekend 
          ? courtData.priceTable.weekend_prices[hour] 
          : courtData.priceTable.weekday_prices[hour];
        totalPrice += priceForHour;
      }
      
      setCalculatedPrice(totalPrice);
      setValue('total_price', totalPrice);
    }
  }, [watchCourtId, watchStartTime, watchEndTime, watchBookingDate, courtData, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      const bookingDate = data.booking_date;
      const startDateTime = `${bookingDate}T${data.start_time}:00`;
      const endDateTime = `${bookingDate}T${data.end_time}:00`;
      
      const bookingData = {
        court_id: data.court_id,
        customer_id: isExistingCustomer ? data.customer_id : undefined,
        start_time: startDateTime,
        end_time: endDateTime,
        total_price: data.total_price,
        customer_info: isExistingCustomer ? undefined : data.customer_info,
        notes: data.notes,
      };

      await createBookingMutation.mutateAsync(bookingData);
      toast.success('Đặt sân thành công!');
      reset();
      onSaveSuccess?.();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.response?.data?.message || 'Không thể đặt sân'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="court_id">Sân</Label>
          <SelectCourt
            locationId={locationId}
            {...register('court_id', {
              required: 'Vui lòng chọn sân',
              valueAsNumber: true,
            })}
            onChange={(value) => setValue('court_id', parseInt(value), { shouldValidate: true })}
            error={!!errors.court_id}
            hint={errors.court_id?.message}
          />
        </div>

        <div>
          <Label htmlFor="booking_date">Ngày đặt sân</Label>
          <Controller
            name="booking_date"
            control={control}
            rules={{ required: 'Vui lòng chọn ngày đặt sân' }}
            render={({ field }) => (
              <DatePicker
                id="booking_date"
                mode="single"
                placeholder="Chọn ngày đặt sân"
                defaultDate={field.value}
                onChange={(selectedDates) => {
                  const date = selectedDates[0];
                  field.onChange(format(date, 'yyyy-MM-dd'));
                }}
              />
            )}
          />
          {errors.booking_date && (
            <p className="text-sm text-red-500 mt-1">{errors.booking_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="start_time">Giờ bắt đầu</Label>
          <Input
            id="start_time"
            type="time"
            error={!!errors.start_time}
            hint={errors.start_time?.message}
            {...register('start_time', {
              required: 'Vui lòng chọn giờ bắt đầu',
            })}
          />
        </div>

        <div>
          <Label htmlFor="end_time">Giờ kết thúc</Label>
          <Input
            id="end_time"
            type="time"
            error={!!errors.end_time}
            hint={errors.end_time?.message}
            {...register('end_time', {
              required: 'Vui lòng chọn giờ kết thúc',
              validate: (value) => {
                return value > watchStartTime || 'Giờ kết thúc phải sau giờ bắt đầu';
              },
            })}
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center mb-4">
            <input
              id="existing-customer"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              checked={isExistingCustomer}
              onChange={(e) => setIsExistingCustomer(e.target.checked)}
            />
            <label htmlFor="existing-customer" className="ml-2 text-sm font-medium text-gray-900">
              Khách hàng đã có tài khoản
            </label>
          </div>

          {isExistingCustomer ? (
            <div>
              <Label htmlFor="customer_id">Khách hàng</Label>
              <SelectUser
                role='customer'
                {...register('customer_id', {
                  required: isExistingCustomer ? 'Vui lòng chọn khách hàng' : false,
                  valueAsNumber: true,
                })}
                onChange={(value) => setValue('customer_id', parseInt(value), { shouldValidate: true })}
                error={!!errors.customer_id}
                hint={errors.customer_id?.message}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="customer_info.name">Tên khách hàng</Label>
                  <Input
                    id="customer_info.name"
                    error={!!errors.customer_info?.name}
                    hint={errors.customer_info?.name?.message}
                    placeholder="Nhập tên khách hàng"
                    {...register('customer_info.name', {
                      required: !isExistingCustomer ? 'Vui lòng nhập tên khách hàng' : false,
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="customer_info.phone">Số điện thoại</Label>
                  <Input
                    id="customer_info.phone"
                    error={!!errors.customer_info?.phone}
                    hint={errors.customer_info?.phone?.message}
                    placeholder="Nhập số điện thoại"
                    {...register('customer_info.phone', {
                      required: !isExistingCustomer ? 'Vui lòng nhập số điện thoại' : false,
                    })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="customer_info.email">Email</Label>
                  <Input
                    id="customer_info.email"
                    type="email"
                    error={!!errors.customer_info?.email}
                    hint={errors.customer_info?.email?.message}
                    placeholder="Nhập email khách hàng"
                    {...register('customer_info.email')}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes">Ghi chú</Label>
          <TextArea
            id="notes"
            error={!!errors.notes}
            hint={errors.notes?.message}
            placeholder="Nhập ghi chú (nếu có)"
            {...register('notes')}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="total_price">Tổng tiền</Label>
          <Input
            id="total_price"
            type="number"
            error={!!errors.total_price}
            hint={errors.total_price?.message}
            {...register('total_price', {
              required: 'Vui lòng nhập tổng tiền',
              min: {
                value: 0,
                message: 'Tổng tiền không được âm',
              },
              valueAsNumber: true,
            })}
            readOnly
          />
          <p className="text-sm text-gray-500 mt-1">
            Giá tính toán: {calculatedPrice.toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={createBookingMutation.isPending}
          loading={createBookingMutation.isPending}
        >
          Đặt sân
        </Button>
      </div>
    </form>
  );
}

export default BookingForm;