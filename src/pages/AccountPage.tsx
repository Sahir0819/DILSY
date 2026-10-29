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
  Sparkles,
  ShoppingBag,
  Gift,
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
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Dispatched':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'In Preparation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Confirmed on WhatsApp':
        return 'bg-[#FAF7F5] text-[#3E101D] border-[#EADBDB]';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 border border-[#EADBDB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#3E101D] bg-[#FAF7F5] px-3 py-1 border border-[#EADBDB]">
              <Sparkles className="w-3.5 h-3.5 text-[#3E101D]" />
              <span>DILSY Client Haven</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#2A0D15]">
              Welcome, {customer?.name || 'Gifting Enthusiast'}
            </h1>
            <p className="text-xs sm:text-sm text-[#7A5A63] font-light max-w-xl">
              Manage your delivery details, view past personalised hamper inquiries, and coordinate directly with our boutique studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF7F5] text-[#3E101D] text-xs uppercase tracking-wider font-semibold border border-[#EADBDB] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Quick Gifting Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('/custom-hamper')}
            className="p-5 bg-white hover:bg-[#FAF7F5] border border-[#EADBDB] hover:border-[#3E101D] text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#3E101D] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base text-[#2A0D15] mb-1">
              Custom Hamper Builder
            </h3>
            <p className="text-xs text-[#7A5A63] font-light">
              Create a custom gift box tailored with polaroid photos & treats.
            </p>
          </button>

          <button
            onClick={() => onNavigate('/themes')}
            className="p-5 bg-white hover:bg-[#FAF7F5] border border-[#EADBDB] hover:border-[#3E101D] text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#3E101D] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <h3 className="font-serif text-base text-[#2A0D15] mb-1">
              Shop by Theme
            </h3>
            <p className="text-xs text-[#7A5A63] font-light">
              Browse Birthday, Romance, Besties, Apology, and Exam Cheer boxes.
            </p>
          </button>

          <button
            onClick={() => onNavigate('/cart')}
            className="p-5 bg-white hover:bg-[#FAF7F5] border border-[#EADBDB] hover:border-[#3E101D] text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#3E101D] text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base text-[#2A0D15] mb-1">
              Your Shopping Bag
            </h3>
            <p className="text-xs text-[#7A5A63] font-light">
              Review saved hampers and checkout with one-click WhatsApp.
            </p>
          </button>
        </div>

        {/* Profile & Delivery Details Card */}
        <div className="bg-white p-6 sm:p-8 border border-[#EADBDB] shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EADBDB]">
            <div>
              <h2 className="text-lg font-serif text-[#2A0D15]">
                Personal & Delivery Details
              </h2>
              <p className="text-xs text-[#7A5A63] font-light">
                Used for auto-filling WhatsApp delivery requests across Mohali & CU.
              </p>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F5] hover:bg-white text-[#3E101D] text-xs uppercase tracking-wider font-semibold border border-[#EADBDB] cursor-pointer transition-colors"
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
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5">
                    Hostel / PG Landmark
                  </label>
                  <input
                    type="text"
                    value={editLandmark}
                    onChange={(e) => setEditLandmark(e.target.value)}
                    placeholder="e.g. CU Girls Hostel 3, Room 204"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5">
                    Preferred Delivery Area
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="e.g. Chandigarh University Campus, Mohali"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{saveLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 bg-white text-[#7A5A63] hover:text-[#2A0D15] text-xs uppercase tracking-wider font-semibold border border-[#EADBDB] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-[#7A5A63]">
                  <User className="w-4 h-4 text-[#3E101D]" />
                  <span className="font-semibold text-[#2A0D15]">{customer?.name || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#7A5A63]">
                  <Mail className="w-4 h-4 text-[#3E101D]" />
                  <span>{customer?.email || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#7A5A63]">
                  <Phone className="w-4 h-4 text-[#3E101D]" />
                  <span>{customer?.phone || 'Not set'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-[#7A5A63]">
                  <MapPin className="w-4 h-4 text-[#3E101D] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#2A0D15] block">Saved Landmark / Area:</span>
                    <span className="font-light">{customer?.specificLandmark || customer?.deliveryAddress || 'No default delivery area set yet.'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Inquiries & Orders */}
        <div className="bg-white p-6 sm:p-8 border border-[#EADBDB] shadow-xs">
          <div className="pb-4 mb-6 border-b border-[#EADBDB] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif text-[#2A0D15]">
                Your Gifting Inquiries & Orders
              </h2>
              <p className="text-xs text-[#7A5A63] font-light">
                Hampers requested via website or WhatsApp.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-[#3E101D] uppercase tracking-wider bg-[#FAF7F5] px-2.5 py-1 border border-[#EADBDB]">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center">
              <div className="w-7 h-7 border-2 border-[#3E101D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-[#7A5A63]">Loading your order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#FAF7F5] border border-[#EADBDB]">
              <Package className="w-10 h-10 text-[#7A5A63] mx-auto mb-3" />
              <h3 className="font-serif text-[#2A0D15] text-lg mb-1">
                No Gifting Orders Yet
              </h3>
              <p className="text-xs text-[#7A5A63] max-w-sm mx-auto mb-5 font-light">
                Ready to surprise someone special? Explore our three official signature box sizes (₹799, ₹969, ₹1,199) or build a custom hamper.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('/hampers')}
                  className="px-5 py-2.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                >
                  Explore Hampers
                </button>
                <button
                  onClick={() => onNavigate('/custom-hamper')}
                  className="px-5 py-2.5 bg-white hover:bg-[#FAF7F5] text-[#3E101D] text-xs uppercase tracking-widest font-semibold border border-[#EADBDB] transition-colors cursor-pointer"
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
                    className="p-5 bg-[#FAF7F5] border border-[#EADBDB] transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#EADBDB]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#2A0D15]">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[#7A5A63] text-xs">·</span>
                        <span className="text-xs text-[#7A5A63] flex items-center gap-1 font-light">
                          <Calendar className="w-3.5 h-3.5 text-[#3E101D]" />
                          {formattedDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span className="text-sm font-serif font-medium text-[#3E101D]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Order items overview */}
                    <div className="space-y-1.5 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[#2A0D15]">
                          <span>
                            {item.quantity} × {item.title}
                          </span>
                          <span className="font-medium text-[#7A5A63]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                      {order.deliveryArea && (
                        <p className="text-[11px] text-[#7A5A63] pt-1 font-light">
                          <strong className="text-[#2A0D15] font-medium">Delivery Target:</strong> {order.deliveryArea} {order.specificLandmark ? `(${order.specificLandmark})` : ''}
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
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#3E101D] hover:text-[#2A0D15] transition-colors"
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
