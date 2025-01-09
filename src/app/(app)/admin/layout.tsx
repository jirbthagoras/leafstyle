'use client'
import { FC, ReactNode, useState } from 'react'
import { Home, Package, Calendar, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/product' },
    { icon: Calendar, label: 'Events', href: '/admin/event' },
  ]
  const router = useRouter()

  const handleBack = () => {
    router.push('/')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Hamburger */}
      <header className="md:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          </div>
          <button onClick={toggleSidebar} className="p-2">
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center gap-3 px-6 py-4 border-b">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors group"
              >
                <item.icon className="w-5 h-5 group-hover:text-green-500" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full"
              onClick={handleBack}
            >
              <LogOut className="w-5 h-5" />
              <span>Back to Site</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleSidebar}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 md:hidden"
            >
              <div className="flex flex-col h-full pt-16">
                <nav className="flex-1 px-4 py-6 space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={toggleSidebar}
                      className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors group"
                    >
                      <item.icon className="w-5 h-5 group-hover:text-green-500" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>

                <div className="p-4 border-t">
                  <button 
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full"
                    onClick={handleBack}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Back to Site</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="md:ml-64">
        <main className="p-4 md:p-8 mt-16 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 