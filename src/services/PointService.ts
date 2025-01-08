import { collection, doc, getDoc, getDocs, query, orderBy, limit, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";

export interface PointTransaction {
  id: string;
  userId: string;
  userName: string;
  points: number;
  reason: string;
  timestamp: string;
  type: 'POST_REWARD' | 'EVENT_ATTENDANCE' | 'MARKETPLACE_SALE' | 'SCAN_RECYCLABLE_ITEM' | 'OTHER';
}

export interface UserPoints {
  userId: string;
  userName: string;
  totalPoints: number;
  lastUpdated: string;
  lastScanDate?: string;
  dailyScanCount?: number;
}

class PointService {
  async addPoints(
    points: number, 
    reason: string, 
    type: PointTransaction['type'] = 'OTHER',
    targetUserId?: string
  ): Promise<void> {
    const userId = targetUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) throw new Error("User not found");
      
      const userData = userDoc.data();
      const currentPoints = userData.points || 0;
      const userName = userData.name || "Anonymous";

      // Create point transaction record
      await addDoc(collection(db, "pointTransactions"), {
        userId,
        userName,
        points,
        reason,
        type,
        timestamp: new Date().toISOString()
      });

      // Update user's total points
      await updateDoc(userRef, {
        points: currentPoints + points,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding points:", error);
      throw error;
    }
  }

  async getRemainingDailyScans(): Promise<number> {
    if (!auth.currentUser) throw new Error("User not authenticated");

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (!userDoc.exists()) throw new Error("User not found");

      const userData = userDoc.data();
      const today = new Date().toISOString().split('T')[0];
      const scanLimit = userData.dailyScanLimit || 2;

      if (userData.lastScanDate !== today) {
        return scanLimit;
      }

      return Math.max(0, scanLimit - (userData.dailyScanCount || 0));
    } catch (error) {
      console.error("Error checking remaining scans:", error);
      throw error;
    }
  }

  async getUserPointHistory(userId?: string): Promise<PointTransaction[]> {
    const targetUserId = userId || auth.currentUser?.uid;
    if (!targetUserId) throw new Error("User ID not provided");

    try {
      const q = query(
        collection(db, "pointTransactions"),
        where("userId", "==", targetUserId),
        orderBy("timestamp", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PointTransaction[];
    } catch (error) {
      console.error("Error fetching point history:", error);
      throw error;
    }
  }

  async getLeaderboard(limit: number = 10): Promise<UserPoints[]> {
    try {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("points", "desc"),
        limit(limit)
      );

      const snapshot = await getDocs(usersQuery);
      return snapshot.docs.map(doc => ({
        userId: doc.id,
        userName: doc.data().name || "Anonymous",
        totalPoints: doc.data().points || 0,
        lastUpdated: doc.data().lastUpdated?.toDate?.().toISOString() || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
  }

  async getUserPoints(userId?: string): Promise<number> {
    const targetUserId = userId || auth.currentUser?.uid;
    if (!targetUserId) throw new Error("User ID not provided");

    try {
      const userDoc = await getDoc(doc(db, "users", targetUserId));
      if (!userDoc.exists()) throw new Error("User not found");
      return userDoc.data().points || 0;
    } catch (error) {
      console.error("Error fetching user points:", error);
      throw error;
    }
  }
}

const pointService = new PointService();
export default pointService; 