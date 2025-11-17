import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import Header from '../../components/Header';

export default function CheckoutPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/api/listings/${id}`);
      setListing(response.data.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      alert('Listing not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!buyerInfo.name || !buyerInfo.email || !buyerInfo.whatsapp) {
      alert('Please fill all contact details');
      return;
    }

    setProcessing(true);

    try {
      const response = await axios.post('/api/payment/create-invoice', {
        listingId: listing._id,
        buyer: buyerInfo,
        payCurrency: 'usdttrc20' // Default to USDT TRC20
      });

      if (response.data.demo) {
        alert('Demo Mode: NOWPayments not configured.\n\nOrder created: ' + response.data.orderId);
        router.push('/');
      } else if (response.data.paymentUrl) {
        // Redirect to NOWPayments checkout
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error creating payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Checkout - {listing.title}</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Link href={`/category/${listing.category}`} className="text-white mb-6 hover:text-purple-400 transition inline-flex items-center gap-2">
            ← Back
          </Link>

          <div className="bg-slate-800 rounded-2xl p-8 border border-purple-500/30 mt-6">
            <h2 className="text-3xl font-bold text-white mb-6">Checkout</h2>

            {/* Order Summary */}
            <div className="bg-slate-900 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong className="text-white">Account:</strong> {listing.title}</p>
                <p><strong className="text-white">Category:</strong> {listing.category}</p>
                <p className="text-2xl font-bold text-purple-400 pt-4 border-t border-slate-700">
                  Total: ${listing.price} USD
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleCheckout} className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Your Contact Details</h3>
              
              <input
                type="text"
                placeholder="Full Name"
                value={buyerInfo.name}
                onChange={(e) => setBuyerInfo({...buyerInfo, name: e.target.value})}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              />
              
              <input
                type="email"
                placeholder="Email Address"
                value={buyerInfo.email}
                onChange={(e) => setBuyerInfo({...buyerInfo, email: e.target.value})}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              />
              
              <input
                type="text"
                placeholder="WhatsApp Number (with country code, e.g., +92...)"
                value={buyerInfo.whatsapp}
                onChange={(e) => setBuyerInfo({...buyerInfo, whatsapp: e.target.value})}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              />

              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 text-blue-200 text-sm">
                <p className="font-semibold mb-2">📧 Delivery Method:</p>
                <p>Account credentials will be sent to your email or WhatsApp within 2 hours after payment confirmation.</p>
              </div>

              <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 text-purple-200 text-sm">
                <p className="font-semibold mb-2">💰 Payment Methods:</p>
                <p>We accept Bitcoin (BTC), USDT (TRC20/ERC20), Ethereum (ETH), and 100+ cryptocurrencies.</p>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Proceed to Crypto Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}