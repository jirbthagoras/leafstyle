import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Trash2 } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    location: string
    eventType: string
    speaker: string
    image: string
  }
  onDelete: (id: string) => void
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105"
    >
      <div className="relative h-48">
        <img
          src={event.image || '/default-event.jpg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{event.title}</h3>
        
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-green-600" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-green-600" />
            <span>{event.speaker}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            event.eventType === 'Online' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {event.eventType}
          </span>
          
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
} 