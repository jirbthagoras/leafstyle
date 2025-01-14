import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/config"; // Assuming you defined Event type in the same file
import { toast } from "react-toastify";
import { toastError } from "@/utils/toastConfig";

export type Event = {
    eventType: string;
    contactNumber: string;
    location: string;
    id: number;
    title: string;
    description: string;
    details: string;
    date: string;
    organizer: string;
    image: string;
};

export const fetchEvents = async (): Promise<Event[]> => {
    try {
        const eventsCollection = collection(db, "event"); // Replace "events" with your Firestore collection name
        const snapshot = await getDocs(eventsCollection);
        return snapshot.docs.map((doc) => ({
            id: doc.id, // Use Firestore document ID as event ID
            ...doc.data(),
        })) as unknown as Event[];
    } catch (error) {
        console.error("Error fetching events: ", error);
        toastError("Failed to fetch events")
        throw error;
    }
};