// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { v4 as uuidv4 } from 'uuid';
// import Navbar from '../../components/Navbar';
// import { ItemForm } from '../../components/ItemForm';
// import ItemList from '../../components/ItemList';
// import { EditItemForm } from '../../components/EditItemForm';
// import { WishlistItem } from '../../types/item-types';
// import SidebarFilter from '@/components/SidebarFilter';
// import { useLocalStorageState } from '@/app/utils/useLocalStorageState';
// import ClientOnly from '@/components/ClientOnly';
// import { toast } from 'react-toastify';

// export default function WishlistPage() {
//   const router = useRouter();

//   const username = localStorage.getItem('loggedInUser') ;
//   const wishlistKey = username ? `wishlist_${username}` : 'wishlist_guest';
//   const [items, setItems] = useLocalStorageState<WishlistItem[]>(wishlistKey, []);
//   const [search, setSearch] = useLocalStorageState<string>('wishlist-search', '');
//   const [selectedCategories, setSelectedCategories] = useLocalStorageState<string[]>('wishlist-categories', []);
//   const [selectedStatuses, setSelectedStatuses] = useLocalStorageState<string[]>('wishlist-statuses', []);
//   const [priceRange, setPriceRange] = useLocalStorageState<{ min: string; max: string }>('wishlist-price-range', { min: '', max: '' });
//   const [selectedPriorities, setSelectedPriorities] = useLocalStorageState<string[]>('wishlist-priorities', []);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

//   useEffect(() => {
//     if (!username) {
//       router.push('/login');
//     }
//   }, [username, router]);

//   if (!username) {
//     return null;
//   }

//   // Add Item
//   const handleAddItem = (item: Omit<WishlistItem, 'id'>) => {
//     const newItem: WishlistItem = {
//       ...item,
//       id: uuidv4(),
//       isPurchased: false,
//     };
//     const updatedItems = [...items, newItem];
//     setItems(updatedItems);
//     setIsFormVisible(false);
//     toast.success('Item added successfully!');
//   };

//   // Edit Item
//   const handleEditItem = (item: WishlistItem) => setEditingItem(item);

//   const handleUpdateItem = (updatedItem: WishlistItem) => {
//     const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
//     setItems(updatedItems);
//     setEditingItem(null);
//     toast.success('Item updated successfully!');
//   };

//   // Delete Item
//   const handleDeleteItem = (id: string) => {
//     const updatedItems = items.filter((item) => item.id !== id);
//     setItems(updatedItems);
//     toast.success('Item deleted successfully!');
//   };

//   // Toggle Purchased Status
//   const handleTogglePurchased = (id: string) => {
//     const updatedItems = items.map((item) =>
//       item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
//     );
//     setItems(updatedItems);
//     toast.success('Purchase status updated!');
//   };

//   // Search
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setSearch(e.target.value);

//   // Filter
//   const filteredItems = items.filter((item) => {
//     const matchesItem = item.name.toLowerCase().includes(search.toLowerCase());
//     const matchesCategory =
//       selectedCategories.length === 0 || selectedCategories.includes(item.category);
//     const matchesStatus =
//       selectedStatuses.length === 0 ||
//       (item.isPurchased && selectedStatuses.includes('purchased')) ||
//       (!item.isPurchased && selectedStatuses.includes('not-purchased'));
//     const price = parseFloat(item.price.toString());
//     const min = parseFloat(priceRange.min) || 0;
//     const max = parseFloat(priceRange.max) || Infinity;
//     const matchesPrice = price >= min && price <= max;
//     const matchesPriority =
//       selectedPriorities.length === 0 || selectedPriorities.includes(item.priority);

//     return (
//       matchesItem && matchesCategory && matchesStatus && matchesPrice && matchesPriority
//     );
//   });

//   return (
//     <div className="flex justify-around items-start bg-gray-100 h-screen overflow-auto">
      
//     {/* <aside className="w-64 bg-white shadow-md rounded-md fixed top-20 left-0 h-[95vh] z-10 overflow-auto"> */}
//         <ClientOnly>
//           <SidebarFilter
//             selectedCategories={selectedCategories}
//             setSelectedCategories={setSelectedCategories}
//             selectedStatuses={selectedStatuses}
//             setSelectedStatuses={setSelectedStatuses}
//             priceRange={priceRange}
//             setPriceRange={setPriceRange}
//             selectedPriorities={selectedPriorities}
//             setSelectedPriorities={setSelectedPriorities}
//           />
//         {/* </aside> */}
    

//       <div className="w-full overflow-auto md:ml-64">
//         <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
//           <Navbar
//             onAddItemClick={() => setIsFormVisible(true)}
//             onSearchChange={handleSearchChange}
//             setSelectedCategories={setSelectedCategories}
//             setSelectedStatuses={setSelectedStatuses}
//             setPriceRange={setPriceRange}
//             setSelectedPriorities={setSelectedPriorities}
//           />
//         </div>

//         <div className="mt-16 h-full overflow-y-auto p-4">
//           {isFormVisible && (
//             <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//               <ItemForm onAddItem={handleAddItem} onClose={() => setIsFormVisible(false)} />
//             </div>
//           )}

//           {editingItem && (
//             <EditItemForm
//               item={editingItem}
//               onUpdateItem={handleUpdateItem}
//               onClose={() => setEditingItem(null)}
//             />
//           )}

//             {items.length === 0 ? (
//               <div className="text-center text-gray-500 mt-70 text-4xl">
//                 <h1>Your wishlist is empty. Start by adding an item!</h1>
//               </div>
//             ) : filteredItems.length === 0 ? (
//               <div className="text-center text-gray-500 mt-70 text-4xl">
//                 <h1>No items match your current search and filters.</h1>
//                 <p>Try adjusting the search term or filters.</p>
//               </div>
//             ) : (
//               <ItemList
//                 items={filteredItems}
//                 onEdit={handleEditItem}
//                 onDelete={handleDeleteItem}
//                 onTogglePurchased={handleTogglePurchased}
//               />
//             )}
//         </div>
//       </div>
//       </ClientOnly>
//     </div>
//   );
// }


'use client';

import ClientOnly from '@/components/ClientOnly';
import WishlistContent from './WishlistContent';

export default function WishlistPage() {
  return (
    <ClientOnly>
      <WishlistContent />
    </ClientOnly>
  );
}

