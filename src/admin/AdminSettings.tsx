import React, { useState } from 'react';
import {
  Settings,
  Phone,
  Mail,
  Instagram,
  FileText,
  MapPin,
  Megaphone,
  KeyRound,
  CheckCircle,
  Save,
  Lock,
} from 'lucide-react';
import { StoreSettings } from '../types';
import { adminChangePasswordApi } from '../utils/api';

interface AdminSettingsProps {
  settings: StoreSettings;
  onSaveSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [deliveryAreasText, setDeliveryAreasText] = useState(
    settings.deliveryAreas.join('\n')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setStatusMessage(null);

      const parsedAreas = deliveryAreasText
        .split('\n')
        .map((a) => a.trim())
        .filter(Boolean);

      const updated = {
        ...formData,
        deliveryAreas: parsedAreas,
      };

      await onSaveSettings(updated);
      setStatusMessage({ type: 'success', text: 'Store settings updated successfully!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim()) {
      setPasswordStatus({ type: 'error', text: 'Both current and new password are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordStatus(null);
      await adminChangePasswordApi(currentPassword.trim(), newPassword.trim());
      setPasswordStatus({ type: 'success', text: 'Studio password changed successfully! Use your new password on next login.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordStatus({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl">
      {/* Store Settings Form */}
      <form onSubmit={handleSaveStoreSettings} className="bg-[#FFF9F2] rounded-3xl border border-[#D8BFAF] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#2D201D]">DILSY Storefront Settings</h2>
          <p className="text-xs text-[#79665C]">
            Configure WhatsApp recipient phone, delivery coverage, policy text, and top announcement bar.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-[#EBF7EE] text-[#1B4332] border border-[#B7E4C7]'
                : 'bg-[#F3E9DC] text-[#4A1423] border border-[#D8BFAF]'
            }`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D201D] mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>WhatsApp Order Phone (10 digits) *</span>
            </label>
            <input
              type="text"
              required
              value={formData.whatsappPhone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  whatsappPhone: e.target.value.replace(/\D/g, ''),
                  whatsappPhoneInternational: `+91 ${e.target.value.replace(/\D/g, '')}`,
                })
              }
              placeholder="e.g. 8360958844"
              className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs font-mono font-semibold text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
            />
            <p className="text-[10px] text-[#79665C] mt-1">
              All checkout & inquiry buttons generate WhatsApp links to this exact number.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D201D] mb-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-[#6D1F32]" />
              <span>Instagram Handle</span>
            </label>
            <input
              type="text"
              value={formData.instagramHandle}
              onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
              placeholder="@dilsygifts"
              className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
            />
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="p-4 rounded-2xl bg-[#F3E9DC] border border-[#D8BFAF] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2D201D] flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-[#6D1F32]" />
              <span>Top Website Announcement Banner</span>
            </span>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#2D201D] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcement.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcement: { ...formData.announcement, enabled: e.target.checked },
                  })
                }
                className="rounded text-[#6D1F32] focus:ring-[#6D1F32]"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#79665C] mb-1">
                Primary Message
              </label>
              <input
                type="text"
                value={formData.announcement.text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcement: { ...formData.announcement, text: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#79665C] mb-1">
                Secondary Subtitle
              </label>
              <input
                type="text"
                value={formData.announcement.secondaryText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcement: {
                      ...formData.announcement,
                      secondaryText: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery Areas */}
        <div>
          <label className="block text-xs font-semibold text-[#2D201D] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#6D1F32]" />
            <span>Delivery Service Areas (One per line)</span>
          </label>
          <textarea
            rows={5}
            value={deliveryAreasText}
            onChange={(e) => setDeliveryAreasText(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none font-sans"
          />
        </div>

        {/* Delivery Policy Text */}
        <div>
          <label className="block text-xs font-semibold text-[#2D201D] mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#6D1F32]" />
            <span>Store Delivery Policy Text</span>
          </label>
          <textarea
            rows={3}
            value={formData.deliveryPolicy}
            onChange={(e) => setFormData({ ...formData, deliveryPolicy: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#6D1F32] hover:bg-[#4A1423] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Store Settings'}</span>
        </button>
      </form>

      {/* Security: Change Admin Password */}
      <form onSubmit={handleChangePassword} className="bg-[#FFF9F2] rounded-3xl border border-[#D8BFAF] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F3E9DC] text-[#6D1F32] flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#2D201D]">Change Studio Master Password</h2>
            <p className="text-xs text-[#79665C]">
              Update the private password used to access this Admin Studio.
            </p>
          </div>
        </div>

        {passwordStatus && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passwordStatus.type === 'success'
                ? 'bg-[#EBF7EE] text-[#1B4332] border border-[#B7E4C7]'
                : 'bg-[#F3E9DC] text-[#4A1423] border border-[#D8BFAF]'
            }`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{passwordStatus.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D201D] mb-1.5">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D201D] mb-1.5">
              New Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D201D] mb-1.5">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Retype new password"
              className="w-full px-3.5 py-2.5 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isChangingPassword}
          className="px-5 py-2.5 bg-[#FFF9F2] hover:bg-[#F3E9DC] border border-[#D8BFAF] text-[#6D1F32] rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{isChangingPassword ? 'Updating...' : 'Update Password'}</span>
        </button>
      </form>
    </div>
  );
};
