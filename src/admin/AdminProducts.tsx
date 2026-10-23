import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  UploadCloud,
  X,
  Heart,
} from 'lucide-react';
import { Product, StockStatus, BoxSize } from '../types';
import { THEME_CATEGORIES } from '../data/themes';
import { uploadAdminImage } from '../utils/api';
import { ProductArtwork } from '../components/ProductArtwork';

interface AdminProductsProps {
  products: Product[];
  onSaveProduct: (productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onQuickStockChange: (id: string, stock: StockStatus) => Promise<void>;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onQuickStockChange,
}) => {
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingProduct({
      id: '',
      name: '',
      size: 'Medium',
      price: 969,
      tagline: 'A little box full of love and thoughtful surprises.',
      description: 'A little box full of love, thoughtful surprises, and personal touches.',
      positioning: 'A balanced, thoughtfully curated gift hamper.',
      badge: '',
      categories: ['all', 'for-her', 'for-him'],
      themeIds: ['valentine-box', 'anniversary'],
      idealFor: 'Girlfriend or boyfriend surprises, anniversaries, and sweet milestones.',
      packaging: 'Thoughtfully styled gift presentation with ribbon and personal touches.',
      accentColor: '#C73858',
      illustrationType: 'loved-box',
      stockStatus: 'available',
      allowRecipientChoice: true,
      isFeatured: false,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const uploadedUrl = await uploadAdminImage(base64, file.name);
          setEditingProduct((prev) => (prev ? { ...prev, customImage: uploadedUrl } : null));
        } catch (err: any) {
          setErrorMsg(err.message || 'Image upload failed. You can use standard illustration.');
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
    if (!editingProduct) return;

    if (!editingProduct.name?.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }

    if (!editingProduct.price || editingProduct.price <= 0) {
      setErrorMsg('Please enter a valid selling price greater than 0.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      await onSaveProduct(editingProduct);
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.categories.includes(filterCategory as any);
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8D0D6]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#2D1B22]">Hamper Catalog & Official Pricing</h2>
          <p className="text-xs text-[#7A4E5A]">
            Manage hamper base rates (Small ₹799, Loved Box ₹969, Large ₹1,199), themes, descriptions, and imagery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-[#2D1B22] focus:outline-none focus:ring-2 focus:ring-[#99223A]"
          >
            <option value="all">All Audiences</option>
            <option value="for-him">For Him</option>
            <option value="for-her">For Her</option>
            <option value="besties">Besties</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-white rounded-xl text-xs font-semibold tracking-wide shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Hamper</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8D0D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8D0D6] text-[#7A4E5A] font-semibold uppercase tracking-wider">
                <th className="py-3.5 pl-4">Hamper</th>
                <th className="py-3.5">Size</th>
                <th className="py-3.5">Base Price</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5">Themes</th>
                <th className="py-3.5">Badge</th>
                <th className="py-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2E4E8]">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-[#FCF9F7] transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF0F3] border border-[#E8C2CC] overflow-hidden flex items-center justify-center shrink-0">
                        {product.customImage ? (
                          <img
                            src={product.customImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ProductArtwork
                            type={product.illustrationType}
                            className="w-8 h-8 object-contain"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-[#2D1B22] flex items-center gap-1.5">
                          <span>{product.name}</span>
                          {product.isFeatured && (
                            <span className="text-[10px] font-sans font-semibold text-[#99223A] bg-[#FFEBF0] px-1.5 py-0.5 rounded-full border border-[#FFCCD5]">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#7A4E5A] line-clamp-1 max-w-[240px]">
                          {product.tagline}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="font-medium text-[#4D2D37] bg-[#FAF0F3] px-2 py-0.5 rounded-md border border-[#E8C2CC]">
                      {product.size}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-sm text-[#2D1B22] tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    {product.originalPrice && (
                      <div className="text-[10px] text-[#8C6B75] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>
                  <td className="py-4">
                    <select
                      value={product.stockStatus || 'available'}
                      onChange={(e) => onQuickStockChange(product.id, e.target.value as StockStatus)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${
                        product.stockStatus === 'available' || !product.stockStatus
                          ? 'bg-[#EBF7EE] text-[#1B4332] border-[#B7E4C7]'
                          : product.stockStatus === 'out_of_stock'
                          ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                          : product.stockStatus === 'coming_soon'
                          ? 'bg-[#F3E8FF] text-[#581C87] border-[#E9D5FF]'
                          : 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]'
                      }`}
                    >
                      <option value="available">In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="coming_soon">Coming Soon</option>
                      <option value="unpublished">Unpublished</option>
                    </select>
                  </td>
                  <td className="py-4 max-w-[180px]">
                    <div className="text-[11px] text-[#6B424E] truncate">
                      {product.themeIds?.join(', ') || 'All Occasions'}
                    </div>
                  </td>
                  <td className="py-4">
                    {product.badge ? (
                      <span className="text-[10px] font-semibold text-[#801B30] bg-[#FFE5EC] px-2 py-0.5 rounded-full border border-[#FFCCD5]">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#A07B86]">—</span>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-[#6B3241] hover:text-[#99223A] hover:bg-[#FAF0F3] rounded-lg transition-colors cursor-pointer"
                        title="Edit Hamper"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove hamper "${product.name}"?`)) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 text-[#A07B86] hover:text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
                        title="Delete Hamper"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-[#2D1B22]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#E8D0D6] shadow-2xl p-6 sm:p-8 my-8 relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#7A4E5A] hover:bg-[#FAF0F3] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#99223A] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5]">
                {editingProduct.id ? 'Edit Hamper Details' : 'New Hamper Curation'}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2D1B22] mt-2">
                {editingProduct.id ? `Editing ${editingProduct.name}` : 'Create New Gift Hamper'}
              </h3>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-[#FFF0F3] border border-[#FFCCD5] text-xs font-medium text-[#801B30]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hamper Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Hamper Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    placeholder="e.g. Loved Box (Medium) or Sweet Surprise"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>

                {/* Box Size */}
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Official Box Size *
                  </label>
                  <select
                    value={editingProduct.size || 'Medium'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        size: e.target.value as BoxSize,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  >
                    <option value="Small">Small Box</option>
                    <option value="Medium">Medium Box (Loved Box)</option>
                    <option value="Large">Large Box</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Price in INR */}
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="e.g. 969"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#8C6B75] mt-1">Official base rates: Small ₹799, Medium ₹969, Large ₹1,199</p>
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Original Price (₹) <span className="font-normal text-[#8C6B75]">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="e.g. 1199"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Stock Availability *
                  </label>
                  <select
                    value={editingProduct.stockStatus || 'available'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockStatus: e.target.value as StockStatus,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  >
                    <option value="available">Available (In Stock)</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="unpublished">Unpublished (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                  Tagline (Catchy 1-liner)
                </label>
                <input
                  type="text"
                  value={editingProduct.tagline || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, tagline: e.target.value })
                  }
                  placeholder="e.g. A little box full of love, thoughtful surprises, and personal touches."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                />
              </div>

              {/* Description (Realistic, Honest Copy) */}
              <div>
                <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                  Hamper Description (Honest, experience-focused)
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  placeholder="Write an appealing description without claiming unconfirmed contents..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                />
              </div>

              {/* Badge & Positioning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Highlight Badge <span className="font-normal text-[#8C6B75]">(e.g. ❤️ RECOMMENDED)</span>
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, badge: e.target.value })
                    }
                    placeholder="e.g. ❤️ RECOMMENDED or BESTSELLER"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4D2D37] mb-1.5">
                    Packaging Note
                  </label>
                  <input
                    type="text"
                    value={editingProduct.packaging || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, packaging: e.target.value })
                    }
                    placeholder="e.g. Thoughtfully styled gift presentation with ribbon and personal touches."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-xs text-[#2D1B22] focus:ring-2 focus:ring-[#99223A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Uploader & Artwork Selector */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D0D6] space-y-3">
                <label className="block text-xs font-semibold text-[#4D2D37]">
                  Hamper Image / Artwork
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-white border border-[#E8C2CC] overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                    {editingProduct.customImage ? (
                      <img
                        src={editingProduct.customImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProductArtwork
                        type={editingProduct.illustrationType || 'loved-box'}
                        className="w-16 h-16 object-contain"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-2 bg-white border border-[#E2CBD2] hover:bg-[#FAF0F3] text-[#6B3241] rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-2xs">
                        <UploadCloud className="w-3.5 h-3.5 text-[#99223A]" />
                        <span>{isUploading ? 'Uploading...' : 'Upload Real Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      {editingProduct.customImage && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, customImage: undefined })}
                          className="text-xs text-[#A07B86] hover:text-[#991B1B] underline"
                        >
                          Reset to illustration
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8C6B75]">
                      Upload photos from your studio or phone. Supported: JPG, PNG, WebP up to 10MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme Occasions Link */}
              <div>
                <label className="block text-xs font-semibold text-[#4D2D37] mb-2">
                  Occasions & Themes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEME_CATEGORIES.map((theme) => {
                    const isChecked = editingProduct.themeIds?.includes(theme.id);
                    return (
                      <label
                        key={theme.id}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#FFEBF0] border-[#FFB3C6] text-[#801B30] font-medium'
                            : 'bg-white border-[#E8D0D6] text-[#6B424E]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current = editingProduct.themeIds || [];
                            const next = e.target.checked
                              ? [...current, theme.id]
                              : current.filter((id) => id !== theme.id);
                            setEditingProduct({ ...editingProduct, themeIds: next });
                          }}
                          className="rounded text-[#99223A] focus:ring-[#99223A]"
                        />
                        <span className="truncate">{theme.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#4D2D37] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                    }
                    className="rounded text-[#99223A] focus:ring-[#99223A]"
                  />
                  <span>Mark as Featured in Storefront</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#4D2D37] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.allowRecipientChoice || false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        allowRecipientChoice: e.target.checked,
                      })
                    }
                    className="rounded text-[#99223A] focus:ring-[#99223A]"
                  />
                  <span>Enable For Him / For Her Recipient Choice</span>
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
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-white rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Hamper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
