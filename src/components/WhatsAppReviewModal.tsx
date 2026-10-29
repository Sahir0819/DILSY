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
      <div className="bg-[#FFFAF8] rounded-2xl max-w-lg w-full border border-[#F1C5D1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F1C5D1] flex items-center justify-between bg-[#FFF1F4]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#9F2343] text-[#9F2343]" />
            <h3 className="font-serif font-bold text-lg text-[#3B2028]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-[#9F2343] hover:bg-[#FCE7ED] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-xs text-[#3B2028] flex items-start gap-2.5 shadow-2xs">
            <Heart className="w-4 h-4 text-[#9F2343] fill-[#9F2343] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#9F2343]">Review your personalised order before sending</p>
              <p className="text-[#79665C] mt-0.5">
                Clicking the button below opens WhatsApp with this prefilled message to <strong>{displayPhone}</strong>. Orders are confirmed only after DILSY verifies availability and timing with you.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3B2028]">
                Generated WhatsApp Message Preview
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-[#9F2343] hover:text-[#72172F] flex items-center gap-1 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="bg-white border border-[#F1C5D1] rounded-xl p-4 text-xs font-mono text-[#3B2028] whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed shadow-inner">
              {messageText}
            </div>
          </div>

          {/* Delivery Policy Reminder */}
          <div className="text-[11px] text-[#79665C] italic border-l-2 border-[#E88AA4] pl-3 py-1">
            "{EXACT_DELIVERY_POLICY}"
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFF1F4] border-t border-[#F1C5D1] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#F1C5D1] text-xs font-medium text-[#3B2028] bg-[#FFFAF8] hover:bg-[#FCE7ED] transition-colors cursor-pointer"
          >
            Go Back & Edit
          </button>
          <a
            href={buildWhatsAppLink(messageText, whatsappPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#9F2343] hover:bg-[#72172F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open in WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
