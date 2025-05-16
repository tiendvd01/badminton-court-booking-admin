import React, { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useForm } from "react-hook-form";
import useCreateOwnerMutation from "@/hooks/api/users/useCreateOwnerMutation";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeIcon } from "@/icons";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function CreateUserModal({ isOpen, onClose }: Props) {
  const { mutate: createOwner, isPending } = useCreateOwnerMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = (data: FormValues) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...submitData } = data; // eslint-disable-line
    
    createOwner(submitData, {
      onSuccess: () => {
        toast.success("Tạo chủ sân thành công!");
        reset();
        onClose();
      },
      onError: (error) => {
        toast.error(error.response?.data.message || "Tạo chủ sân thất bại!");
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
          Tạo chủ sân
        </h4>

        <div className="flex gap-2 flex-col">
          <div className="col-span-1">
            <Label>Tên đầy đủ</Label>
            <Input
              type="text"
              placeholder="Emirhan"
              error={!!errors.name}
              hint={errors.name?.message}
              {...register("name", { required: "Tên là bắt buộc" })}
            />
          </div>

          <div className="col-span-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="emirhanboruch55@gmail.com"
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
            <Label>Mật khẩu</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                error={!!errors.password}
                hint={errors.password?.message}
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải dài hơn 6 ký tự",
                  },
                })}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
          </div>

          <div className="col-span-1">
            <Label>Nhập lại mật khẩu</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                error={!!errors.confirmPassword}
                hint={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Vui lòng nhập lại mật khẩu",
                  validate: (value) =>
                    value === password || "Mật khẩu không khớp",
                })}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
          </div>

          <div className="col-span-1">
            <Label>Số điện thoại</Label>
            <Input
              type="text"
              placeholder="+09 363 398 46"
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
            Tạo chủ sân
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateUserModal;
