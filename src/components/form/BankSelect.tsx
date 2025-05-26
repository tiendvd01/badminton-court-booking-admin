import React, { useState, useEffect, useRef } from 'react';
import useBanksQuery, { Bank } from '@/hooks/api/payments/useBanksQuery';
import Image from 'next/image';
import cn from 'classnames';
import { ChevronDownIcon } from '@/icons';

interface BankSelectProps {
  value?: string;
  onChange: (value: string, bank: Bank | undefined) => void;
  error?: boolean;
  hint?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const BankSelect = ({
  value,
  onChange,
  error,
  hint,
  placeholder = 'Chọn ngân hàng',
  className,
  disabled = false,
}: BankSelectProps) => {
  const { data: banks, isLoading, isError } = useBanksQuery();
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected bank when value changes
  useEffect(() => {
    if (banks && value) {
      const bank = banks.find(b => b.bin === value || b.code === value);
      setSelectedBank(bank);
    } else {
      setSelectedBank(undefined);
    }
  }, [banks, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (bank: Bank) => {
    setSelectedBank(bank);
    onChange(bank.bin, bank);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => !isLoading && !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between h-11 w-full rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-700'
        } px-4 py-2 cursor-pointer bg-gray-900 ${
          isLoading || disabled ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="text-gray-400">Đang tải...</span>
        ) : selectedBank ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 overflow-hidden flex items-center justify-center bg-white rounded-full">
              <Image
                src={selectedBank.logo}
                alt={selectedBank.name}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="text-gray-800 dark:text-white/90">
              {selectedBank.name} ({selectedBank.shortName})
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {isLoading ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-300">
              Đang tải...
            </div>
          ) : isError ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-300">
              Lỗi khi tải danh sách ngân hàng
            </div>
          ) : (
            banks?.map((bank) => (
              <div
                key={bank.bin}
                className={cn(
                  "relative cursor-pointer select-none py-2 px-4 hover:bg-primary hover:text-white text-gray-300",
                  selectedBank?.bin === bank.bin && "bg-primary/10"
                )}
                onClick={() => handleSelect(bank)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center bg-white rounded-full">
                    <Image 
                      src={bank.logo} 
                      alt={bank.name} 
                      width={24} 
                      height={24} 
                      className="object-contain"
                    />
                  </div>
                  <span className="block truncate">
                    {bank.name} ({bank.shortName})
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {hint && <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>{hint}</p>}
    </div>
  );
};

export default BankSelect;
