import React, { useState } from 'react';
import { Download, Share, X, Smartphone, Laptop, CheckCircle2, MoreVertical } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'drawer' | 'footer' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      const success = await install();
      setInstalling(false);
      if (!success) {
        // If dismissed or failed, show helper modal
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  // If already running in standalone PWA window, display an active installed indicator or clean label
  if (isInstalled) {
    if (variant === 'nav') {
      return (
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold text-[#3E101D] bg-[#FAF7F5] border border-[#EADBDB]">
          <CheckCircle2 className="w-3 h-3 text-[#3E101D]" />
          <span>App Installed</span>
        </span>
      );
    }
    return null;
  }

  // Mobile Drawer Menu Variant
  if (variant === 'drawer') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={installing}
          className={`w-full py-2.5 px-4 bg-[#3E101D] hover:bg-[#2A0D15] text-[#FAF7F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-white" />
          <span>{installing ? 'Installing...' : 'Install DILSY App'}</span>
        </button>

        {showModal && (
          <InstallInstructionsModal
            isInstallable={isInstallable}
            isIOS={isIOS}
            onInstall={install}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // Footer Link Variant
  if (variant === 'footer') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`hover:text-[#2A0D15] transition-colors cursor-pointer flex items-center gap-1.5 text-xs text-[#6E565D] ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#3E101D]" />
          <span>Install DILSY App (PWA)</span>
        </button>

        {showModal && (
          <InstallInstructionsModal
            isInstallable={isInstallable}
            isIOS={isIOS}
            onInstall={install}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // Banner Variant
  if (variant === 'banner') {
    return (
      <>
        <div className={`p-4 bg-white border border-[#EADBDB] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FAF7F5] border border-[#EADBDB] flex items-center justify-center text-[#3E101D] shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif text-sm text-[#2A0D15]">Install DILSY Atelier App</p>
              <p className="text-[11px] text-[#7A5A63] font-light">
                Add to your home screen for quick orders and smooth offline gifting browsing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={installing}
            className="px-4 py-2 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3 h-3" />
            <span>{installing ? 'Installing...' : 'Install App'}</span>
          </button>
        </div>

        {showModal && (
          <InstallInstructionsModal
            isInstallable={isInstallable}
            isIOS={isIOS}
            onInstall={install}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  // Default Nav Variant (Always visible in Top Navbar)
  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={installing}
        title="Install DILSY App on Android, iOS, or PC"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#3E101D] bg-white hover:bg-[#FAF7F5] border border-[#EADBDB] transition-all cursor-pointer shadow-xs ${className}`}
      >
        <Download className="w-3 h-3 text-[#3E101D]" />
        <span>{installing ? 'Installing...' : 'Install App'}</span>
      </button>

      {showModal && (
        <InstallInstructionsModal
          isInstallable={isInstallable}
          isIOS={isIOS}
          onInstall={install}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

interface InstallModalProps {
  isInstallable: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
  onClose: () => void;
}

const InstallInstructionsModal: React.FC<InstallModalProps> = ({
  isInstallable,
  isIOS,
  onInstall,
  onClose,
}) => {
  const [installing, setInstalling] = useState(false);

  const handleDirectInstall = async () => {
    setInstalling(true);
    const success = await onInstall();
    setInstalling(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F5] max-w-md w-full border border-[#EADBDB] shadow-2xl p-6 relative animate-in fade-in zoom-in-95 font-sans text-[#2A0D15]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-[#7A5A63] hover:text-[#2A0D15] p-1.5 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with DILSY App Icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <img
            src="/pwa-192x192.png"
            alt="DILSY Icon"
            className="w-12 h-12 border border-[#EADBDB] shadow-xs object-cover bg-white"
          />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#7A5A63] block font-semibold">
              Progressive Web App
            </span>
            <h3 className="font-serif text-xl font-normal text-[#2A0D15]">
              Install DILSY Atelier
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#6E565D] font-light leading-relaxed mb-4">
          Install DILSY directly on your phone or computer for instant access, smooth offline catalog browsing, and fast WhatsApp gifting orders.
        </p>

        {/* 1-Click Install Button if browser supports beforeinstallprompt */}
        {isInstallable && (
          <button
            type="button"
            onClick={handleDirectInstall}
            disabled={installing}
            className="w-full mb-4 py-3 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{installing ? 'Prompting Browser...' : 'Add to Home Screen (1-Click)'}</span>
          </button>
        )}

        {/* Platform-Specific Step-by-Step Instructions */}
        <div className="space-y-3.5 bg-white p-4 border border-[#EADBDB] mb-5 text-xs">
          {isIOS ? (
            /* Apple iOS Safari Steps */
            <div>
              <div className="flex items-center gap-1.5 font-medium text-[#3E101D] mb-2 uppercase tracking-wide text-[11px]">
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad (Safari)</span>
              </div>
              <ol className="space-y-2 text-[#4A2D35] pl-1 font-light">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#3E101D] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">1</span>
                  <span>Tap the <strong>Share</strong> icon (<Share className="w-3 h-3 inline text-[#3E101D]" />) in Safari's bottom toolbar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#3E101D] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">2</span>
                  <span>Scroll down and select <strong>"Add to Home Screen"</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#3E101D] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">3</span>
                  <span>Tap <strong>"Add"</strong> in the top right corner. The DILSY app will appear on your home screen!</span>
                </li>
              </ol>
            </div>
          ) : (
            /* Android & Chrome / Desktop Steps */
            <div>
              <div className="flex items-center gap-1.5 font-medium text-[#3E101D] mb-2 uppercase tracking-wide text-[11px]">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android & Chrome Instructions</span>
              </div>
              <ol className="space-y-2 text-[#4A2D35] pl-1 font-light">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#3E101D] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">1</span>
                  <span>Tap the <strong>three dots</strong> (<MoreVertical className="w-3 h-3 inline text-[#3E101D]" />) at the top-right corner of Chrome.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#3E101D] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">2</span>
                  <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 bg-[#3E101D] text-white flex items-center justify-center text-[10px] font-semibold shrink-0">3</span>
                  <span>Confirm by tapping <strong>"Install"</strong>. DILSY will install with its official icon and launch full-screen!</span>
                </li>
              </ol>

              <div className="mt-3 pt-3 border-t border-[#EADBDB] text-[11px] text-[#7A5A63]">
                <div className="flex items-center gap-1.5 font-medium text-[#3E101D] mb-1">
                  <Laptop className="w-3 h-3" />
                  <span>On Desktop (Chrome or Edge)</span>
                </div>
                <p className="font-light">
                  Click the install icon (<Download className="w-3 h-3 inline text-[#3E101D]" />) inside your browser's address bar or select menu → <em>Save and share → Install DILSY</em>.
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-[#FAF7F5] hover:bg-[#F5ECE7] border border-[#EADBDB] text-[#2A0D15] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
