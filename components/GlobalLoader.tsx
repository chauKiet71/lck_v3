'use client';

import React from 'react';

interface LoadingSpinnerProps {
    className?: string;
}

const GlobalLoader: React.FC<LoadingSpinnerProps> = ({ className = "" }) => {
    return (
        <div className={`flex items-center justify-center p-12 ${className}`}>
            <div className="relative">
                {/* Outer ring */}
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                {/* Inner ring */}
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-white/50 rounded-full animate-spin-reverse"></div>
            </div>
        </div>
    );
};

export default GlobalLoader;
