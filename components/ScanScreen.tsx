
import React, { useRef, useState } from 'react';

interface ScanScreenProps {
  onScan: (file: File) => void;
  error: string | null;
}

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mama-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


export const ScanScreen: React.FC<ScanScreenProps> = ({ onScan, error }) => {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onScan(file);
    }
    // Reset the input value to allow scanning the same file again
    event.target.value = '';
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };
  
  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onScan(file);
    }
  };

  return (
    <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-700">Let’s check this together 💛</h2>
      <p className="mt-2 text-mama-gray">Use your camera or upload a clear photo of the ingredient list.</p>
      
      <div 
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-8 p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-mama-teal bg-teal-50' : 'border-gray-300'}`}
      >
        <div className="flex flex-col items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button
                    onClick={handleCameraClick}
                    className="flex-1 flex items-center justify-center gap-3 bg-mama-teal text-white font-bold py-4 px-6 rounded-full hover:bg-teal-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mama-teal"
                >
                    <CameraIcon />
                    Scan with Camera
                </button>
                <button
                    onClick={handleGalleryClick}
                    className="flex-1 flex items-center justify-center gap-3 bg-mama-light-gray text-mama-teal font-bold py-4 px-6 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mama-teal"
                >
                    <UploadIcon/>
                    Upload from Gallery
                </button>
            </div>
            <input
                type="file"
                ref={galleryInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <input
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment"
                className="hidden"
            />
            <p className="mt-6 text-sm text-gray-500">You can also drag & drop an image file here.</p>
        </div>
      </div>
       {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
};
