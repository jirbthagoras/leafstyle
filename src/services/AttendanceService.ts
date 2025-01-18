import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Add attendance with string IDs
export const addAttendance = async (
    eventId: string,
    userId: string,
    userName: string,
    userContact: string
): Promise<void> => {
    try {
        const attendanceRef = collection(db, "attendance");

        await addDoc(attendanceRef, {
            eventId,                // Event ID as a string
            userId,                 // User ID as a string
            userName,               // Name of the user
            userContact,            // Contact information of the user
            timestamp: serverTimestamp(), // Creation timestamp
        });

        console.log("Attendance added successfully.");
    } catch (error) {
        console.error("Error adding attendance:", error);
        throw error;
    }
};

// Check if a user has attended an event
export const checkAttendance = async (eventId: string, userId: string): Promise<boolean> => {
    try {
        const attendanceQuery = query(
            collection(db, "attendance"),
            where("eventId", "==", eventId),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(attendanceQuery);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking attendance:", error);
        throw new Error("Failed to check attendance.");
    }
};


// Delete a user's attendance for a specific event
export const deleteAttendance = async (eventId: string, userId: string): Promise<void> => {
    try {
        const attendanceQuery = query(
            collection(db, "attendance"),
            where("eventId", "==", eventId),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(attendanceQuery);

        if (querySnapshot.empty) {
            console.warn("No matching attendance record found.");
            throw new Error("Attendance record not found.");
        }

        for (const docSnap of querySnapshot.docs) {
            await deleteDoc(docSnap.ref);
        }

        console.log("Attendance deleted successfully.");
    } catch (error) {
        console.error("Error deleting attendance:", error);
        throw new Error("Failed to delete attendance.");
    }
};
