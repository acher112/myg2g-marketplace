import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import Header from '../components/Header';
import { Mail, MessageCircle, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    issue: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await axios.post('/api/contact/submit', formData);
      
      if (response.data.success) {
        console.log('✅ Message sent successfully');
        setSubmitted(true);
      } else {
        alert('Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try WhatsApp or Email directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappNumber = '+923150029531'; // Your real WhatsApp number
  const supportEmail = 'muhammadachar452@gmail.com';

  if (submitted) {
    return (
      <>
        <Head>
          <title>Contact Support - MyG2G</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Header />
          <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-slate-800 rounded-2xl p-8 border border-green-500/30 text-center">
              <Send className="mx-auto text-green-400 mb-4" size={64} />
              <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
              <p className="text-gray-300 mb-6">
                Thank you for contacting us. We'll respond within 24 hours via email or WhatsApp.
              </p>
              <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Support - MyG2G</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Contact Support</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 rounded-2xl p-6 text-center transition border border-green-500/30"
            >
              <MessageCircle className="mx-auto text-white mb-3" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp Support</h3>
              <p className="text-gray-200 text-sm mb-3">Get instant help via WhatsApp</p>
              <p className="text-white font-mono">{whatsappNumber}</p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${supportEmail}`}
              className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-6 text-center transition border border-blue-500/30"
            >
              <Mail className="mx-auto text-white mb-3" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
              <p className="text-gray-200 text-sm mb-3">Send us an email anytime</p>
              <p className="text-white font-mono text-sm break-all">{supportEmail}</p>
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white font-semibold block mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2">Order ID (if applicable)</label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="ORD-123456789"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-2">Issue Type *</label>
                <select
                  required
                  value={formData.issue}
                  onChange={(e) => setFormData({...formData, issue: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select an issue</option>
                  <option value="payment_failed">Payment Failed</option>
                  <option value="payment_not_confirmed">Payment Not Confirmed</option>
                  <option value="order_not_received">Order Not Received</option>
                  <option value="account_issue">Account Issue</option>
                  <option value="refund_request">Refund Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-white font-semibold block mb-2">Message *</label>
                <textarea
                  required
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Describe your issue in detail. Include transaction ID if you have one."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-purple-400 hover:text-purple-300 transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
