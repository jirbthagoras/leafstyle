import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { toastError } from '@/utils/toastConfig';

export async function POST(request: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    const transaction = await snap.createTransactionToken(parameter);
    return NextResponse.json({ token: transaction });
  } catch (error: Error | unknown) {
    console.error('Payment creation error:', error);
    toastError('Failed to create payment')
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    );
  }
} 