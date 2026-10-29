import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Calendar,
  Clock,
  PhoneCall,
  MessageSquare,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  X,
  FileText,
} from 'lucide-react';
import { OrderRequest, OrderStatus } from '../types';

interface AdminOrdersProps {
  orders: OrderRequest[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => Promise<void>;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchPhone = o.customerPhone?.toLowerCase().includes(q);
      const matchId = o.id.toLowerCase().includes(q);
      const matchArea = o.deliveryArea?.toLowerCase().includes(q);
      return matchName || matchPhone || matchId || matchArea;
    }
    return true;
  });

  const handleOpenDetail = (order: OrderRequest) => {
    setSelectedOrder(order);
    setAdminNoteInput(order.adminNotes || '');
  };

  const handleSaveNotes = async () => {
    if (!selectedOrder) return;
    try {
      setIsUpdating(true);
      await onUpdateOrderStatus(selectedOrder.id, selectedOrder.status, adminNoteInput);
      setSelectedOrder({ ...selectedOrder, adminNotes: adminNoteInput });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      setIsUpdating(true);
      await onUpdateOrderStatus(orderId, status);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFF9F2] p-5 rounded-2xl border border-[#D8BFAF]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#2D201D]">WhatsApp Order Requests Log</h2>
          <p className="text-xs text-[#79665C]">
            Genuine inquiries submitted by customers through cart and hamper checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#79665C]" />
            <input
              type="text"
              placeholder="Search by name, phone, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none w-48 sm:w-60"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed on WhatsApp">Confirmed</option>
            <option value="In Preparation">In Preparation</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#FFF9F2] rounded-2xl border border-[#D8BFAF] p-12 text-center">
          <ShoppingBag className="w-8 h-8 text-[#79665C] mx-auto mb-2 opacity-60" />
          <p className="text-sm font-semibold text-[#2D201D]">No order requests found</p>
          <p className="text-xs text-[#79665C] mt-1">
            {searchQuery ? 'Try clearing your search query.' : 'Customer orders and WhatsApp inquiries will be listed here.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#FFF9F2] rounded-2xl border border-[#D8BFAF] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F3E9DC] border-b border-[#D8BFAF] text-[#79665C] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 pl-4">Order ID & Date</th>
                  <th className="py-3.5">Customer</th>
                  <th className="py-3.5">Area & Schedule</th>
                  <th className="py-3.5">Hampers & Add-ons</th>
                  <th className="py-3.5">Total Amount</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8BFAF]/40">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F3E9DC]/30 transition-colors">
                    <td className="py-3.5 pl-4 font-mono font-semibold text-[#2D201D]">
                      <div>{order.id}</div>
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
                      <div className="font-semibold text-[#2D201D]">{order.customerName}</div>
                      {order.customerPhone && (
                        <div className="text-[11px] text-[#79665C] flex items-center gap-1 mt-0.5">
                          <PhoneCall className="w-3 h-3 text-[#2D6A4F]" />
                          <span>{order.customerPhone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 max-w-[180px]">
                      <div className="text-[11px] text-[#2D201D] flex items-center gap-1 font-medium truncate">
                        <MapPin className="w-3 h-3 text-[#6D1F32] shrink-0" />
                        <span className="truncate">{order.deliveryArea}</span>
                      </div>
                      <div className="text-[10px] text-[#79665C] mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{order.deliveryDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 max-w-[200px]">
                      <div className="font-medium text-[#2D201D] truncate">
                        {order.items.map((i) => `${i.title} (x${i.quantity})`).join(', ') || 'Custom Hamper'}
                      </div>
                      {order.addOns && order.addOns.length > 0 && (
                        <div className="text-[10px] text-[#6D1F32] font-semibold mt-0.5">
                          + {order.addOns.length} add-on{order.addOns.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 font-bold text-sm text-[#6D1F32] tabular-nums">
                      ₹{order.total.toLocaleString('en-IN')}
                      {order.discountAmount > 0 && (
                        <div className="text-[10px] font-normal text-[#2D6A4F]">
                          Saved ₹{order.discountAmount} ({order.appliedOffer?.code})
                        </div>
                      )}
                    </td>

                    <td className="py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
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

                    <td className="py-3.5 pr-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(order)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#6D1F32] hover:bg-[#F3E9DC] rounded-lg transition-colors cursor-pointer"
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#2D201D]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFF9F2] rounded-3xl max-w-2xl w-full border border-[#D8BFAF] shadow-2xl p-6 sm:p-8 my-8 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#79665C] hover:bg-[#F3E9DC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#6D1F32] bg-[#F3E9DC] px-3 py-1 rounded-full border border-[#D8BFAF]">
                  {selectedOrder.id}
                </span>
                <span className="text-xs text-[#79665C]">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#2D201D] mt-2">
                Order for {selectedOrder.customerName}
              </h3>
            </div>

            <div className="space-y-5 text-xs">
              {/* Customer and Delivery info */}
              <div className="p-4 rounded-2xl bg-[#F3E9DC] border border-[#D8BFAF] grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#79665C] tracking-wider">
                    Customer Contact
                  </span>
                  <div className="font-bold text-sm text-[#2D201D] mt-0.5">
                    {selectedOrder.customerName}
                  </div>
                  <div className="text-[#2D201D] mt-0.5 flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    <span>{selectedOrder.customerPhone || 'Not provided'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#79665C] tracking-wider">
                    Delivery Logistics
                  </span>
                  <div className="font-medium text-[#2D201D] mt-0.5">
                    {selectedOrder.deliveryArea} {selectedOrder.specificLandmark ? `(${selectedOrder.specificLandmark})` : ''}
                  </div>
                  <div className="text-[#79665C] mt-0.5">
                    {selectedOrder.deliveryDate} • {selectedOrder.timeWindow}
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border border-[#D8BFAF] rounded-2xl p-4 space-y-3 bg-[#FFF9F2]">
                <div className="font-semibold text-sm text-[#2D201D] border-b border-[#D8BFAF]/40 pb-2">
                  Items Breakdown
                </div>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start py-1">
                    <div>
                      <div className="font-semibold text-[#2D201D]">
                        {item.title} <span className="text-[#79665C]">x{item.quantity}</span>
                      </div>
                      {item.customisation && (
                        <div className="text-[11px] text-[#79665C] pl-2 mt-0.5 space-y-0.5">
                          {item.customisation.recipientName && (
                            <div>• For: {item.customisation.recipientName}</div>
                          )}
                          {item.customisation.personalNote && (
                            <div>• Card Message: "{item.customisation.personalNote}"</div>
                          )}
                          {item.customisation.polaroidCaption && (
                            <div>• Polaroid Note: {item.customisation.polaroidCaption}</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="font-semibold text-[#6D1F32] tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}

                {/* Add-ons */}
                {selectedOrder.addOns && selectedOrder.addOns.length > 0 && (
                  <div className="pt-2 border-t border-[#D8BFAF]/40 space-y-1">
                    <div className="text-[11px] font-semibold text-[#6D1F32]">
                      Selected Add-ons:
                    </div>
                    {selectedOrder.addOns.map((add, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] text-[#2D201D] pl-2">
                        <span>• {add.name} (x{add.quantity})</span>
                        <span className="font-medium text-[#6D1F32]">₹{add.price * add.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pricing Summary */}
                <div className="pt-3 border-t border-[#D8BFAF]/40 space-y-1 text-right">
                  <div className="flex justify-between text-[#79665C]">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-[#2D6A4F] font-medium">
                      <span>Discount ({selectedOrder.appliedOffer?.code})</span>
                      <span>-₹{selectedOrder.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-[#2D201D] pt-1 border-t border-[#D8BFAF]/40">
                    <span>Estimated Total</span>
                    <span className="text-[#6D1F32]">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Special Instructions if any */}
              {selectedOrder.specialInstructions && (
                <div className="p-3.5 rounded-xl bg-[#F3E9DC] border border-[#D8BFAF] text-xs">
                  <span className="font-semibold text-[#4A1423]">Customer Instructions:</span>{' '}
                  <span className="text-[#2D201D]">{selectedOrder.specialInstructions}</span>
                </div>
              )}

              {/* Internal Owner Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#2D201D] mb-1">
                  Private Studio Notes (Owner only)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="e.g. Paid ₹50 advance on UPI, delivery scheduled for 2 PM"
                    className="flex-1 px-3.5 py-2 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-xs text-[#2D201D] focus:ring-2 focus:ring-[#6D1F32] focus:outline-none"
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-[#FFF9F2] hover:bg-[#F3E9DC] border border-[#D8BFAF] text-[#6D1F32] font-semibold rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* Raw WhatsApp Message Copy */}
              {selectedOrder.rawWhatsappMessage && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#2D201D]">
                      Raw WhatsApp Message Text
                    </span>
                    <button
                      onClick={() =>
                        handleCopyMessage(
                          selectedOrder.rawWhatsappMessage || '',
                          selectedOrder.id
                        )
                      }
                      className="text-xs text-[#6D1F32] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {copiedId === selectedOrder.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                          <span className="text-[#2D6A4F]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 bg-[#F3E9DC] border border-[#D8BFAF] rounded-xl text-[11px] text-[#2D201D] whitespace-pre-wrap font-mono max-h-36 overflow-y-auto">
                    {selectedOrder.rawWhatsappMessage}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
