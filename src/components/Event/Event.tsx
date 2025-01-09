"use client";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Event, fetchEvents } from "@/services/EventService";
import { addAttendance, deleteAttendance } from "@/services/AttendanceService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { motion } from "framer-motion"; // Import framer-motion

const EventPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isDetailView, setIsDetailView] = useState(false);
    const [formData, setFormData] = useState({ nama: "", kontak: "" });
    const [userId, setUserId] = useState<string | null>(null);
    const [userAttendances, setUserAttendances] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState("deskripsi"); // State untuk tab aktif

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log(user?.uid);
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setUserAttendances({});
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const loadEvents = async () => {
            const data = await fetchEvents();
            setEvents(data);
        };
        loadEvents();
    }, []);

    useEffect(() => {
        const fetchUserAttendances = async () => {
            if (!userId) return;

            try {
                const attendanceQuery = query(
                    collection(db, "attendance"),
                    where("userId", "==", userId)
                );
                const querySnapshot = await getDocs(attendanceQuery);

                const attendanceStatuses: Record<string, boolean> = {};
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.eventId) {
                        attendanceStatuses[data.eventId] = true;
                    }
                });

                setUserAttendances(attendanceStatuses);
            } catch (error) {
                console.error("Error fetching user attendances:", error);
            }
        };

        fetchUserAttendances();
    }, [userId]);

    const handleFormSubmit = async () => {
        if (!selectedEvent || !userId) {
            alert("You must be logged in to attend an event.");
            return;
        }

        try {
            await addAttendance(
                selectedEvent.id,
                userId,
                formData.nama,
                formData.kontak
            );
            setFormData({ nama: "", kontak: "" });
            setShowForm(false);
            setSelectedEvent(null);
            setUserAttendances((prev) => ({
                ...prev,
                [selectedEvent.id]: true,
            }));
        } catch (error) {
            console.error("Error recording attendance:", error);
            alert("Failed to record attendance. Please try again.");
        }
    };

    const handleCancelAttendance = async (eventId: string) => {
        if (!userId) {
            alert("You must be logged in to cancel attendance.");
            return;
        }

        try {
            await deleteAttendance(eventId, userId);
            setUserAttendances((prev) => ({
                ...prev,
                [eventId]: false,
            }));
        } catch (error) {
            console.error("Error canceling attendance:", error);
            alert("Failed to cancel attendance. Please try again.");
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-green-200 to-yellow-50 py-16 px-4 md:px-8"
        >
            <div className="container mx-auto max-w-6xl mt-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Acara Mendatang</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Jangan lewatkan kesempatan untuk belajar, berjejaring, dan berbagi ide dalam berbagai acara menarik kami.
                    </p>
                </div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.3 }
                        }
                    }}
                >
                    {events.map((event) => (
                        <motion.div
                            key={event.id}
                            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1 }
                            }}
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        >
                            <div className="relative">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                                    <p className="text-gray-600">{event.description}</p>
                                </div>
                            </div>

                            <div
                                className="absolute bottom-0 left-0 w-full bg-green-50 text-gray-700 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"
                            >
                                <p className="text-sm">{event.details}</p>
                                {userAttendances[event.id.toString()] ? (
                                    <div>
                                        <button
                                            className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                                            onClick={() => handleCancelAttendance(event.id.toString())}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setIsDetailView(true);
                                            }}
                                        >
                                            Detail
                                        </button>
                                        <button
                                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setIsDetailView(false);
                                            }}
                                        >
                                            Attend
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Modal */}
            {selectedEvent && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-gradient-to-r from-green-100 to-yellow-50 rounded-lg p-6 w-11/12 md:w-1/2">
                        <h2 className="text-3xl text-center font-bold text-green-600 mb-4">{selectedEvent.title}</h2>
                        <div className="mb-4">
                            <div className="flex justify-around border-b">
                                <button
                                    onClick={() => setActiveTab("deskripsi")}
                                    className={`px-4 py-2 ${activeTab === "deskripsi" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"}`}
                                >
                                    Deskripsi
                                </button>
                                <button
                                    onClick={() => setActiveTab("pembicara")}
                                    className={`px-4 py-2 ${activeTab === "pembicara" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"}`}
                                >
                                    Pembicara
                                </button>
                                <button
                                    onClick={() => setActiveTab("jadwal")}
                                    className={`px-4 py-2 ${activeTab === "jadwal" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"}`}
                                >
                                    Jadwal
                                </button>
                                <button
                                    onClick={() => setActiveTab("attend")}
                                    className={`px-4 py-2 ${activeTab === "attend" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"}`}
                                >
                                    Attend
                                </button>
                            </div>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
{activeTab === "deskripsi" && (
  <motion.div
  className="max-w-3xl mx-auto mt-8 mb-6 px-4 bg-gradient-to-r from-green-100 to-yellow-50 
      rounded-lg shadow-lg border border-gray-200 p-6 text-center font-semibold"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
      {selectedEvent.description}
  </p>
  </motion.div>
)}
                                {activeTab === "pembicara" && (
                                     <motion.div
                                     className="max-w-3xl mx-auto mt-8 mb-6 px-4 bg-gradient-to-r from-green-100 to-yellow-50 
                                         rounded-lg shadow-lg border border-gray-200 p-6 text-center font-semibold"
                                     initial={{ opacity: 0, y: 20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     transition={{ duration: 0.4, ease: "easeOut" }}
                                 >
                                     <h2 className="text-gray-700 text-2xl leading-relaxed whitespace-pre-line">
                                         {selectedEvent.speaker}
                                     </h2>
                                     </motion.div>
                                )}
                               {activeTab === "jadwal" && (
    <motion.div
        className="max-w-3xl mx-auto mt-8 mb-6 px-4 bg-gradient-to-r from-green-100 to-yellow-50 
            rounded-lg shadow-lg border border-gray-200 p-6 text-center font-semibold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
    >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Jadwal Acara</h3>
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
            {selectedEvent.schedule}
        </p>
        <div className="mt-6 text-right">
        </div>
    </motion.div>
)}

{activeTab === "attend" && !userAttendances[selectedEvent.id.toString()] && (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8 bg-gradient-to-r from-green-100 to-yellow-50">
        <div className="space-y-4">
            {/* Name Input */}
            <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama
                </label>
                <input
                    id="nama"
                    type="text"
                    placeholder="Masukkan nama Anda"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>

            {/* Phone Input */}
            <div>
                <label htmlFor="kontak" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                </label>
                <input
                    id="kontak"
                    type="tel"
                    placeholder="Masukkan nomor telepon"
                    value={formData.kontak}
                    onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, kontak: value });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            </div>

            {/* Submit Button */}
            <button
                className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
                onClick={handleFormSubmit}
            >
                Submit
            </button>
        </div>
    </div>
)}
                            </motion.div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-red-500 flex items-center text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                onClick={() => setSelectedEvent(null)}
                            >
                                <X /> Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.section>
    );
};

export default EventPage;
