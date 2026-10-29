import React from 'react';
import { X, Send, Copy, Check, Heart } from 'lucide-react';
import { buildWhatsAppLink, EXACT_DELIVERY_POLICY, WHATSAPP_PHONE_INTERNATIONAL } from '../utils/whatsapp';

interface WhatsAppReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messageText: string;
  whatsappPhone?: string;
}

export const WhatsAppReviewModal: React.FC<WhatsAppReviewModalProps> = ({
  isOpen,
  onClose,
  title,
  messageText,
  whatsappPhone,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayPhone = whatsappPhone ? `+91 ${whatsappPhone}` : WHATSAPP_PHONE_INTERNATIONAL;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full border border-[#EADBDB] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EADBDB] flex items-center justify-between bg-[#FAF7F5]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#3E101D] text-[#3E101D]" />
            <h3 className="font-serif text-lg text-[#2A0D15]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-[#7A5A63] hover:text-[#2A0D15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] flex items-start gap-2.5">
            <Heart className="w-4 h-4 text-[#3E101D] fill-[#3E101D] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[#3E101D] uppercase tracking-wider text-[11px]">Review your personalised order before dispatch</p>
              <p className="text-[#7A5A63] mt-0.5 font-light">
                Clicking the button below opens WhatsApp with this prefilled message to <strong>{displayPhone}</strong>. Orders are confirmed only after DILSY verifies availability and timing with you.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15]">
                Generated WhatsApp Message Preview
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-[#3E101D] hover:text-[#2A0D15] flex items-center gap-1 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#3E101D]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="bg-[#FAF7F5] border border-[#EADBDB] p-4 text-xs font-mono text-[#2A0D15] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {messageText}
            </div>
          </div>

          {/* Delivery Policy Reminder */}
          <div className="text-[11px] text-[#7A5A63] italic border-l-2 border-[#3E101D] pl-3 py-1 font-light">
            "{EXACT_DELIVERY_POLICY}"
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FAF7F5] border-t border-[#EADBDB] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 border border-[#EADBDB] text-xs uppercase tracking-wider font-semibold text-[#7A5A63] bg-white hover:text-[#2A0D15] transition-colors cursor-pointer"
          >
            Go Back & Edit
          </button>
          <a
            href={buildWhatsAppLink(messageText, whatsappPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
