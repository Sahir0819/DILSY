import React from 'react';
import {
  Package,
  CheckCircle,
  AlertCircle,
  Tag,
  Clock,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  PhoneCall,
  Calendar,
  MapPin,
} from 'lucide-react';
import { DashboardStats } from '../utils/api';
import { OrderRequest, OrderStatus } from '../types';

interface AdminDashboardOverviewProps {
  stats: DashboardStats | null;
  recentOrders: OrderRequest[];
  onNavigateTab: (tab: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  recentOrders,
  onNavigateTab,
  onUpdateOrderStatus,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#9F2343] via-[#72172F] to-[#3B2028] text-white shadow-lg shadow-[#72172F]/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FFFAF8] bg-white/10 px-3 py-1 rounded-full mb-3 backdrop-blur-xs border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E88AA4]" />
              <span>Studio Master Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              DILSY Gifting Operations
            </h2>
            <p className="mt-1 text-sm text-white/85 max-w-xl font-light">
              Manage handcrafted hampers, live inventory, active promotional discounts, and genuine customer WhatsApp orders from one private studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('products')}
              className="px-4 py-2.5 bg-white text-[#9F2343] hover:bg-[#FFF1F4] rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Add / Edit Hampers</span>
            </button>
            <button
              onClick={() => onNavigateTab('stock')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/20 text-white rounded-xl text-xs font-semibold tracking-wide transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-[#D8BFAF]" />
              <span>Quick Stock Control</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#D8BFAF] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#79665C] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#79665C]">Published</span>
            <div className="w-8 h-8 rounded-lg bg-[#F3E9DC] text-[#6D1F32] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2D201D]">
            {stats?.publishedProducts ?? '—'}
          </div>
          <div className="mt-1 text-[11px] text-[#79665C]">Total hampers live</div>
        </div>

        {/* Available Products */}
        <div
          onClick={() => onNavigateTab('stock')}
          className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#D8BFAF] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#2D6A4F] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2D6A4F]">In Stock</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF7EE] text-[#2D6A4F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1B4332]">
            {stats?.availableProducts ?? '—'}
          </div>
          <div className="mt-1 text-[11px] text-[#40916C]">Ready to order</div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => onNavigateTab('stock')}
          className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#D8BFAF] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#C84B31] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C84B31]">Out of Stock</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF2ED] text-[#C84B31] flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#802211]">
            {stats?.outOfStockProducts ?? '0'}
          </div>
          <div className="mt-1 text-[11px] text-[#A73822]">Order buttons disabled</div>
        </div>

        {/* Active Offers */}
        <div
          onClick={() => onNavigateTab('offers')}
          className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#D8BFAF] shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#6D1F32] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6D1F32]">Discounts</span>
            <div className="w-8 h-8 rounded-lg bg-[#F3E9DC] text-[#6D1F32] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2D201D]">
            {stats?.activeOffersCount ?? '—'}
          </div>
          <div className="mt-1 text-[11px] text-[#79665C]">Active promotions</div>
        </div>

        {/* Order Requests */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#D8BFAF] shadow-xs hover:shadow-md transition-all cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-[#2D201D] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2D201D]">Order Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-[#F3E9DC] text-[#2D201D] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2D201D]">
            {stats?.totalOrdersCount ?? '0'}
          </div>
          <div className="mt-1 text-[11px] text-[#79665C]">
            {stats?.pendingOrdersCount ? `${stats.pendingOrdersCount} pending response` : 'All caught up'}
          </div>
        </div>
      </div>

      {/* Recent Order Inquiries Section */}
      <div className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-7 border border-[#D8BFAF] shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#2D201D]">Recent WhatsApp Order Requests</h3>
            <p className="text-xs text-[#79665C]">
              Genuine gifting inquiries submitted through custom hamper and cart checkouts
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-[#6D1F32] hover:text-[#4A1423] flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Requests</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-[#D8BFAF] rounded-2xl">
            <Clock className="w-8 h-8 text-[#79665C] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium text-[#2D201D]">No order requests recorded yet</p>
            <p className="text-xs text-[#79665C] mt-1 max-w-sm mx-auto">
              When customers click "Order via WhatsApp" from the cart or custom hamper builder, their full inquiry details appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D8BFAF] text-[#79665C] font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Order ID</th>
                  <th className="pb-3">Customer & Area</th>
                  <th className="pb-3">Hamper Details</th>
                  <th className="pb-3">Est. Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8BFAF]/40">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F3E9DC]/30 transition-colors">
                    <td className="py-3.5 pl-2 font-mono text-[11px] font-semibold text-[#2D201D]">
                      {order.id}
                      <div className="text-[10px] text-[#79665C] font-sans">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-[#2D201D] flex items-center gap-1.5">
                        <span>{order.customerName}</span>
                      </div>
                      <div className="text-[11px] text-[#79665C] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#6D1F32] shrink-0" />
                        <span className="truncate max-w-[180px]">{order.deliveryArea}</span>
                      </div>
                      {order.customerPhone && (
                        <div className="text-[11px] text-[#79665C] flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-[#2D6A4F] shrink-0" />
                          <span>{order.customerPhone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 max-w-[220px]">
                      <div className="font-medium text-[#2D201D] truncate">
                        {order.items.map((i) => `${i.title} (x${i.quantity})`).join(', ') || 'Custom Hamper'}
                      </div>
                      {order.addOns && order.addOns.length > 0 && (
                        <div className="text-[10px] text-[#6D1F32] font-semibold mt-0.5">
                          + {order.addOns.length} add-on{order.addOns.length > 1 ? 's' : ''} (
                          {order.addOns.map((a) => a.name).join(', ')})
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 font-semibold text-[#2D201D] tabular-nums">
                      ₹{order.total.toLocaleString('en-IN')}
                      {order.discountAmount > 0 && (
                        <div className="text-[10px] text-[#2D6A4F]">Saved ₹{order.discountAmount}</div>
                      )}
                    </td>
                    <td className="py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${
                          order.status === 'Confirmed on WhatsApp'
                            ? 'bg-[#EBF7EE] text-[#1B4332] border-[#B7E4C7]'
                            : order.status === 'In Preparation'
                            ? 'bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE]'
                            : order.status === 'Delivered'
                            ? 'bg-[#F3E8FF] text-[#581C87] border-[#E9D5FF]'
                            : order.status === 'Cancelled'
                            ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                            : 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed on WhatsApp">Confirmed</option>
                        <option value="In Preparation">Preparing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <button
                        onClick={() => onNavigateTab('orders')}
                        className="text-xs font-semibold text-[#6D1F32] hover:underline cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
