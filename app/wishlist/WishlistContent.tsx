'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../../components/Navbar';
import { ItemForm } from '../../components/ItemForm';
import ItemList from '../../components/ItemList';
import { EditItemForm } from '../../components/EditItemForm';
import { WishlistItem } from '../../types/item-types';
import SidebarFilter from '@/components/SidebarFilter';
import { useLocalStorageState } from '@/app/utils/useLocalStorageState';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// Predefined categories for ItemForm/EditItemForm dropdowns
const PREDEFINED_CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Home', 'Beauty', 'Sports', 'Toys', 'Other'];

// Normalize category names to prevent duplicates
const normalizeCategory = (category: string): string => {
  return category.trim().toLowerCase();
};

// Denormalize for display
const denormalizeCategory = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function WishlistContent() {
  const router = useRouter();

  const username = typeof window !== 'undefined' ? localStorage.getItem('loggedInUser') : null;
  const wishlistKey = username ? `wishlist_${username}` : 'wishlist_guest';

  const [items, setItems] = useLocalStorageState<WishlistItem[]>(wishlistKey, []);
  const [search, setSearch] = useLocalStorageState<string>('wishlist-search', '');
  const [selectedCategories, setSelectedCategories] = useLocalStorageState<string[]>('wishlist-categories', []);
  const [selectedStatuses, setSelectedStatuses] = useLocalStorageState<string[]>('wishlist-statuses', []);
  const [priceRange, setPriceRange] = useLocalStorageState<{ min: string; max: string }>('wishlist-price-range', { min: '', max: '' });
  const [selectedPriorities, setSelectedPriorities] = useLocalStorageState<string[]>('wishlist-priorities', []);
  const [customCategories, setCustomCategories] = useLocalStorageState<string[]>('wishlist-custom-categories', []);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

  // Deduplicated categories for ItemForm and EditItemForm
  const availableCategories = Array.from(
    new Set([...PREDEFINED_CATEGORIES, ...customCategories].map(normalizeCategory))
  ).map(denormalizeCategory);

  useEffect(() => {
    if (!username) {
      router.push('/login');
    }
  }, [username, router]);

  if (!username) {
    return null;
  }

  // Add Item
  const handleAddItem = (item: Omit<WishlistItem, 'id'>) => {
    const normalizedCategory = normalizeCategory(item.category);
    const displayCategory = denormalizeCategory(normalizedCategory);
    const newItem: WishlistItem = { ...item, id: uuidv4(), isPurchased: false, category: displayCategory };
    setItems([newItem, ...items]);
    // Add category to customCategories if not already present
    if (!customCategories.map(normalizeCategory).includes(normalizedCategory)) {
      setCustomCategories([...customCategories, displayCategory]);
    }
    setIsFormVisible(false);
    toast.success('Item added successfully!');
  };

  // Edit Item
  const handleEditItem = (item: WishlistItem) => setEditingItem(item);

  const handleUpdateItem = (updatedItem: WishlistItem) => {
    const normalizedCategory = normalizeCategory(updatedItem.category);
    const displayCategory = denormalizeCategory(normalizedCategory);
    const updatedItemWithCategory: WishlistItem = { ...updatedItem, category: displayCategory };
    const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItemWithCategory : item));
    setItems(updatedItems);
    // Add new category to customCategories if not already present
    if (!customCategories.map(normalizeCategory).includes(normalizedCategory)) {
      setCustomCategories([...customCategories, displayCategory]);
    }
    // Remove old category if no items remain in it
    const oldItem = items.find((item) => item.id === updatedItem.id);
    if (oldItem && normalizeCategory(oldItem.category) !== normalizedCategory) {
      const isOldCategoryUsed = updatedItems.some(
        (item) => normalizeCategory(item.category) === normalizeCategory(oldItem.category)
      );
      if (!isOldCategoryUsed) {
        setCustomCategories(
          customCategories.filter((cat) => normalizeCategory(cat) !== normalizeCategory(oldItem.category))
        );
      }
    }
    setEditingItem(null);
    toast.success('Item updated successfully!');
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    const deletedItem = items.find((item) => item.id === id);
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    if (deletedItem) {
      const isCategoryUsed = updatedItems.some(
        (item) => normalizeCategory(item.category) === normalizeCategory(deletedItem.category)
      );
      if (!isCategoryUsed) {
        setCustomCategories(
          customCategories.filter((cat) => normalizeCategory(cat) !== normalizeCategory(deletedItem.category))
        );
      }
    }
    toast.success('Item deleted successfully!');
  };

  // Toggle Purchased Status
  const handleTogglePurchased = (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
    );
    setItems(updatedItems);

    const toggledItem = updatedItems.find((item) => item.id === id);

    toast.dismiss();
    const message = toggledItem?.isPurchased
      ? "✅ Marked as purchased!"
      : "❌ Marked as not purchased!";
    toast.success(message, {
      duration: 3000,
      position: "bottom-right",
    });
  };

  // Search and Filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const filteredItems = items.filter((item) => {
    const matchesItem = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchesStatus =
      selectedStatuses.length === 0 ||
      (item.isPurchased && selectedStatuses.includes('purchased')) ||
      (!item.isPurchased && selectedStatuses.includes('not-purchased'));
    const price = parseFloat(item.price.toString());
    const min = parseFloat(priceRange.min) || 0;
    const max = parseFloat(priceRange.max) || Infinity;
    const matchesPrice = price >= min && price <= max;
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(item.priority);

    return matchesItem && matchesCategory && matchesStatus && matchesPrice && matchesPriority;
  });

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <SidebarFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedPriorities={selectedPriorities}
        setSelectedPriorities={setSelectedPriorities}
        customCategories={customCategories}
      />
      <div
        className={cn(
          'flex-1 overflow-y-auto hide-scrollbar max-h-[calc(100vh-0rem)] md:ml-64',
          (isFormVisible || editingItem) && 'modal-active'
        )}
      >
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
          <Navbar
            onAddItemClick={() => setIsFormVisible(true)}
            onSearchChange={handleSearchChange}
            setSelectedCategories={setSelectedCategories}
            setSelectedStatuses={setSelectedStatuses}
            setPriceRange={setPriceRange}
            setSelectedPriorities={setSelectedPriorities}
          />
        </div>

        <div className="mt-16 p-4">
          {isFormVisible && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <ItemForm
                onAddItem={handleAddItem}
                onClose={() => setIsFormVisible(false)}
                customCategories={availableCategories}
              />
            </div>
          )}

          {editingItem && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <EditItemForm
                item={editingItem}
                onUpdateItem={handleUpdateItem}
                onClose={() => setEditingItem(null)}
                customCategories={availableCategories}
              />
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8 text-2xl">
              <h1>Your wishlist is empty. Start by adding an item!</h1>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-8 text-2xl">
              <h1>No items match your current search and filters.</h1>
              <p>Try adjusting the search term or filters.</p>
            </div>
          ) : (
            <ItemList
              items={filteredItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onTogglePurchased={handleTogglePurchased}
            />
          )}
        </div>
      </div>
    </div>
  );
}