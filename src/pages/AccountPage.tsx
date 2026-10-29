import React, { useState, useEffect } from 'react';
import {
  Heart,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  MessageCircle,
  LogOut,
  Edit2,
  Check,
  X,
  Sparkles,
  ShoppingBag,
  Gift,
  ArrowRight,
} from 'lucide-react';
import {
  CustomerSession,
  getCustomerSession,
  fetchCustomerProfile,
  updateCustomerProfileApi,
  fetchCustomerOrders,
  unifiedLogoutApi,
} from '../utils/api';
import { OrderRequest, OrderStatus } from '../types';

interface AccountPageProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, onLogout }) => {
  const [customer, setCustomer] = useState<CustomerSession | null>(() => getCustomerSession());
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editLandmark, setEditLandmark] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [profile, orderList] = await Promise.all([
          fetchCustomerProfile().catch(() => getCustomerSession()),
          fetchCustomerOrders().catch(() => []),
        ]);

        if (profile) {
          setCustomer(profile);
          setEditName(profile.name || '');
          setEditPhone(profile.phone || '');
          setEditAddress(profile.deliveryAddress || '');
          setEditLandmark(profile.specificLandmark || '');
        }
        setOrders(orderList || []);
      } catch (err) {
        console.warn('Error loading account data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      const updated = await updateCustomerProfileApi({
        name: editName,
        phone: editPhone,
        deliveryAddress: editAddress,
        specificLandmark: editLandmark,
      });
      setCustomer(updated);
      setIsEditingProfile(false);
      setStatusMessage('Profile details updated successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSignOut = async () => {
    await unifiedLogoutApi();
    onLogout();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Preparation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed on WhatsApp':
        return 'bg-[#FFF1F4] text-[#9F2343] border-[#F1C5D1]';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-[#FFFAF8] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#F1C5D1] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#9F2343] bg-[#FFF1F4] px-3 py-1 rounded-full border border-[#F1C5D1]">
              <Sparkles className="w-3.5 h-3.5 text-[#E88AA4]" />
              <span>DILSY Customer Haven</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B2028]">
              Welcome, {customer?.name || 'Gifting Enthusiast'}!
            </h1>
            <p className="text-xs sm:text-sm text-[#795A63] font-light max-w-xl">
              Manage your delivery details, view past personalised hamper inquiries, and coordinate directly with our boutique studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF1F4] hover:bg-[#FCE7ED] text-[#9F2343] text-xs font-semibold border border-[#F1C5D1] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-xs font-medium text-[#166534] flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Quick Gifting Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('/custom-hamper')}
            className="p-5 rounded-2xl bg-[#FFFAF8] hover:bg-[#FFF1F4] border border-[#F1C5D1] text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#9F2343] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#3B2028] mb-1">
              Custom Hamper Builder
            </h3>
            <p className="text-xs text-[#795A63] font-light">
              Create a custom gift box tailored with polaroid photos & treats.
            </p>
          </button>

          <button
            onClick={() => onNavigate('/themes')}
            className="p-5 rounded-2xl bg-[#FFFAF8] hover:bg-[#FFF1F4] border border-[#F1C5D1] text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#9F2343] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#3B2028] mb-1">
              Shop by Theme
            </h3>
            <p className="text-xs text-[#795A63] font-light">
              Browse Birthday, Romance, Besties, Apology, and Exam Cheer boxes.
            </p>
          </button>

          <button
            onClick={() => onNavigate('/cart')}
            className="p-5 rounded-2xl bg-[#FFFAF8] hover:bg-[#FFF1F4] border border-[#F1C5D1] text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#9F2343] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#3B2028] mb-1">
              Your Shopping Bag
            </h3>
            <p className="text-xs text-[#795A63] font-light">
              Review saved hampers and checkout with one-click WhatsApp.
            </p>
          </button>
        </div>

        {/* Profile & Delivery Details Card */}
        <div className="bg-[#FFFAF8] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#F1C5D1]">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F1C5D1]">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#3B2028]">
                Personal & Delivery Details
              </h2>
              <p className="text-xs text-[#795A63]">
                Used for auto-filling WhatsApp delivery requests across Mohali & CU.
              </p>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF1F4] hover:bg-[#FCE7ED] text-[#9F2343] text-xs font-semibold border border-[#F1C5D1] cursor-pointer transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] focus:outline-none focus:ring-2 focus:ring-[#9F2343]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] focus:outline-none focus:ring-2 focus:ring-[#9F2343]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5">
                    Hostel / PG Landmark
                  </label>
                  <input
                    type="text"
                    value={editLandmark}
                    onChange={(e) => setEditLandmark(e.target.value)}
                    placeholder="e.g. CU Girls Hostel 3, Room 204"
                    className="w-full px-3.5 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] focus:outline-none focus:ring-2 focus:ring-[#9F2343]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5">
                    Preferred Delivery Area
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="e.g. Chandigarh University Campus, Mohali"
                    className="w-full px-3.5 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] focus:outline-none focus:ring-2 focus:ring-[#9F2343]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 rounded-xl bg-[#9F2343] hover:bg-[#72172F] text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFF1F4] text-[#795A63] hover:text-[#3B2028] text-xs font-semibold border border-[#F1C5D1] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-[#795A63]">
                  <User className="w-4 h-4 text-[#9F2343]" />
                  <span className="font-semibold text-[#3B2028]">{customer?.name || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#795A63]">
                  <Mail className="w-4 h-4 text-[#9F2343]" />
                  <span>{customer?.email || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#795A63]">
                  <Phone className="w-4 h-4 text-[#9F2343]" />
                  <span>{customer?.phone || 'Not set'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-[#795A63]">
                  <MapPin className="w-4 h-4 text-[#9F2343] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#3B2028] block">Saved Landmark / Area:</span>
                    <span>{customer?.specificLandmark || customer?.deliveryAddress || 'No default delivery area set yet.'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Inquiries & Orders */}
        <div className="bg-[#FFFAF8] rounded-3xl p-6 sm:p-8 shadow-sm border border-[#F1C5D1]">
          <div className="pb-4 mb-6 border-b border-[#F1C5D1] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#3B2028]">
                Your Gifting Inquiries & Orders
              </h2>
              <p className="text-xs text-[#795A63]">
                Hampers requested via website or WhatsApp.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#9F2343] bg-[#FFF1F4] px-2.5 py-1 rounded-full border border-[#F1C5D1]">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="w-7 h-7 border-3 border-[#9F2343] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-[#795A63]">Loading your order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-[#FFF1F4] border border-[#F1C5D1]">
              <Package className="w-10 h-10 text-[#E88AA4] mx-auto mb-3" />
              <h3 className="font-serif font-bold text-[#3B2028] text-base mb-1">
                No Gifting Orders Yet
              </h3>
              <p className="text-xs text-[#795A63] max-w-sm mx-auto mb-5 font-light">
                Ready to surprise someone special? Explore our three official signature box sizes (₹799, ₹969, ₹1,199) or build a custom hamper.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('/hampers')}
                  className="px-4 py-2 rounded-xl bg-[#9F2343] hover:bg-[#72172F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Explore Hampers
                </button>
                <button
                  onClick={() => onNavigate('/custom-hamper')}
                  className="px-4 py-2 rounded-xl bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] text-xs font-semibold border border-[#F1C5D1] transition-colors cursor-pointer"
                >
                  Custom Hamper Studio
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-[#FFF1F4] border border-[#F1C5D1] transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F1C5D1]/60">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#3B2028]">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[#795A63] text-xs">·</span>
                        <span className="text-xs text-[#795A63] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#E88AA4]" />
                          {formattedDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span className="text-sm font-bold text-[#9F2343]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Order items overview */}
                    <div className="space-y-1.5 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[#3B2028]">
                          <span>
                            {item.quantity} × {item.title}
                          </span>
                          <span className="font-medium text-[#795A63]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                      {order.deliveryArea && (
                        <p className="text-[11px] text-[#795A63] pt-1">
                          <strong className="text-[#3B2028]">Delivery Target:</strong> {order.deliveryArea} {order.specificLandmark ? `(${order.specificLandmark})` : ''}
                        </p>
                      )}
                    </div>

                    {/* Action link */}
                    <div className="pt-2 flex justify-end">
                      <a
                        href={`https://wa.me/919779256214?text=${encodeURIComponent(
                          `Hi DILSY Studio! Regarding order #${order.id.slice(-6).toUpperCase()}: `
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9F2343] hover:text-[#72172F] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Coordinate this Order on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
