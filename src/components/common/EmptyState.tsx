import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Không có dữ liệu',
  message = 'Chưa có dữ liệu để hiển thị.',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h3>
      <p className="text-center text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default EmptyState;
