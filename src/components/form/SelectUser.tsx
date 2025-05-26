import React, { useState, useEffect, useRef } from 'react';
import useUsersQuery from '@/hooks/api/auth/useUsersQuery';
import Image from 'next/image';
import { ChevronDownIcon } from '@/icons';
import { IUser } from '@/stores/authStore';

interface SelectUserProps {
  role?: 'admin' | 'owner' | 'customer';
  placeholder?: string;
  onChange: (userId: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  error?: boolean;
  hint?: string;
}

function SelectUser({
  role = 'customer',
  placeholder = 'Select a user',
  onChange,
  className = '',
  defaultValue = '',
  error = false,
  hint = '',
}: SelectUserProps) {
  const { data, isLoading } = useUsersQuery({ role, enabled: true });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Set selected user if defaultValue is provided
  useEffect(() => {
    if (defaultValue && data?.data) {
      const user = data.data.find(u => u?.id?.toString() === defaultValue);
      if (user) setSelectedUser(user);
    }
  }, [defaultValue, data]);

  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user);
    onChange(user?.id?.toString() ?? '');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected user display / dropdown trigger */}
      <div
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        className={`flex items-center justify-between h-11 w-full rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-700'
        } px-4 py-2 cursor-pointer bg-gray-900 ${
          isLoading ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <span className="text-gray-400">Loading users...</span>
        ) : selectedUser ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 overflow-hidden rounded-full">
              <Image
                width={24}
                height={24}
                src={selectedUser.avatar_url || '/images/user/default_user.jpg'}
                alt={selectedUser.name || 'User'}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="text-gray-800 dark:text-white/90">{selectedUser.name}</span>
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
            data.data.map(user => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 overflow-hidden rounded-full">
                  <Image
                    width={32}
                    height={32}
                    src={user.avatar_url || '/images/user/default_user.jpg'}
                    alt={user.name || 'User'}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-gray-800 dark:text-white/90">{user.name || 'Unknown User'}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectUser;
