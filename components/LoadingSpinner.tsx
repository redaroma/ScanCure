
import React, { useState, useEffect } from 'react';

const messages = [
    "Checking ingredients for you...",
    "Making sure it's safe for the little one...",
    "Consulting our knowledge base...",
    "Almost there, Mama...",
    "Just a moment longer..."
];

export const LoadingSpinner: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-mama-white bg-opacity-80 backdrop-blur-sm flex flex-col justify-center items-center z-50">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-mama-teal rounded-full animate-spin"></div>
            <p className="mt-6 text-mama-gray text-lg animate-pulse">{messages[messageIndex]}</p>
        </div>
    );
};
