import React, { useState } from 'react';
import {
  Sparkles,
  Edit2,
  Clock,
  CheckCircle,
  UploadCloud,
  X,
  Layers,
  Heart,
} from 'lucide-react';
import { ThemeCategory } from '../types';
import { ThemeArtwork } from '../components/ThemeArtwork';
import { uploadAdminImage } from '../utils/api';

interface AdminThemesProps {
  themes: ThemeCategory[];
  onSaveTheme: (themeData: Partial<ThemeCategory>) => Promise<void>;
}

export const AdminThemes: React.FC<AdminThemesProps> = ({ themes, onSaveTheme }) => {
  const [editingTheme, setEditingTheme] = useState<Partial<ThemeCategory> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenEdit = (theme: ThemeCategory) => {
    setEditingTheme({ ...theme });
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
          setEditingTheme((prev) => (prev ? { ...prev, coverImage: url } : null));
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
    if (!editingTheme) return;

    try {
      setIsSaving(true);
      setErrorMsg(null);
      await onSaveTheme(editingTheme);
      setIsModalOpen(false);
      setEditingTheme(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update theme');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-5 rounded-2xl border border-[#E8D0D6]">
        <h2 className="text-xl font-serif font-bold text-[#2D1B22]">Occasion & Theme Collections</h2>
        <p className="text-xs text-[#7A4E5A]">
          Manage the 9 gifting collections, hero headlines, stories, and Coming Soon availability flags.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="bg-white rounded-2xl border border-[#E8D0D6] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF0F3] border border-[#E8C2CC] overflow-hidden flex items-center justify-center shrink-0">
                    {theme.coverImage ? (
                      <img src={theme.coverImage} alt={theme.name} className="w-full h-full object-cover" />
                    ) : (
                      <ThemeArtwork themeId={theme.id} className="w-7 h-7 text-[#99223A]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#2D1B22]">{theme.name}</h3>
                    <span className="text-[10px] text-[#8C6B75] font-mono">/collections/{theme.slug}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(theme)}
                  className="p-1.5 text-[#6B3241] hover:text-[#99223A] hover:bg-[#FAF0F3] rounded-lg transition-colors cursor-pointer"
                  title="Edit Collection"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#6B424E] line-clamp-2 mb-4">{theme.description}</p>
            </div>

            <div className="pt-3 border-t border-[#F2E4E8] flex items-center justify-between text-xs">
              <span className="text-[#8C6B75]">{theme.badge || 'Occasion'}</span>
              {theme.isComingSoon ? (
                <span className="inline-flex items-center gap-1 font-semibold text-[#6D28D9] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full border border-[#E9D5FF] text-[10px]">
                  <Clock className="w-3 h-3" />
                  <span>Coming Soon</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-[#1B4332] bg-[#EBF7EE] px-2.5 py-0.5 rounded-full border border-[#B7E4C7] text-[10px]">
                  <CheckCircle className="w-3 h-3" />
                  <span>Live & Active</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Theme Modal */}
      {isModalOpen && editingTheme && (
        <div className="fixed inset-0 z-50 bg-[#2D1B22]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E8D0D6] shadow-2xl p-6 sm:p-8 my-8 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#7A4E5A] hover:bg-[#FAF0F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#99223A] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5]">
                Edit Collection
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2D1B22] mt-2">
                {editingTheme.name}
              </h3>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-[#FFF0F3] border border-[#FFCCD5] text-xs font-medium text-[#801B30]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                  Theme Name
                </label>
                <input
                  type="text"
                  required
                  value={editingTheme.name || ''}
                  onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingTheme.description || ''}
                  onChange={(e) =>
                    setEditingTheme({ ...editingTheme, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={editingTheme.heroHeadline || ''}
                    onChange={(e) =>
                      setEditingTheme({ ...editingTheme, heroHeadline: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingTheme.badge || ''}
                    onChange={(e) =>
                      setEditingTheme({ ...editingTheme, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Coming Soon Settings */}
              <div className="p-4 rounded-2xl bg-[#FAF0F3] border border-[#E8C2CC] space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#4D2D37] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTheme.isComingSoon || false}
                    onChange={(e) =>
                      setEditingTheme({ ...editingTheme, isComingSoon: e.target.checked })
                    }
                    className="rounded text-[#99223A] focus:ring-[#99223A]"
                  />
                  <span>Mark Collection as "Coming Soon" (Disables customer orders)</span>
                </label>

                {editingTheme.isComingSoon && (
                  <div>
                    <label className="block text-xs font-semibold text-[#4D2D37] mb-1">
                      Coming Soon Customer Message
                    </label>
                    <input
                      type="text"
                      value={editingTheme.comingSoonMessage || ''}
                      onChange={(e) =>
                        setEditingTheme({
                          ...editingTheme,
                          comingSoonMessage: e.target.value,
                        })
                      }
                      placeholder="e.g. Something special for him is on its way. Stay tuned!"
                      className="w-full px-3.5 py-2 bg-white border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D0D6] space-y-2">
                <label className="block text-xs font-semibold text-[#4D2D37]">
                  Collection Cover Image
                </label>
                <div className="flex items-center gap-3">
                  {editingTheme.coverImage && (
                    <img
                      src={editingTheme.coverImage}
                      alt="Cover"
                      className="w-12 h-12 rounded-xl object-cover border border-[#E8C2CC]"
                    />
                  )}
                  <label className="px-3 py-2 bg-white border border-[#E2CBD2] hover:bg-[#FAF0F3] text-[#6B3241] rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-2xs">
                    <UploadCloud className="w-3.5 h-3.5 text-[#99223A]" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Cover Photo'}</span>
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
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Theme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
