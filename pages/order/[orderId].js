import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { CheckCircle, Clock, XCircle, Package, AlertCircle } from 'lucide-react';

export default function OrderStatusPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus();
      // Poll every 10 seconds
      const interval = setInterval(fetchOrderStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`); // Changed this line
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_payment':
        return {
          icon: <Clock className="text-yellow-400" size={48} />,
          color: 'yellow',
          title: 'Awaiting Payment',
          message: 'Please complete your payment. Your order will be cancelled if not paid within 30 minutes.'
        };
      case 'awaiting_verification':
        return {
          icon: <Clock className="text-blue-400" size={48} />,
          color: 'blue',
          title: 'Verifying Payment',
          message: 'We are checking your payment. This usually takes 2-10 minutes. You will be notified once confirmed.'
        };
      case 'paid':
        return {
          icon: <CheckCircle className="text-green-400" size={48} />,
          color: 'green',
          title: 'Payment Confirmed!',
          message: 'Your payment has been verified. We are preparing your account details now.'
        };
      case 'delivered':
        return {
          icon: <Package className="text-purple-400" size={48} />,
          color: 'purple',
          title: 'Order Delivered!',
          message: 'Your account details have been sent to your email and WhatsApp. Check your inbox!'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="text-green-400" size={48} />,
          color: 'green',
          title: 'Order Completed',
          message: 'Thank you for your purchase! Enjoy your account.'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="text-red-400" size={48} />,
          color: 'red',
          title: 'Order Cancelled',
          message: 'This order was cancelled. If you paid, please contact support immediately.'
        };
      case 'disputed':
        return {
          icon: <AlertCircle className="text-orange-400" size={48} />,
          color: 'orange',
          title: 'Order Under Review',
          message: 'There is an issue with this order. Our support team will contact you soon.'
        };
      default:
        return {
          icon: <Clock className="text-gray-400" size={48} />,
          color: 'gray',
          title: 'Processing',
          message: 'Your order is being processed.'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center border border-red-500/30">
          <XCircle className="mx-auto text-red-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
          <p className="text-gray-300 mb-6">
            This order doesn't exist or the order ID is incorrect.
          </p>
          <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <>
      <Head>
        <title>Order Status - {order.orderId}</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-slate-800 rounded-2xl p-8 border border-purple-500/30">
            <div className="text-center mb-8">
              {statusInfo.icon}
              <h1 className="text-3xl font-bold text-white mt-4 mb-2">{statusInfo.title}</h1>
              <p className="text-gray-300">{statusInfo.message}</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Details</h2>
              <div className="space-y-3 text-gray-300">
                <p><strong className="text-white">Order ID:</strong> {order.orderId}</p>
                <p><strong className="text-white">Product:</strong> {order.listingSnapshot.title}</p>
                <p><strong className="text-white">Amount:</strong> ${order.amount} USD</p>
                <p><strong className="text-white">Payment Method:</strong> {order.paymentDetails?.method || 'Not selected'}</p>
                <p><strong className="text-white">Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p>
                  <strong className="text-white">Status:</strong>{' '}
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold bg-${statusInfo.color}-600`}>
                    {order.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {order.status === 'cancelled' && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm mb-3">
                  ⚠️ If you already sent payment, please contact support immediately with your transaction details.
                </p>
                <Link href="/contact" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-block transition">
                  Contact Support
                </Link>
              </div>
            )}

            {(order.status === 'pending_payment' || order.status === 'awaiting_verification') && (
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 mb-6">
                <p className="text-blue-300 text-sm mb-3">
                  💡 Having issues with payment? Need help?
                </p>
                <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block transition">
                  Contact Support
                </Link>
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-center transition">
                Back to Home
              </Link>
              <button
                onClick={fetchOrderStatus}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition"
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
