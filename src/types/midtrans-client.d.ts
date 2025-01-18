declare module 'midtrans-client' {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    createTransactionToken(parameter: {
      transaction_details: {
        order_id: string;
        gross_amount: number;
      };
      item_details: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
      }>;
      customer_details: {
        first_name: string;
        phone: string;
        email: string;
        billing_address: {
          address: string;
        };
        shipping_address: {
          address: string;
        };
      };
    }): Promise<string>;
    transaction: {
      status(transactionId: string): Promise<{
        transaction_status: string;
        order_id: string;
      }>;
    };
  }
} 