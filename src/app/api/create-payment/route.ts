import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { toast } from 'react-toastify';

export async function POST(request: Request) {
  try {
    const { productId, amount, productName, buyerId, customerDetails } = await request.json();

    if (!process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY) {
      throw new Error('Missing Midtrans configuration');
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
    });

    const parameter = {
      transaction_details: {
        order_id: `ORDER_${productId}_${Date.now()}`,
        gross_amount: parseInt(amount)
      },
      item_details: [{
        id: productId,
        price: parseInt(amount),
        quantity: 1,
        name: productName
      }],
      customer_details: {
        first_name: customerDetails.name,
        phone: customerDetails.phone,
        email: customerDetails.email,
        billing_address: {
          address: customerDetails.address
        },
        shipping_address: {
          address: customerDetails.address
        }
      }
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    toast.error('Failed to create payment', {
      icon: "❌",
      style: {
        background: "linear-gradient(to right, #ef4444, #dc2626)",
        color: "white",
        borderRadius: "1rem",
      }
    });
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
} 