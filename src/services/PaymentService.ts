import { doc } from "firebase/firestore";

import { collection, updateDoc } from "firebase/firestore";
import midtransClient from "midtrans-client";
import { db } from "@/lib/firebase/config";
import { addDoc } from "firebase/firestore";

class PaymentService {
  private readonly MIDTRANS_URL = process.env.NEXT_PUBLIC_MIDTRANS_URL;
  private readonly CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  async recordTransaction(transactionData: {
    productId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
    customerDetails: any;
  }) {
    try {
      const transactionRef = await addDoc(collection(db, "transactions"), {
        ...transactionData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return transactionRef.id;
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  }

  async updateTransactionStatus(transactionId: string, status: string) {
    try {
      const transactionRef = doc(db, "transactions", transactionId);
      await updateDoc(transactionRef, {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }


  async createPaymentToken(order: {
    productId: string;
    amount: number;
    productName: string;
    buyerId: string;
    customerDetails: {
      name: string;
      phone: string;
      email: string;
      address: string;
    }
  }) {
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) throw new Error('Failed to create payment token');
      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async validateTransactionStatus(transactionId: string): Promise<{
    status: 'success' | 'pending' | 'failed';
    orderId: string;
  }> {
    try {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY || '',
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
      });
      
      const status = await snap.transaction.status(transactionId);
      return {
        status: status.transaction_status === 'settlement' ? 'success' : 
                status.transaction_status === 'pending' ? 'pending' : 'failed',
        orderId: status.order_id
      };
    } catch (error) {
      console.error('Error validating transaction:', error);
      throw error;
    }
  }
}

export default new PaymentService(); 