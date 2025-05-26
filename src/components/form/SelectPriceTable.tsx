
import React, { useState, useEffect, useRef } from 'react';
import usePriceTablesQuery from '@/hooks/api/prices/usePriceTablesQuery';
import { useAuthStore } from '@/stores/authStore';
import { ChevronDownIcon } from '@/icons';
import { IPriceTable } from '@/types/court';
import { useRouter } from 'next/navigation';

interface SelectPriceTableProps {
  placeholder?: string;
  onChange: (priceTableId: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
}

function SelectPriceTable({
  placeholder = 'Chọn bảng giá',
  onChange,
  className = '',
  defaultValue = '',
  error = false,
  hint = '',
  disabled = false,
}: SelectPriceTableProps) {
  const { user } = useAuthStore();
  const isOwner = user?.role === 'owner';
  const { data, isLoading } = usePriceTablesQuery(isOwner ? user?.id : undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPriceTable, setSelectedPriceTable] = useState<IPriceTable | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set selected price table if defaultValue is provided
  useEffect(() => {
    if (defaultValue && data?.data) {
      const priceTable = data.data.find(pt => pt?.id?.toString() === defaultValue);
      if (priceTable) setSelectedPriceTable(priceTable);
    }
  }, [defaultValue, data]);

  const handleSelectPriceTable = (priceTable: IPriceTable) => {
    setSelectedPriceTable(priceTable);
    onChange(priceTable?.id?.toString() ?? '');
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    router.push("/price-manage/add");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected price table display / dropdown trigger */}
      <div
        onClick={() => !isLoading && !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between h-11 w-full rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-700'
        } px-4 py-2 cursor-pointer bg-gray-900 ${
          isLoading || disabled ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="text-gray-400">Loading price tables...</span>
        ) : selectedPriceTable ? (
          <div className="flex items-center">
            <span className="text-gray-800 dark:text-white/90">{selectedPriceTable.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
        <ChevronDownIcon className="fill-gray-500 dark:fill-gray-400" />
      </div>

      {/* Error message */}
      {error && hint && (
        <p className="mt-1 text-sm text-red-500">{hint}</p>
      )}

      {/* Dropdown menu */}
      {isOpen && data?.data && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg dark:bg-gray-600 max-h-60 overflow-y-auto">
          {data.data.length > 0 ? (
            <>
              {data.data.map(priceTable => (
                <div
                  key={priceTable.id}
                  onClick={() => handleSelectPriceTable(priceTable)}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="text-gray-800 dark:text-white/90">{priceTable.name}</span>
                </div>
              ))}
              <div
                onClick={handleCreateNew}
                className="flex items-center px-4 py-2 cursor-pointer text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                <span>+ Tạo bảng giá mới</span>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-gray-500">No price tables found</div>
              <div
                onClick={handleCreateNew}
                className="flex items-center px-4 py-2 cursor-pointer text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                <span>+ Tạo bảng giá mới</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectPriceTable;

