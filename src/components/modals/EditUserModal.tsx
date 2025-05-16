import React from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useForm } from "react-hook-form";
import useUpdateUserMutation from "@/hooks/api/users/useUpdateUserMutation";
import { toast } from "react-toastify";
import { IUser } from "@/stores/authStore";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
};

function EditUserModal({ isOpen, onClose, user }: Props) {
  const { mutate: updateUser, isPending } = useUpdateUserMutation(user.id || 0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    updateUser(data, {
      onSuccess: () => {
        toast.success("Cập nhật thông tin thành công!");
        onClose();
      },
      onError: (error) => {
        toast.error(error.response?.data.message || "Cập nhật thông tin thất bại!");
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Chỉnh sửa thông tin người dùng
        </h4>

        <div className="flex gap-2 flex-col">
          <div className="col-span-1">
            <Label>Tên đầy đủ</Label>
            <Input
              type="text"
              placeholder="Nhập tên"
              error={!!errors.name}
              hint={errors.name?.message}
              {...register("name", { required: "Tên là bắt buộc" })}
            />
          </div>

          <div className="col-span-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Nhập email"
              error={!!errors.email}
              hint={errors.email?.message}
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
          </div>

          <div className="col-span-1">
            <Label>Số điện thoại</Label>
            <Input
              type="text"
              placeholder="Nhập số điện thoại"
              error={!!errors.phone}
              hint={errors.phone?.message}
              {...register("phone", {
                pattern: {
                  value:
                    /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
                  message: "Số điện thoại không hợp lệ",
                },
              })}
            />
          </div>

          <div className="col-span-1">
            <Label>Địa chỉ</Label>
            <Input
              type="text"
              placeholder="Nhập địa chỉ"
              error={!!errors.address}
              hint={errors.address?.message}
              {...register("address")}
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose} type="button">
            Đóng
          </Button>
          <Button size="sm" type="submit" loading={isPending}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditUserModal;