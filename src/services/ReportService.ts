import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { Report } from "@/types/marketplace";
import { toastError, toastSuccess } from '@/utils/toastConfig';

class ReportService {
  async createReport(data: {
    productId: string;
    productTitle: string;
    productImage: string;
    sellerId: string;
    reason: string;
    transactionId: string;
  }): Promise<string> {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      const report = {
        ...data,
        buyerId: auth.currentUser.uid,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "reports"), report);
      return docRef.id;
    } catch (error) {
      console.error("Error creating report:", error);
      toastError("Failed to create report");
      throw error;
    }
  }

  async getAllReports(): Promise<Report[]> {
    try {
      const q = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];
    } catch (error) {
      console.error("Error fetching reports:", error);
      toastError("Failed to fetch reports");
      throw error;
    }
  }

  async updateReportStatus(
    reportId: string, 
    status: 'resolved' | 'rejected',
    adminResponse: string
  ): Promise<void> {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status,
        adminResponse,
        updatedAt: new Date().toISOString()
      });

      // Add real-time update functionality
      const reportSnapshot = await getDoc(reportRef);
      if (reportSnapshot.exists()) {
        const updatedReport = {
          id: reportSnapshot.id,
          ...reportSnapshot.data()
        };
        console.log('Updated Report:', updatedReport);
      }
    } catch (error) {
      console.error("Error updating report:", error);
      toastError("Failed to update report");
      throw error;
    }
  }

  async getUserReports(userId: string): Promise<Report[]> {
    try {
      const q = query(
        collection(db, "reports"),
        where("buyerId", "==", userId),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(q);
      const reports = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          transactionId: data.transactionId,
          productId: data.productId,
          productTitle: data.productTitle,
          productImage: data.productImage,
          buyerId: data.buyerId,
          sellerId: data.sellerId,
          reason: data.reason,
          status: data.status,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          adminResponse: data.adminResponse
        } as Report;
      });

      console.log('Fetched Reports:', reports); // Debug log
      return reports;
    } catch (error) {
      console.error("Error fetching user reports:", error);
      toastError("Failed to fetch reports");
      throw error;
    }
  }
}

const reportService = new ReportService();
export default reportService; 