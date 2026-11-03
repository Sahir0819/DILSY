import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 bg-[#2A0D15] text-[#FAF7F5] px-4 py-2.5 border border-[#EADBDB]/40 shadow-xl text-xs font-sans animate-in slide-in-from-bottom-2 duration-300"
    >
      <WifiOff className="w-4 h-4 text-[#EADBDB] animate-pulse" />
      <div>
        <span className="font-medium tracking-wide">Offline Mode</span>
        <span className="text-[#EADBDB]/80 ml-1.5 hidden sm:inline">
          — Browsing cached hampers and atelier collections.
        </span>
      </div>
    </div>
  );
};
