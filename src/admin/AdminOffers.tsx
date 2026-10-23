import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Calculator,
  Percent,
  Coins,
  X,
} from 'lucide-react';
import { Offer } from '../types';

interface AdminOffersProps {
  offers: Offer[];
  onSaveOffer: (offerData: Partial<Offer>) => Promise<void>;
  onDeleteOffer: (id: string) => Promise<void>;
}

export const AdminOffers: React.FC<AdminOffersProps> = ({
  offers,
  onSaveOffer,
  onDeleteOffer,
}) => {
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testAmount, setTestAmount] = useState<number>(969);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingOffer({
      id: '',
      title: 'Romantic Season ₹50 Off',
      code: 'LOVE50',
      description: 'Flat ₹50 off on handcrafted gift hampers.',
      discountType: 'flat',
      discountValue: 50,
      minOrderAmount: 799,
      isActive: true,
      badgeText: '₹50 FLAT OFF',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: Offer) => {
    setEditingOffer({ ...offer });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    if (!editingOffer.title?.trim()) {
      setErrorMsg('Offer title is required.');
      return;
    }

    if (!editingOffer.discountValue || editingOffer.discountValue <= 0) {
      setErrorMsg('Please enter a discount value greater than 0.');
      return;
    }

    if (editingOffer.discountType === 'percent' && editingOffer.discountValue > 90) {
      setErrorMsg('Percentage discount cannot exceed 90%.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      await onSaveOffer(editingOffer);
      setIsModalOpen(false);
      setEditingOffer(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save offer');
    } finally {
      setIsSaving(false);
    }
  };

  // Preview test calculation
  const calculateTestDiscount = (offer: Partial<Offer>, amount: number) => {
    if (!offer.isActive || amount < (offer.minOrderAmount || 0)) {
      return { discount: 0, final: amount };
    }
    let disc = 0;
    if (offer.discountType === 'percent') {
      disc = Math.round((amount * (offer.discountValue || 0)) / 100);
    } else {
      disc = offer.discountValue || 0;
    }
    disc = Math.min(disc, Math.max(0, amount - 1));
    return { discount: disc, final: amount - disc };
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8D0D6]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#2D1B22]">Promotional Offers & Discounts</h2>
          <p className="text-xs text-[#7A4E5A]">
            Configure promotional percentage or flat discounts. Active offers apply automatically to carts and WhatsApp messages.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-white rounded-xl text-xs font-semibold tracking-wide shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {offers.map((offer) => {
          const test = calculateTestDiscount(offer, testAmount);

          return (
            <div
              key={offer.id}
              className={`p-6 rounded-2xl border transition-all ${
                offer.isActive
                  ? 'bg-white border-[#E8D0D6] shadow-xs'
                  : 'bg-[#FAF7F2] border-[#E8D0D6]/60 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      offer.discountType === 'percent'
                        ? 'bg-[#FFE5EC] text-[#99223A]'
                        : 'bg-[#EBF7EE] text-[#1B4332]'
                    }`}
                  >
                    {offer.discountType === 'percent' ? (
                      <Percent className="w-4 h-4" />
                    ) : (
                      <Coins className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#2D1B22]">
                      {offer.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs font-bold text-[#99223A] bg-[#FFEBF0] px-2 py-0.5 rounded-md border border-[#FFCCD5]">
                        {offer.code}
                      </span>
                      <span className="text-[11px] font-semibold text-[#4D2D37]">
                        {offer.discountType === 'percent'
                          ? `${offer.discountValue}% OFF`
                          : `₹${offer.discountValue} FLAT OFF`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(offer)}
                    className="p-1.5 text-[#6B3241] hover:text-[#99223A] hover:bg-[#FAF0F3] rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove offer "${offer.title}"?`)) {
                        onDeleteOffer(offer.id);
                      }
                    }}
                    className="p-1.5 text-[#A07B86] hover:text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#6B424E] mb-4">{offer.description}</p>

              {/* Status & Min Order */}
              <div className="flex flex-wrap items-center justify-between text-xs py-3 border-t border-[#F2E4E8] text-[#7A4E5A]">
                <div>
                  Min Order:{' '}
                  <strong className="text-[#2D1B22]">₹{offer.minOrderAmount}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      offer.isActive ? 'bg-[#2D6A4F]' : 'bg-[#A07B86]'
                    }`}
                  />
                  <span className="font-medium">
                    {offer.isActive ? 'Active on store' : 'Paused'}
                  </span>
                </div>
              </div>

              {/* Live Preview Bar */}
              <div className="mt-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8D0D6] flex items-center justify-between text-xs">
                <span className="text-[#6B424E]">
                  Sample order (₹{testAmount}):
                </span>
                <span className="font-semibold text-[#2D1B22] tabular-nums">
                  {test.discount > 0 ? (
                    <>
                      <span className="line-through text-[#8C6B75] mr-1.5">
                        ₹{testAmount}
                      </span>
                      <span className="text-[#2D6A4F]">₹{test.final}</span>
                      <span className="text-[10px] text-[#2D6A4F] ml-1">
                        (-₹{test.discount})
                      </span>
                    </>
                  ) : (
                    <span>Min order not met (₹{testAmount})</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Offer Modal */}
      {isModalOpen && editingOffer && (
        <div className="fixed inset-0 z-50 bg-[#2D1B22]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E8D0D6] shadow-2xl p-6 sm:p-8 my-8 relative animate-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#7A4E5A] hover:bg-[#FAF0F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#99223A] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5]">
                {editingOffer.id ? 'Edit Offer' : 'New Promotional Offer'}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2D1B22] mt-2">
                {editingOffer.id ? `Editing ${editingOffer.title}` : 'Create Promotion'}
              </h3>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-[#FFF0F3] border border-[#FFCCD5] text-xs font-medium text-[#801B30]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingOffer.title || ''}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, title: e.target.value })
                  }
                  placeholder="e.g. First Gift Flat ₹50 Off"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                />
              </div>

              {/* Code */}
              <div>
                <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                  Coupon Code (uppercase) *
                </label>
                <input
                  type="text"
                  required
                  value={editingOffer.code || ''}
                  onChange={(e) =>
                    setEditingOffer({
                      ...editingOffer,
                      code: e.target.value.toUpperCase().replace(/\s+/g, ''),
                    })
                  }
                  placeholder="e.g. LOVE50 or DILSY10"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs font-mono font-bold text-[#99223A] focus:ring-2 focus:ring-[#99223A] focus:outline-none uppercase"
                />
              </div>

              {/* Discount Type and Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Discount Type *
                  </label>
                  <select
                    value={editingOffer.discountType || 'flat'}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        discountType: e.target.value as 'percent' | 'flat',
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percent">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingOffer.discountValue || ''}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        discountValue: Number(e.target.value),
                      })
                    }
                    placeholder={editingOffer.discountType === 'percent' ? '10 (%)' : '50 (₹)'}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Min Order & Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingOffer.minOrderAmount ?? 799}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        minOrderAmount: Number(e.target.value),
                      })
                    }
                    placeholder="e.g. 799"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingOffer.badgeText || ''}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, badgeText: e.target.value })
                    }
                    placeholder="e.g. ₹50 OFF on ₹799+"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                  Offer Description
                </label>
                <input
                  type="text"
                  value={editingOffer.description || ''}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, description: e.target.value })
                  }
                  placeholder="e.g. Get flat ₹50 off on orders above ₹799 when ordered with DILSY."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#4D2D37] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffer.isActive || false}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, isActive: e.target.checked })
                    }
                    className="rounded text-[#99223A] focus:ring-[#99223A]"
                  />
                  <span>Activate this offer on customer storefront</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F2E4E8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2CBD2] text-xs font-medium text-[#6B424E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
