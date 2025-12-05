import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { Copy, CheckCircle, AlertCircle } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const { orderId, method, amount } = router.query;
  
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [txId, setTxId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (method && amount) {
      fetchPaymentInfo();
    }
  }, [method, amount]);

  const fetchPaymentInfo = async () => {
    try {
      const response = await axios.get('/api/payment/instructions', {
        params: { method, amount }
      });
      setPaymentInfo(response.data);
    } catch (error) {
      console.error('Error fetching payment info:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(paymentInfo.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = async () => {
    setSubmitting(true);
    try {
      await axios.post(`/api/orders/${id}/confirm-payment`, {
        transactionId: txId || 'Pending verification'
      });
      setSubmitted(true);
    } catch (error) {
      alert('Error submitting payment confirmation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading payment details...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center border border-green-500/30">
          <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-white mb-4">Payment Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Your payment is being verified. You'll receive your account details via WhatsApp and email within 5-10 minutes.
          </p>
          <p className="text-sm text-gray-400 mb-6">Order ID: {orderId}</p>
          <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Complete Payment - MyG2G</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-slate-800 rounded-2xl p-8 border border-purple-500/30">
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
            <p className="text-gray-400 mb-8">Order #{orderId}</p>

            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Pay Amount</p>
                  <p className="text-3xl font-bold text-white">
                    {paymentInfo?.cryptoAmount} {method}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">≈ ${amount} USD</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Network</p>
                  <p className="text-xl font-semibold text-purple-400">{paymentInfo?.network}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 mb-6">
              <p className="text-gray-400 text-sm mb-3">Send {method} to this address:</p>
              
              <div className="bg-slate-800 rounded-lg p-4 mb-4 flex items-center justify-between">
                <p className="text-white font-mono text-sm break-all mr-2">
                  {paymentInfo?.walletAddress}
                </p>
                <button
                  onClick={copyAddress}
                  className="bg-purple-600 hover:bg-purple-700 p-2 rounded transition flex-shrink-0"
                >
                  {copied ? <CheckCircle size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
                </button>
              </div>

              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg">
                  <img src={paymentInfo?.qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>

              <p className="text-center text-sm text-gray-400">
                Scan QR code with your crypto wallet app
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="text-yellow-400 flex-shrink-0" size={24} />
                <div>
                  <p className="text-yellow-400 font-semibold mb-1">Important:</p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Send EXACTLY {paymentInfo?.cryptoAmount} {method}</li>
                    <li>• Use {paymentInfo?.network} network only</li>
                    <li>• Payment usually takes 2-5 minutes to confirm</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-gray-400 text-sm block mb-2">
                Transaction ID (Optional - paste after sending)
              </label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="Paste transaction hash here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSubmitPayment}
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-4 rounded-lg font-semibold transition text-lg"
            >
              {submitting ? 'Processing...' : "✓ I've Sent the Payment"}
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              After clicking, we'll verify your payment and deliver your account within 5-10 minutes
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
