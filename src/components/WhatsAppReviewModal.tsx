import React from 'react';
import { X, Send, Copy, Check, MessageSquare, AlertCircle, Heart } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFCFD] rounded-2xl max-w-lg w-full border border-[#FFCCD5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95">
        {/* Header with Love Accent */}
        <div className="px-6 py-4 border-b border-[#FFCCD5] flex items-center justify-between bg-gradient-to-r from-[#FFF0F4] via-[#FFEBF0] to-[#FFF5F8]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#C73858] text-[#C73858]" />
            <h3 className="font-serif font-bold text-lg text-[#2D1B22]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-[#7A1E31] hover:bg-[#FFE5EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3.5 bg-[#FFF0F4] border border-[#FFCCD5] rounded-xl text-xs text-[#52333D] flex items-start gap-2.5 shadow-2xs">
            <Heart className="w-4 h-4 text-[#C73858] fill-[#FFB3C6] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#7A1E31]">Review your personalised order before sending</p>
              <p className="text-[#6B424E] mt-0.5">
                Clicking the button below opens WhatsApp with this prefilled message to <strong>{displayPhone}</strong>. Orders are confirmed only after DILSY verifies availability and timing with you.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#4A352F]">
                Generated WhatsApp Message Preview
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-[#8C5A4F] hover:text-[#2A1E1A] flex items-center gap-1 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="bg-[#FFFFFF] border border-[#2A1E1A]/15 rounded-xl p-4 text-xs font-mono text-[#2D1B22] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed shadow-inner">
              {messageText}
            </div>
          </div>

          {/* Delivery Policy Reminder */}
          <div className="text-[11px] text-[#4A352F]/80 italic border-l-2 border-[#D4A39A] pl-3 py-1">
            "{EXACT_DELIVERY_POLICY}"
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F5EFEB] border-t border-[#2A1E1A]/10 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#2A1E1A]/20 text-xs font-medium text-[#2A1E1A] hover:bg-[#EAE0D6] transition-colors cursor-pointer"
          >
            Go Back & Edit
          </button>
          <a
            href={buildWhatsAppLink(messageText, whatsappPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Open WhatsApp & Send Message</span>
          </a>
        </div>
      </div>
    </div>
  );
};
