"use client";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Event, fetchEvents } from "@/services/EventService";
import { addAttendance, deleteAttendance } from "@/services/AttendanceService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const EventPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isDetailView, setIsDetailView] = useState(false);
    const [formData, setFormData] = useState({ nama: "", kontak: "" });
    const [userId, setUserId] = useState<string | null>(null);
    const [userAttendances, setUserAttendances] = useState<Record<string, boolean>>({});

    // Fetch the user's ID from Firebase Auth
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

    // Fetch events on component mount
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
        <section className="min-h-screen bg-gradient-to-br from-green-200 to-yellow-50 py-16 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl mt-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Acara Mendatang</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Jangan lewatkan kesempatan untuk belajar, berjejaring, dan berbagi ide dalam berbagai acara menarik kami.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden"
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
                                className="absolute bottom-0 left-0 w-full bg-green-50 text-gray-700 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
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
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">{selectedEvent.title}</h2>
                        <p className="text-gray-700 mb-2">
                            <strong>Tanggal:</strong> {selectedEvent.date}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Panitia Penyelenggara:</strong> {selectedEvent.organizer}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Contact Number: </strong> {selectedEvent.contactNumber}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Location: </strong> {selectedEvent.location}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Type: </strong> {selectedEvent.eventType}
                        </p>
                        <p className="text-gray-700 mb-4">
                            <strong>Description: </strong> {selectedEvent.description}
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-red-500 flex items-center text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                onClick={() => setSelectedEvent(null)}
                            >
                                <X /> Close
                            </button>
                            {!isDetailView && (
                                <button
                                    className="bg-blue-500 flex items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                    onClick={() => setShowForm(true)}
                                >
                                    <ArrowRight /> Attend
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Form Pendaftaran</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Nama</label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Masukkan nama Anda"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Kontak</label>
                                <input
                                    type="text"
                                    value={formData.kontak}
                                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Masukkan kontak Anda"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="bg-red-500 flex justify-center text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    onClick={() => setShowForm(false)}
                                >
                                    <X /> Batal
                                </button>
                                <button
                                    type="button"
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                    onClick={handleFormSubmit}
                                >
                                    Kirim
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default EventPage;
