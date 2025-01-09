"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Product } from '@/types/marketplace';
import marketplaceService from '@/services/MarketplaceService';
import { auth } from '@/lib/firebase/config';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import paymentService from '@/services/PaymentService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Modal from '@/components/Marketplace/Modal';
import Image from 'next/image';
interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [showCustomerForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await marketplaceService.getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  useEffect(() => {
    if (product && auth.currentUser) {
      setIsSeller(product.seller.id === auth.currentUser.uid);
    }
  }, [product]);

  useEffect(() => {
    const loadUserDetails = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const userData = userDoc.data();
        if (userData) {
          setCustomerDetails({
            name: userData.name || '',
            phone: userData.phone || '',
            email: userData.email || '',
            address: userData.address || ''
          });
        }
      }
    };
    loadUserDetails();
  }, []);

  useEffect(() => {
    const loadMidtransScript = () => {
      const script = document.createElement('script');
      script.src = process.env.NEXT_PUBLIC_MIDTRANS_URL || '';
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
      script.async = true;
      document.body.appendChild(script);
    };
    loadMidtransScript();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const handleModalSubmit = async () => {
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.email || !customerDetails.address) {
      alert("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsModalOpen(false);
    await initiatePayment();
  };

  const initiatePayment = async () => {
    try {
      setLoading(true);
      
      // Validate product availability
      const freshProduct = await marketplaceService.getProductById(product.id);
      if (freshProduct.status !== 'available') {
        throw new Error('Product is no longer available');
      }

      // Record initial transaction with product details
      const transactionId = await paymentService.recordTransaction({
        productId: product.id,
        buyerId: auth.currentUser!.uid,
        sellerId: product.seller.id,
        amount: product.price,
        customerDetails,
        productTitle: product.title,
        productImage: product.images[0],
        price: product.price
      });

      // Create payment token
      const paymentToken = await paymentService.createPaymentToken({
        productId: product.id,
        amount: product.price,
        productName: product.title,
        buyerId: auth.currentUser!.uid,
        customerDetails
      });

      // Handle Midtrans payment with timeout and retry logic
      let paymentAttempts = 0;
      const maxAttempts = 3;

      const handlePayment = () => {
        window.snap.pay(paymentToken.token, {
          onSuccess: async () => {
            try {
              await Promise.all([
                marketplaceService.checkout(productId, customerDetails),
                paymentService.updateTransactionStatus(transactionId, 'pending')
              ]);
              alert("Payment successful! Waiting for seller confirmation.");
              router.push('/marketplace');
            } catch (error) {
              console.error('Error processing successful payment:', error);
              alert('Payment successful but error updating status. Please contact support.');
            }
          },
          onPending: async () => {
            await paymentService.updateTransactionStatus(transactionId, 'pending');
            alert("Payment pending. Please complete your payment.");
          },
          onError: async () => {
            if (paymentAttempts < maxAttempts) {
              paymentAttempts++;
              handlePayment();
            } else {
              await paymentService.updateTransactionStatus(transactionId, 'failed');
              alert("Payment failed after multiple attempts. Please try again.");
            }
          },
          onClose: async () => {
            await paymentService.updateTransactionStatus(transactionId, 'failed');
            alert("Payment cancelled.");
          },
        });
      };

      handlePayment();
    } catch (error) {
      console.error("Error during payment:", error);
      alert(error instanceof Error ? error.message : "Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (action: 'accept' | 'reject') => {
    try {
      setLoading(true);
      await marketplaceService.handleOrder(productId, action);
      const updatedProduct = await marketplaceService.getProductById(productId);
      setProduct(updatedProduct);
      alert(`Order ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      alert(`Failed to ${action} order. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const renderSellerView = () => {
    const handleDelete = async () => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          await marketplaceService.deleteProduct(productId);
          alert('Product deleted successfully');
          router.push('/marketplace');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          alert(error.message || 'Failed to delete product');
        }
      }
    };

    return (
      <div className="space-y-4">
        {product.status === 'pending' ? (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Pending Order</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Buyer:</span> {product.buyer?.name}</p>
              <p><span className="font-medium">Order Status:</span> Waiting for Confirmation</p>
              <p><span className="font-medium">Order Date:</span> {new Date(product.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Shipping Address:</span> {product.customerDetails?.address}</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleOrderAction('accept')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Accept Order
              </button>
              <button
                onClick={() => handleOrderAction('reject')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Reject Order
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete Product
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCustomerForm = () => (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Shipping Details"
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={customerDetails.name}
          onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={customerDetails.email}
          onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={customerDetails.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
            setCustomerDetails(prev => ({ ...prev, phone: value }))
          }}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <textarea
          placeholder="Shipping Address"
          value={customerDetails.address}
          onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg"
          rows={3}
          required
        />
        <button
          onClick={handleModalSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          Proceed to Payment
        </button>
      </div>
    </Modal>
  );

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      alert("Please login to buy this product");
      router.push('/auth');
      return;
    }

    if (product?.seller.id === auth.currentUser.uid) {
      alert("You cannot buy your own product");
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Marketplace
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  width={800}
                  height={384}
                  className={`w-full h-full object-cover rounded-lg ${
                    product.status === 'sold' ? 'opacity-50' : ''
                  }`}
                />
                {product.status === 'sold' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold transform -rotate-45 text-xl">
                      SOLD
                    </span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className={`w-20 h-20 object-cover rounded cursor-pointer ${
                      currentImageIndex === index ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  Rp {product.price.toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Posted on {new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{product.location}</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Condition</h3>
                  <p className="text-gray-600">{product.condition}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Category</h3>
                  <p className="text-gray-600">{product.category}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{product.seller.name}</p>
                  </div>
                </div>
              </div>

              {isSeller && renderSellerView()}

              {!isSeller && (showCustomerForm || product.status === 'available') && renderCustomerForm()}

              {!isSeller && (
                <button
                  onClick={handleCheckout}
                  disabled={loading || product.status !== 'available'}
                  className={`w-full ${
                    loading || product.status !== 'available'
                      ? 'bg-gray-400'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white py-3 rounded-lg transition-colors`}
                >
                  {loading ? 'Processing...' : 
                   product.status === 'pending' ? 'Order Pending' :
                   product.status === 'sold' ? 'Sold Out' : 'Buy Now'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail; 