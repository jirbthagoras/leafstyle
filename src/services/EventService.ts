import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebase/config"; // Assuming you defined Event type in the same file

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

// Function to fetch events from Firebase Firestore
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
        throw error; // You can handle this error in the UI if needed
    }
};
