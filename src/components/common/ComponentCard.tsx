import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@/icons';

interface ComponentCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string; // Additional custom classes for styling
    desc?: string; // Description text
    defaultCollapsed?: boolean; // Optional prop to set initial collapsed state
    collapsible?: boolean; // Optional prop to make the card collapsible
}

const ComponentCard: React.FC<ComponentCardProps> = ({ 
    title, 
    children, 
    className = '',
    defaultCollapsed = false,
    collapsible = true
}) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    const toggleCollapse = () => {
        if (!collapsible) return;
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
        >
            {/* Card Header */}
            {title && (
                <div 
                    className={`px-6 py-4 flex justify-between ${collapsible ? 'cursor-pointer' : ''}`}
                    onClick={toggleCollapse}
                >
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
                    {collapsible && (
                        <div className="text-gray-500 dark:text-gray-400">
                            {isCollapsed ? (
                                <ChevronDownIcon className="w-5 h-5" />
                            ) : (
                                <ChevronUpIcon className="w-5 h-5" />
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Card Body */}
            <div 
                className={`transition-all duration-300 ${isCollapsed ? 'overflow-hidden' : ''} ease-in-out ${
                    isCollapsed && collapsible ? 'max-h-0' : 'max-h-100vh'
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
