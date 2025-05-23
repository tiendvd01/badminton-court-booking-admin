import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import Button from '@/components/ui/button/Button'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { IPriceTable } from '@/types/court'
import useDeletePriceTableMutation from '@/hooks/api/prices/useDeletePriceTableMutation'
import Image from "next/image";

type PriceTableRowProps = {
    data: IPriceTable;
}

function PriceTableRow({ data }: PriceTableRowProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isOpen: isOpenDel, openModal: openModalDel, closeModal: closeModalDel } = useModal()

  const deleteTableMutation = useDeletePriceTableMutation()

  const handleClickDelete = () => {
    openModalDel()
  }

  const handleConfirmDelete = () => {
    deleteTableMutation.mutate({ id: data.id, ownerId: data.owner_id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['price-tables'] })
        toast.success('Xóa bảng giá thành công')
        closeModalDel()
      },
      onError: (error) => {
        toast.error('Xóa bảng giá thất bại: ' + error.message)
      }
    })
  }

  const handleViewPrices = () => {
    router.push(`/price-manage/${data.id}`)
  }

  return (
    <>
      <TableRow>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {data.id}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {data.name}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {data.description || 'Không có mô tả'}
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Image 
                width={32}
                height={32}
                src={data?.owner?.avatar_url || '/images/user/default_user.jpg'} 
                alt={data?.owner?.name ?? 'Unknown User'} 
                className="w-8 h-8 rounded-full object-cover"
              />
            <span>{data.owner?.name || `ID: ${data.owner_id}`}</span>
          </div>
        </TableCell>
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          <div className="flex gap-2">
            <Button size="sm" variant="primary" onClick={handleViewPrices}>
              Thông tin
            </Button>
            <Button size="sm" className="bg-red-500 text-white" onClick={handleClickDelete}>
              Xóa
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpenDel} onClose={closeModalDel} className="max-w-[500px]">
        <div className="p-5 text-center">
          <h4 className="mb-5 text-xl font-medium text-gray-800 dark:text-white/90">Xác nhận xóa</h4>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa bảng giá <strong>{data.name}</strong>?
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={closeModalDel} variant="outline">
              Hủy
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              className="bg-red-500 text-white"
              loading={deleteTableMutation.isPending}
            >
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default PriceTableRow
