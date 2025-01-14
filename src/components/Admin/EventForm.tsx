import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { toastError } from '@/utils/toastConfig'

interface EventFormProps {
  onSubmit: (event: any) => void
  onCancel: () => void
  uploading?: boolean
}

export default function EventForm({ onSubmit, onCancel, uploading = false }: EventFormProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [eventType, setEventType] = useState('Online')
  const [speaker, setSpeaker] = useState('')
  const [schedule, setSchedule] = useState('')
  const [image, setImage] = useState('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      date,
      description,
      location,
      eventType,
      speaker,
      schedule,
      image
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setImage(previewUrl)
    } catch (error) {
      toastError('Failed to upload image. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 mb-8 w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Title Field */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter event title"
            />
          </div>

          {/* Date and Location Fields */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter location"
            />
          </div>

          {/* Event Type and Speaker Fields */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Speaker</label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter speaker name"
            />
          </div>

          {/* Schedule and Description Fields */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Schedule</label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter schedule details"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[100px]"
              placeholder="Enter event description"
            />
          </div>

          {/* Image Upload Section */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Event Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors w-full sm:w-auto"
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

            {/* Image Preview */}
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

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors order-1 sm:order-2"
          >
            Create Event
          </button>
        </div>
      </form>
    </motion.div>
  )
} 