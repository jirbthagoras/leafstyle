interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  location: string;
  material: string;
  seller: {
    id: string;
    name: string;
  };
  status: 'available' | 'pending' | 'sold';
  createdAt: string;
  buyer?: {
    id: string;
    name: string;
    orderDate: string;
  };
  customerDetails?: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  orderStatus?: 'pending' | 'accepted' | 'rejected';
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

interface ProductFilter {
  material?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
}

interface Transaction {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export type { Product, ProductFilter, Transaction }; 