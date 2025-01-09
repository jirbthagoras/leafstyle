'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/config'
import { checkIsAdmin } from '@/lib/firebase/admin'
import { onAuthStateChanged } from 'firebase/auth'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Quick Links</h2>
          <nav className="space-y-3">
            <a href="/admin/event" className="block text-blue-600 hover:text-blue-800">
              Manage Events
            </a>
            <a href="/admin/products" className="block text-blue-600 hover:text-blue-800">
              Manage Products
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
} 