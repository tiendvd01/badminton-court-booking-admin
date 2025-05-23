import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@/icons';

interface ComponentCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string; // Additional custom classes for styling
    desc?: string; // Description text
    defaultCollapsed?: boolean; // Optional prop to set initial collapsed state
}

const ComponentCard: React.FC<ComponentCardProps> = ({ 
    title, 
    children, 
    className = '',
    defaultCollapsed = false 
}) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
        >
            {/* Card Header */}
            {title && (
                <div 
                    className="px-6 py-4 flex justify-between border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                    onClick={toggleCollapse}
                >
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
                    <div className="text-gray-500 dark:text-gray-400">
                        {isCollapsed ? (
                            <ChevronDownIcon className="w-5 h-5" />
                        ) : (
                            <ChevronUpIcon className="w-5 h-5" />
                        )}
                    </div>
                </div>
            )}

            {/* Card Body */}
            <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isCollapsed ? 'max-h-0' : 'max-h-[1000px]'
                }`}
            >
                <div className="p-4 sm:p-6">
                    <div className="space-y-6">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default ComponentCard;
