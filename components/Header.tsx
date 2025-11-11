import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
    onNewScan: () => void;
    onViewHistory: () => void;
    currentView: AppState;
}

const NavButton: React.FC<{onClick: () => void, active: boolean, children: React.ReactNode}> = ({ onClick, active, children }) => {
    return (
        <button 
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${active ? 'bg-mama-teal text-white' : 'bg-mama-light-gray text-mama-gray hover:bg-gray-200'}`}
        >
            {children}
        </button>
    );
};

export const Header: React.FC<HeaderProps> = ({ onNewScan, onViewHistory, currentView }) => {
    return (
        <header className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-mama-teal rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    S
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Scan Cure</h1>
            </div>
            <nav className="flex items-center gap-2">
                <NavButton onClick={onNewScan} active={currentView === AppState.SCAN || currentView === AppState.RESULTS}>
                    Scan
                </NavButton>
                <NavButton onClick={onViewHistory} active={currentView === AppState.HISTORY}>
                    History
                </NavButton>
            </nav>
        </header>
    );
};