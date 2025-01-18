import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/config";
import { toastError } from "@/utils/toastConfig";

export type BaseEvent = {
    title: string;
    date: string;
    description: string;
    details: string;
    location: string;
    eventType: string;
    speaker: string;
    schedule: string;
    image: string;
};

export type Event = BaseEvent & {
    id: string;
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