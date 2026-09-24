import React, { useState, useEffect } from 'react';
import { X, Edit2, Package } from 'lucide-react';
import { StationeryItem, StationeryCategory } from '../types';
import { CATEGORIES } from '../data/initialInventory';

interface EditItemModalProps {
  item: StationeryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: StationeryItem) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState<StationeryCategory>('Writing & Pens');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [minThreshold, setMinThreshold] = useState<number>(5);
  const [unit, setUnit] = useState('pcs');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSku(item.sku);
      setCategory(item.category);
      setCostPrice(item.costPrice);
      setSellingPrice(item.sellingPrice);
      setStock(item.stock);
      setMinThreshold(item.minThreshold);
      setUnit(item.unit);
      setDescription(item.description || '');
      setImageUrl(item.imageUrl || '');
      setError('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Item name cannot be empty');
      return;
    }
    if (costPrice < 0 || sellingPrice < 0 || stock < 0) {
      setError('Stock and prices cannot be negative numbers');
      return;
    }

    onSave({
      ...item,
      name: name.trim(),
      sku: sku.trim() || item.sku,
      category,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stock: Number(stock),
      minThreshold: Number(minThreshold) || 5,
      unit: unit.trim() || 'pcs',
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      lastUpdated: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white">
            <Edit2 className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-base">Edit Stationery Product & Stock</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Stationery Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                SKU / Barcode
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StationeryCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cost Price */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Product Image URL with Live Preview */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Item Photo URL (Optional)
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Package className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Current Stock */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Current Stock Qty *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Alert Threshold */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Min Alert Threshold
              </label>
              <input
                type="number"
                min="1"
                value={minThreshold}
                onChange={(e) => setMinThreshold(parseInt(e.target.value) || 5)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="pcs">pcs</option>
                <option value="pack">pack</option>
                <option value="box">box</option>
                <option value="ream">ream</option>
                <option value="pad">pad</option>
                <option value="set">set</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
