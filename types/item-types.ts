export interface WishlistItem {
    id: string;
    name: string;
    description: string;
    link: string;
    price: number;
    imageUrl?: string;
    isPurchased: boolean;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
  }
 
