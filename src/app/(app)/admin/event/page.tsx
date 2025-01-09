'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { auth } from '@/lib/firebase/config'
import { checkIsAdmin } from '@/lib/firebase/admin'
import { onAuthStateChanged } from 'firebase/auth'
import { fetchEvents } from '@/services/EventService'
import EventForm from '@/components/Admin/EventForm'
import EventCard from '@/components/Admin/EventCard'
import { addDoc, collection, doc, deleteDoc } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

export default function AdminEvents() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth')
        return
      }

      const isAdmin = await checkIsAdmin(user.uid)
      if (!isAdmin) {
        router.push('/')
        return
      }
      loadEvents()
    })

    return () => unsubscribe()
  }, [router])

  const loadEvents = async () => {
    try {
      const events = await fetchEvents()
      setEvents(events)
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  const handleSubmit = async (event: Event) => {
    try {
      const db = getFirestore()
      await addDoc(collection(db, 'event'), {
        ...event,
        createdAt: new Date().toISOString()
      })
      loadEvents()
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  const handleDelete = async (eventId: string) => {
    try {
      const db = getFirestore()
      await deleteDoc(doc(db, 'event', eventId))
      loadEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Event Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Event
          </motion.button>
        </div>

        {showForm && (
          <EventForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
} 