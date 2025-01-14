import { collection, doc, getDoc, getDocs, query, orderBy, limit, where, addDoc, updateDoc, serverTimestamp, runTransaction } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { toastSuccess, toastWarning } from "@/utils/toastConfig";
import { toastError } from "@/utils/toastConfig";

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
  streak: number;
  userId: string;
  userName: string;
  totalPoints: number;
  lastUpdated: string;
  lastScanDate?: string;
  dailyScanCount?: number;
}

class PointService {
  private readonly STREAK_RESET_HOUR = 0; // Midnight UTC
  
  async addPoints(
    points: number, 
    reason: string, 
    type: PointTransaction['type'] = 'OTHER',
    targetUserId?: string
  ): Promise<void> {
    const userId = targetUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    try {
      await this.updateStreak(userId);
      
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

      toastSuccess(`+${points} poin ditambahkan! 🌟`)
    } catch (error) {
      console.error("Error adding points:", error);
      toastError('Gagal menambahkan poin')
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
      toastError("Failed to check remaining scans. Please try again.")
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
      toastError("Failed to fetch point history. Please try again.")
      throw error;
    }
  }

  async getLeaderboard(limitCount: number = 10): Promise<UserPoints[]> {
    try {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("points", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(usersQuery);
      return snapshot.docs.map(doc => ({
        userId: doc.id,
        userName: doc.data().name || "Anonymous",
        totalPoints: doc.data().points || 0,
        streak: doc.data().streak || 0,
        lastUpdated: doc.data().lastUpdated?.toDate?.().toISOString() || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toastError("Failed to fetch leaderboard")
      throw error;
    }
  }

  async getUserPoints(userId?: string): Promise<number> {
    try {
      const targetUserId = userId || auth.currentUser?.uid;
      if (!targetUserId) throw new Error("User ID not provided");

      const userRef = doc(db, "users", targetUserId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return 0;
      }
      
      return userDoc.data().points || 0;
    } catch (error) {
      console.error("Error fetching user points:", error);
      toastError("Failed to fetch user points. Please try again.")
      throw error;
    }
  }

  async getUserStreak(userId?: string): Promise<number> {
    const targetUserId = userId || auth.currentUser?.uid;
    if (!targetUserId) throw new Error("User ID not provided");

    try {
      const userDoc = await getDoc(doc(db, "users", targetUserId));
      if (!userDoc.exists()) throw new Error("User not found");
      return userDoc.data().streak || 0;
    } catch (error) {
      console.error("Error fetching user streak:", error);
      toastError("Failed to fetch user streak. Please try again.")
      throw error;
    }
  }

  async updateStreak(userId?: string): Promise<void> {
    try {
      const targetUserId = userId || auth.currentUser?.uid;
      if (!targetUserId) throw new Error("User ID not provided");

      const userRef = doc(db, "users", targetUserId);
      
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) return;
        
        const userData = userDoc.data();
        const now = new Date();
        
        // Get last activity date and normalize to local midnight
        const lastActivity = userData.lastActivityDate?.toDate() || new Date(0);
        const lastMidnight = new Date(lastActivity);
        lastMidnight.setHours(this.STREAK_RESET_HOUR, 0, 0, 0);
        
        // Get current date normalized to local midnight
        const todayMidnight = new Date(now);
        todayMidnight.setHours(this.STREAK_RESET_HOUR, 0, 0, 0);
        
        // Calculate days between last activity and now
        const diffDays = Math.floor(
          (todayMidnight.getTime() - lastMidnight.getTime()) / 
          (1000 * 60 * 60 * 24)
        );

        let newStreak = userData.streak || 0;
        let streakStatus: 'maintained' | 'increased' | 'broken' = 'maintained';
        
        if (diffDays === 1) {
          // Perfect streak - activity on consecutive days
          newStreak += 1;
          streakStatus = 'increased';
        } else if (diffDays === 2) {
          // Missed exactly one day - streak breaks
          newStreak = 0;
          streakStatus = 'broken';
          
          toastWarning("Streak broken! You missed yesterday")
        } else if (diffDays > 2) {
          // More than one day missed - already broken, start new streak
          newStreak = 1;
          streakStatus = 'maintained';
        } else if (diffDays === 0) {  
          // Same day activity - no streak update needed
          return;
        }

        // Update user document
        transaction.update(userRef, {
          streak: newStreak,
          lastActivityDate: serverTimestamp(),
          highestStreak: Math.max(newStreak, userData.highestStreak || 0),
          lastStreakUpdate: {
            date: serverTimestamp(),
            status: streakStatus
          }
        });

        // Log streak change
        const streakLogRef = collection(db, "streakLogs");
        transaction.set(doc(streakLogRef), {
          userId: targetUserId,
          oldStreak: userData.streak || 0,
          newStreak,
          status: streakStatus,
          timestamp: serverTimestamp(),
          diffDays
        });
      });

    } catch (error) {
      console.error("Error updating streak:", error);
      throw error;
    }
  }

  async checkStreakStatus(userId?: string): Promise<{
    isActive: boolean;
    daysUntilBreak: number;
    lastUpdate: Date;
  } | null> {
    try {
      const targetUserId = userId || auth.currentUser?.uid;
      if (!targetUserId) {
        return null; // Return null instead of throwing error
      }

      const userDoc = await getDoc(doc(db, "users", targetUserId));
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      const lastActivity = userData.lastActivityDate?.toDate();
      
      if (!lastActivity) {
        return {
          isActive: false,
          daysUntilBreak: 0,
          lastUpdate: new Date()
        };
      }

      const now = new Date();
      const lastMidnight = new Date(lastActivity);
      lastMidnight.setHours(this.STREAK_RESET_HOUR, 0, 0, 0);
      
      const todayMidnight = new Date(now);
      todayMidnight.setHours(this.STREAK_RESET_HOUR, 0, 0, 0);
      
      const diffHours = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60));
      const diffDays = Math.floor((todayMidnight.getTime() - lastMidnight.getTime()) / (1000 * 60 * 60 * 24));
      
      const hoursUntilBreak = 48 - diffHours;
      
      return {
        isActive: diffDays <= 1,
        daysUntilBreak: Math.ceil(hoursUntilBreak / 24),
        lastUpdate: lastActivity
      };
    } catch (error) {
      console.error("Error checking streak status:", error);
      return null;
    }
  }
}

const pointService = new PointService();
export default pointService; 