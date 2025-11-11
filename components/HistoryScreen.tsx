
import React from 'react';
import { Scan, SafetyRating } from '../types';

const getRatingColors = (rating: SafetyRating) => {
  switch (rating) {
    case SafetyRating.Safe:
      return 'border-l-4 border-green-500';
    case SafetyRating.Caution:
      return 'border-l-4 border-yellow-500';
    case SafetyRating.Unsafe:
      return 'border-l-4 border-red-500';
    default:
      return 'border-l-4 border-gray-400';
  }
};

interface HistoryScreenProps {
    history: Scan[];
    onScanSelect: (scan: Scan) => void;
    onNewScan: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onScanSelect, onNewScan }) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Scan History</h2>
        {history.length === 0 ? (
            <div className="text-center py-16">
                <p className="text-mama-gray">You haven't scanned any products yet.</p>
                <button
                    onClick={onNewScan}
                    className="mt-4 bg-mama-teal text-white font-bold py-3 px-6 rounded-full hover:bg-teal-600 transition-transform transform hover:scale-105"
                >
                    Start Your First Scan
                </button>
            </div>
        ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {history.slice().reverse().map((scan) => (
                    <button 
                        key={scan.id} 
                        onClick={() => onScanSelect(scan)}
                        className={`w-full text-left p-4 bg-mama-light-gray rounded-lg flex items-center gap-4 hover:bg-gray-200 transition-colors ${getRatingColors(scan.result.overallSafety)}`}
                    >
                        <img src={scan.image} alt="product scan" className="w-16 h-16 rounded-md object-cover flex-shrink-0 bg-white" />
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800">Scan from {new Date(scan.id).toLocaleDateString()}</p>
                            <p className="text-sm text-mama-gray">Overall Result: <span className="font-bold">{scan.result.overallSafety}</span></p>
                        </div>
                        <div className="text-gray-400">
                            &gt;
                        </div>
                    </button>
                ))}
            </div>
        )}
    </div>
  )
}
