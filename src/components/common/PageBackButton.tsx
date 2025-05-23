'use client';
import React from 'react';
import { BackBtnIcon } from '@/icons';

type Props = {
    onClick?: () => void;
};

function PageBackButton({ onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
            <BackBtnIcon width={24} height={24} fill="currentColor" />
        </button>
    );
}

export default PageBackButton;
