'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc, deleteDoc, doc, getFirestore, getDocs } from 'firebase/firestore'
import { auth } from '@/lib/firebase/config'
import { checkIsAdmin } from '@/lib/firebase/admin'
import { onAuthStateChanged } from 'firebase/auth'
import { fetchEvents } from '@/services/EventService'
import { motion } from 'framer-motion'
import { Trash2, Plus, Calendar, MapPin, Users, X } from 'lucide-react'
import { uploadImage } from '@/services/UploadImgService'

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  eventType: string;
  speaker: string;
  schedule: string;
  image: string;
}

export default function AdminEvents() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [eventType, setEventType] = useState('Online')
  const [speaker, setSpeaker] = useState('')
  const [schedule, setSchedule] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

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
      setLoading(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const db = getFirestore()
      await addDoc(collection(db, 'event'), {
        title,
        date,
        description,
        location,
        eventType,
        speaker,
        schedule,
        image,
        createdAt: new Date().toISOString()
      })

      setTitle('')
      setDate('')
      setDescription('')
      setLocation('')
      setEventType('Online')
      setSpeaker('')
      setSchedule('')
      setImage('')
      setShowForm(false)
      loadEvents()
      setImagePreview('')
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

  const handleImageUpload = async (file: File): Promise<string> => {
    const imageUrl = await uploadImage(file, {
      uploadPreset: 'recycling_app_uploads',
      folder: 'events'
    })
    return imageUrl
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      // Upload image and get URL
      const imageUrl = await handleImageUpload(file)
      setImage(imageUrl)
    } catch (error) {
      console.error('Error handling file:', error)
      alert('Failed to upload image. Please try again.')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  } 

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Event
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
                <input
                  type="text"
                  placeholder="Speaker"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Schedule"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Image
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Choose Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                  </div>
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('')
                          setImage('')
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg h-32"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Create Event
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={event.image || '/default-event.jpg'}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{event.speaker}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    event.eventType === 'Online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {event.eventType}
                  </span>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 