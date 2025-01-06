"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/types/marketplace';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import marketplaceService from '@/services/MarketplaceService';
import Image from 'next/image';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
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
    const loadTransactions = async () => {
      if (isAuthenticated === null) return; // Wait for auth check
      if (!isAuthenticated) return; // Don't load if not authenticated

      try {
        setLoading(true);
        const userTransactions = await marketplaceService.getTransactionHistory(filter);
        setTransactions(userTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [filter, isAuthenticated]);

  if (isAuthenticated === null || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-600';
      case 'pending':
        return 'border-yellow-500';
      case 'failed':
        return 'border-red-600';
      default:
        return 'border-gray-400';
    }
  };

  const renderTransactionCard = (transaction: Transaction) => {
    const isBuyer = auth.currentUser?.uid === transaction.buyerId;
    
    return (
      <motion.div
        key={transaction.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getBorderColor(transaction.status)}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={transaction.productImage}
              alt={transaction.productTitle}
              width={64}
              height={64}
              className="object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-lg">{transaction.productTitle}</h3>
              <p className="text-green-600 font-bold">
                Rp {typeof transaction.price === 'number' ? transaction.price.toLocaleString() : '0'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
            <p className="text-sm text-gray-500 mt-2">{isBuyer ? 'Purchase' : 'Sale'}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p>{isBuyer ? 'Purchase Date:' : 'Sale Date:'}</p>
            <p className="font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p>Shipping Address:</p>
            <p className="font-medium">{transaction.customerDetails.address}</p>
          </div>
        </div>
      </motion.div>
    );
  };

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

        <h1 className="text-3xl font-bold text-green-600 mb-8">Transaction History</h1>

        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setFilter('buying')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'buying' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Purchases
          </button>
          <button
            onClick={() => setFilter('selling')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'selling' ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            Sales
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => renderTransactionCard(transaction))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
