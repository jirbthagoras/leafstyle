"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    QuerySnapshot,
    DocumentData,
} from "firebase/firestore";
import {auth, db} from "@/lib/firebase/config";
import { Calendar } from "lucide-react";
import {onAuthStateChanged} from "firebase/auth";

// Define the Event type
export type Event = {
    id: string; // Firestore document ID
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

            const attendanceQuery = query(
                attendanceCollection,
                where("userId", "==", userId)
            );
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
        throw error;
    }
};

const CommunitySection = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null); // State to hold userId

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid); // Set userId if user is logged in
            } else {
                setUserId(null); // Clear userId if no user is logged in
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const fetchAndSetEvents = async () => {
            setIsLoading(true);
            try {
                const fetchedEvents = await fetchEvents(userId);
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndSetEvents();
    }, [userId]);

    return (
        <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-100 py-16 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
                        Bergabung dengan Komunitas Kami
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Temukan teman baru, berbagi pengalaman, dan ikuti event-event menarik bersama komunitas kami.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center mb-6">
                            <Calendar className="w-8 h-8 text-green-500 mr-3" />
                            <h3 className="text-2xl font-semibold text-gray-800">Event Mendatang</h3>
                        </div>
                        {isLoading ? (
                            <p className="text-center text-gray-600">Memuat...</p>
                        ) : events.length > 0 ? (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="border-l-4 border-green-500 pl-4 py-2 transform transition-all hover:scale-105 hover:bg-green-50 rounded-lg"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-800">
                                                {event.title}
                                            </h4>
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
                                        <div className="text-sm text-gray-500 mt-1">
                                            📍 {event.location}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600">Tidak ada event tersedia.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;
