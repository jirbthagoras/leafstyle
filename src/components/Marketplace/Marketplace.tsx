"use client";

import { useState, useEffect } from 'react';
import { Product, ProductFilter } from '@/types/marketplace';
import marketplaceService from '@/services/MarketplaceService';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<ProductFilter>({});
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const categories = [
    'Paper',
    'Plastic',
    'Metal',
    'Electronics',
    'Glass',
    'Textile',
    'Others'
  ];

  const conditions = [
    'Recyclable',
    'Reusable',
    'Needs Processing',
    'For Parts'
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await marketplaceService.getProducts(filters);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProductFilter, value: string | number | undefined) => {
    if (value === '' || value === undefined) {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleAddProduct = () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    router.push('/marketplace/add');
  };

  

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
  <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4 md:mb-0">Marketplace</h1>
  {isAuthenticated && (
    <div className="flex flex-row md:flex-row gap-x-16 md:gap-0 md:space-y-0 md:space-x-4">
      <button
        onClick={() => router.push('/marketplace/my-products')}
        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        My Products
      </button>
      <button
        onClick={handleAddProduct}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Add Product
      </button>
    </div>
  )}
</div>

        {/* Interactive Banner Section */}
        <div className="relative w-full mb-8 bg-green-600 rounded-lg overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-green-600 to-green-500 opacity-80"></div>
  <motion.img
    src="./image/Marketplace.png"
    alt="Interactive Banner"
    className="w-full h-52 object-cover opacity-60"
    initial={{ scale: 1 }}
    animate={{ scale: 1.05 }}
    transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
  />
  <motion.div
    className="relative z-10 p-6 flex flex-col justify-center items-center text-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
      Welcome to the LeafStyle Marketplace!
    </h2>
    <p className="text-white text-sm md:text-base">
      Discover and trade sustainable products for a better tomorrow.
    </p>
    <motion.button
      className="mt-4 px-6 py-2 bg-white text-green-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-transform transform"
      whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(0, 128, 0, 0.5)" }}
      whileTap={{ scale: 0.95 }}
      onClick={() => alert("Explore now!")}
    >
      Explore Now
    </motion.button>
  </motion.div>
</div>


        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-4 border-green-200">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                onChange={(e) => handleFilterChange('category', e.target.value)}
                value={filters.category || ''}
              >
                <option value="">All Categories</option>
                {categories.map(category=> (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                value={filters.condition || ''}
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 rounded-md border border-gray-300 p-2"
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  value={filters.minPrice || ''}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 rounded-md border border-gray-300 p-2"
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  value={filters.maxPrice || ''}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setFilters({})}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <p>Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {!loading && products.map((product) => (
    <motion.div
      key={product.id}
      className="bg-white rounded-lg shadow-md overflow-hidden relative transform transition-all hover:scale-105 hover:translate-y-2 hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className={`w-full h-48 object-cover ${
            product.status === 'sold' ? 'opacity-50' : ''
          }`}
        />
        {product.status === 'sold' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold transform -rotate-45">
              SOLD
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 transition-colors group-hover:text-green-600">{product.title}</h3>
        <p className="text-green-600 font-bold mt-2">
          Rp {product.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">{product.location}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">{product.condition}</span>
          <button 
            onClick={() => router.push(`/marketplace/${product.id}`)}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              product.status === 'sold'
                ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  ))}
</div>




      </div>
    </div>
  );
};

export default Marketplace; 