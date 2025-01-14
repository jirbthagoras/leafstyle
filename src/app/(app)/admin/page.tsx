'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { checkIsAdmin } from '@/lib/firebase/admin';
import { onAuthStateChanged } from 'firebase/auth';
import { FaCalendarAlt, FaShoppingCart } from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth');
        return;
      }

      const isAdmin = await checkIsAdmin(user.uid);
      if (!isAdmin) {
        router.push('/');
        return;
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Events Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
                <FaCalendarAlt size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Manage Events</h2>
                <p className="text-gray-600">Create, update, or delete events easily.</p>
              </div>
            </div>
            <a
              href="/admin/event"
              className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Go to Events
            </a>
          </div>

          {/* Manage Products Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-green-100 text-green-600 rounded-full">
                <FaShoppingCart size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Manage Products</h2>
                <p className="text-gray-600">Add, update, or remove products in your store.</p>
              </div>
            </div>
            <a
              href="/admin/products"
              className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Go to Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
