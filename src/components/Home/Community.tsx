"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, QuerySnapshot, DocumentData, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { Calendar } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { ArrowRight } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Users } from "lucide-react";
import { motion } from "framer-motion"; // Import motion
import { toast } from "react-toastify";
// import { useRouter } from "next/router";

export type Event = {
    id: string;
    eventType: string;
    contactNumber: string;
    location: string;
    title: string;
    description: string;
    details: string;
    date: string;
    organizer: string;
    image: string;
    isAttended?: boolean;
};

export const fetchEvents = async (userId: string | null): Promise<Event[]> => {
    try {
        const eventsCollection = collection(db, "event");
        const eventsQuery = query(eventsCollection, orderBy("date"));
        const eventSnapshot: QuerySnapshot<DocumentData> = await getDocs(eventsQuery);

        const events = eventSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Event[];

        if (userId) {
            const attendanceCollection = collection(db, "attendance");
            const attendanceQuery = query(attendanceCollection, where("userId", "==", userId));
            const attendanceSnapshot: QuerySnapshot<DocumentData> = await getDocs(attendanceQuery);

            const attendedEventIds = new Set(
                attendanceSnapshot.docs.map((doc) => doc.data().eventId as string)
            );

            return events.map((event) => ({
                ...event,
                isAttended: attendedEventIds.has(event.id),
            }));
        }

        return events;
    } catch (error) {
        console.error("Error fetching events: ", error);
        toast.error("Failed to fetch events", {
            icon: "❌",
            style: {
                background: "linear-gradient(to right, #ef4444, #dc2626)",
                color: "white",
                borderRadius: "1rem",
            }
        });
        throw new Error("Failed to fetch events");
    }
};

const CommunitySection = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // State for error handling
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);
    useEffect(() => {
        const fetchAndSetEvents = async () => {
            setIsLoading(true);
            setError(null); // Reset error state before fetching
            try {
                const fetchedEvents = await fetchEvents(userId);
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Failed to fetch events", error);
                setError("Gagal memuat data event. Coba lagi nanti.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetEvents();
    }, [userId]);

    return (
        <section className="min-h-screen bg-gradient-to-b from-yellow-200 to-green-300 py-16 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-green-600 mb-4"
                        initial={{ opacity: 0, y: -50 }} // Mulai dari opacity 0 dan posisi vertikal di atas
                        animate={{ opacity: 1, y: 0 }} // Pindah ke posisi normal dan opacity 1
                        transition={{ duration: 1 }}
                    >
                        Bergabung dengan Komunitas Kami
                    </motion.h2>
                    <motion.p
                        className="text-lg text-green-800 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        Temukan teman baru, berbagi pengalaman, dan ikuti event-event menarik bersama komunitas kami.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all hover:scale-105 hover:shadow-xl"
                        initial={{ opacity: 0, x: -100 }} // Mulai dari posisi kiri
                        animate={{ opacity: 1, x: 0 }} // Pindah ke posisi normal
                        transition={{ duration: 1 }}
                    >
                        <div className="flex items-center mb-6">
                            <MessageCircle className="w-8 h-8 text-green-500 mr-3" />
                            <h3 className="text-2xl font-semibold text-gray-800">Chat Komunitas</h3>
                        </div>
                        <img
                            src="./image/community.png"
                            alt="Gambar Chat Komunitas"
                            className="w-full h-40 rounded-lg mb-6 object-cover"
                        />
                        <p className="text-gray-600 mb-6">
                            Bergabunglah dalam obrolan seru bersama para kolektor, seniman, dan pecinta barang vintage.
                            Diskusikan tentang hobi, berbagi tips, atau temukan barang impianmu!
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-end">
                                <Users className="w-5 h-5 text-green-500 mr-2" />
                                <span className="text-sm text-gray-500">1.2k+ Members Online</span>
                            </div>
                            <button className="flex items-center text-green-500 hover:text-green-600 font-medium transform transition-all hover:translate-x-1">
                                Gabung Chat <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all hover:scale-105 hover:shadow-xl"
                        initial={{ opacity: 0, x: 100 }} // Mulai dari posisi kanan
                        animate={{ opacity: 1, x: 0 }} // Pindah ke posisi normal
                        transition={{ duration: 1 }}
                    >
                        <div className="flex items-center mb-6">
                            <Calendar className="w-8 h-8 text-green-500 mr-3" />
                            <h3 className="text-2xl font-semibold text-gray-800">Event Mendatang</h3>
                        </div>
                        {isLoading ? (
                            <p className="text-center text-gray-600">Memuat...</p>
                        ) : error ? (
                            <p className="text-center text-red-600">{error}</p> // Tampilkan error di UI
                        ) : events.length > 0 ? (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        className="border-l-4 border-green-500 pl-4 py-2 transform transition-all hover:scale-105 hover:bg-green-50 rounded-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                                            {event.isAttended && (
                                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                                    Attended
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-sm text-gray-500">
                                                {event.date} • {event.details}
                                            </div>
                                            <span
                                                className={`text-xs px-4 py-1 rounded-full mx-2 ${
                                                    event.eventType === "Online"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-green-100 text-green-600"
                                                }`}
                                            >
                                                {event.eventType}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">📍 {event.location}</div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600">Tidak ada event tersedia.</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;
