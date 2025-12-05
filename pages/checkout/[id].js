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
  const [paymentMethod, setPaymentMethod] = useState('');
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

    if (!paymentMethod) {
      alert('Please select a payment method (USDT or Litecoin)');
      return;
    }

    setProcessing(true);

    try {
      const response = await axios.post('/api/payment/create-invoice', {
        listingId: listing._id,
        buyer: buyerInfo,
        paymentMethod
      });

      if (response.data.success) {
        // Redirect to payment instructions page
        router.push(
          `/payment/${response.data.orderId}?method=${paymentMethod}&amount=${listing.price}`
        );
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error creating order. Please try again.');
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
            <form onSubmit={handleCheckout} className="space-y-6 mb-8">
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

              {/* Payment Method Selection */}
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">
                  Select Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('USDT')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      paymentMethod === 'USDT'
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/30'
                        : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">💵</div>
                      <div className="font-bold text-white text-lg">USDT</div>
                      <div className="text-xs text-gray-400 mt-1">TRC20 (Tron)</div>
                      <div className="text-xs text-green-400 mt-2">⚡ 2-3 min</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('LTC')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      paymentMethod === 'LTC'
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/30'
                        : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🪙</div>
                      <div className="font-bold text-white text-lg">Litecoin</div>
                      <div className="text-xs text-gray-400 mt-1">LTC Network</div>
                      <div className="text-xs text-green-400 mt-2">⚡ 2-5 min</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 text-blue-200 text-sm">
                <p className="font-semibold mb-2">📧 Delivery Method:</p>
                <p>Account credentials will be sent to your email and WhatsApp within 5-10 minutes after payment verification.</p>
              </div>

              <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4 text-purple-200 text-sm">
                <p className="font-semibold mb-2">💰 How it Works:</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Select your preferred crypto (USDT or Litecoin)</li>
                  <li>You'll get our wallet address and QR code</li>
                  <li>Send payment from Binance, Trust Wallet, or any crypto wallet</li>
                  <li>We verify and deliver your account instantly!</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : '→ Continue to Payment Details'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
