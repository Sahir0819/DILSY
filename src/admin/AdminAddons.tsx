import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  X,
  Sparkles,
} from 'lucide-react';
import { AddOnItem, AddOnCategory } from '../types';
import { AddOnThumbnail } from '../components/AddOnThumbnail';
import { uploadAdminImage } from '../utils/api';

interface AdminAddonsProps {
  addons: AddOnItem[];
  onSaveAddon: (addonData: Partial<AddOnItem>) => Promise<void>;
  onDeleteAddon: (id: string) => Promise<void>;
}

export const AdminAddons: React.FC<AdminAddonsProps> = ({
  addons,
  onSaveAddon,
  onDeleteAddon,
}) => {
  const [editingAddon, setEditingAddon] = useState<Partial<AddOnItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingAddon({
      id: '',
      name: '',
      category: 'Cute Extras',
      price: 49,
      description: 'A little extra surprise to tuck inside your hamper.',
      isAvailable: true,
      illustrationType: 'mini-keepsake',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addon: AddOnItem) => {
    setEditingAddon({ ...addon });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const url = await uploadAdminImage(base64, file.name);
          setEditingAddon((prev) => (prev ? { ...prev, customImage: url } : null));
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddon) return;

    if (!editingAddon.name?.trim()) {
      setErrorMsg('Add-on name is required.');
      return;
    }

    if (!editingAddon.price || editingAddon.price <= 0) {
      setErrorMsg('Please enter a valid price in INR.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      await onSaveAddon(editingAddon);
      setIsModalOpen(false);
      setEditingAddon(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save add-on');
    } finally {
      setIsSaving(false);
    }
  };

  const categories: AddOnCategory[] = ['Flowers', 'Chocolates & Treats', 'Cute Extras'];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFF9F2] p-5 rounded-2xl border border-[#D8BFAF]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#2D201D]">Add-ons & Extras Catalogue</h2>
          <p className="text-xs text-[#79665C]">
            Manage proposed launch add-ons, pricing, stock availability, and imagery for the Custom Hamper Builder.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#6D1F32] hover:bg-[#4A1423] text-white rounded-xl text-xs font-semibold tracking-wide shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Extra</span>
        </button>
      </div>

      {categories.map((cat) => {
        const catAddons = addons.filter((a) => a.category === cat);
        if (catAddons.length === 0) return null;

        return (
          <div key={cat} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6D1F32] pl-1">
              {cat} ({catAddons.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catAddons.map((addon) => (
                <div
                  key={addon.id}
                  className="bg-[#FFF9F2] rounded-2xl border border-[#D8BFAF] p-4 shadow-xs flex items-center justify-between gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F3E9DC] border border-[#D8BFAF] overflow-hidden flex items-center justify-center shrink-0">
                      {addon.customImage ? (
                        <img src={addon.customImage} alt={addon.name} className="w-full h-full object-cover" />
                      ) : (
                        <AddOnThumbnail type={addon.illustrationType} className="w-8 h-8 object-contain" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-[#2D201D]">{addon.name}</h4>
                      <div className="text-xs font-bold text-[#6D1F32] tabular-nums mt-0.5">
                        ₹{addon.price}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            addon.isAvailable ? 'bg-[#2D6A4F]' : 'bg-[#C84B31]'
                          }`}
                        />
                        <span className="text-[10px] text-[#79665C]">
                          {addon.isAvailable ? 'In Stock' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(addon)}
                      className="p-1.5 text-[#6D1F32] hover:text-[#4A1423] hover:bg-[#F3E9DC] rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove add-on "${addon.name}"?`)) {
                          onDeleteAddon(addon.id);
                        }
                      }}
                      className="p-1.5 text-[#79665C] hover:text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add / Edit Addon Modal */}
      {isModalOpen && editingAddon && (
        <div className="fixed inset-0 z-50 bg-[#2D201D]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFF9F2] rounded-3xl max-w-lg w-full border border-[#D8BFAF] shadow-2xl p-6 sm:p-8 my-8 relative animate-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#79665C] hover:bg-[#F3E9DC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6D1F32] bg-[#F3E9DC] px-3 py-1 rounded-full border border-[#D8BFAF]">
                {editingAddon.id ? 'Edit Extra' : 'New Add-on Item'}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2D201D] mt-2">
                {editingAddon.id ? `Editing ${editingAddon.name}` : 'Add New Extra'}
              </h3>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-[#F3E9DC] border border-[#D8BFAF] text-xs font-medium text-[#4A1423]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D201D] mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingAddon.name || ''}
                  onChange={(e) => setEditingAddon({ ...editingAddon, name: e.target.value })}
                  placeholder="e.g. Single Rose or Cute Keychain"
                  className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D201D] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={editingAddon.category || 'Cute Extras'}
                    onChange={(e) =>
                      setEditingAddon({
                        ...editingAddon,
                        category: e.target.value as AddOnCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
                  >
                    <option value="Flowers">Flowers</option>
                    <option value="Chocolates & Treats">Chocolates & Treats</option>
                    <option value="Cute Extras">Cute Extras</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D201D] mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingAddon.price || ''}
                    onChange={(e) =>
                      setEditingAddon({ ...editingAddon, price: Number(e.target.value) })
                    }
                    placeholder="e.g. 49"
                    className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D201D] mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={editingAddon.description || ''}
                  onChange={(e) =>
                    setEditingAddon({ ...editingAddon, description: e.target.value })
                  }
                  placeholder="e.g. Fresh rose stem to add a sweet romantic touch."
                  className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
                />
              </div>

              {/* Image Upload */}
              <div className="p-3.5 rounded-2xl bg-[#F3E9DC] border border-[#D8BFAF] space-y-2">
                <label className="block text-xs font-semibold text-[#2D201D]">
                  Thumbnail Image
                </label>
                <div className="flex items-center gap-3">
                  {editingAddon.customImage ? (
                    <img
                      src={editingAddon.customImage}
                      alt="Thumbnail"
                      className="w-10 h-10 rounded-xl object-cover border border-[#D8BFAF]"
                    />
                  ) : (
                    <AddOnThumbnail
                      type={editingAddon.illustrationType || 'mini-keepsake'}
                      className="w-10 h-10"
                    />
                  )}
                  <label className="px-3 py-1.5 bg-[#FFF9F2] border border-[#D8BFAF] hover:bg-[#F3E9DC] text-[#6D1F32] rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-2xs transition-colors">
                    <UploadCloud className="w-3.5 h-3.5 text-[#6D1F32]" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#2D201D] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAddon.isAvailable !== false}
                    onChange={(e) =>
                      setEditingAddon({ ...editingAddon, isAvailable: e.target.checked })
                    }
                    className="rounded text-[#6D1F32] focus:ring-[#6D1F32]"
                  />
                  <span>Mark as Available in Custom Hamper Builder</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D8BFAF]/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D8BFAF] text-xs font-medium text-[#79665C] hover:bg-[#F3E9DC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 bg-[#6D1F32] hover:bg-[#4A1423] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Add-on'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
