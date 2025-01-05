"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/marketplace';
import marketplaceService from '@/services/MarketplaceService';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft } from 'lucide-react';

const MyProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadMyProducts = async () => {
      if (isAuthenticated === null) return; // Wait for auth check
      if (!isAuthenticated) return; // Don't load if not authenticated

      try {
        const myProducts = await marketplaceService.getMyProducts();
        setProducts(myProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMyProducts();
  }, [isAuthenticated]);

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4">
        <button
          onClick={() => router.push('/marketplace')}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marketplace
        </button>

        <h1 className="text-3xl font-bold text-green-600 mb-8">My Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-green-600 font-bold">
                Rp {product.price.toLocaleString()}
              </p>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status: {product.status}</span>
                  <button
                    onClick={() => router.push(`/marketplace/${product.id}`)}
                    className="text-green-600 hover:text-green-700"
                  >
                    View Details
                  </button>
                </div>
                
                {product.status === 'pending' && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">
                      Pending order from: {product.buyer?.name}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProducts; 