import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { CATEGORIES } from '../../lib/categories';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    features: '',
    inStock: true
  });

  useEffect(() => {
    const adminPass = localStorage.getItem('adminPassword');
    if (adminPass) {
      setPassword(adminPass);
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === correctPassword) {
      localStorage.setItem('adminPassword', password);
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Wrong password!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    setIsAuthenticated(false);
    setPassword('');
    router.push('/');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const adminPass = localStorage.getItem('adminPassword');
      
      const listingsRes = await axios.get('/api/listings');
      const ordersRes = await axios.get('/api/orders', {
        headers: { 'admin-password': adminPass }
      });

      const groupedListings = {};
      listingsRes.data.data.forEach(listing => {
        if (!groupedListings[listing.category]) {
          groupedListings[listing.category] = [];
        }
        groupedListings[listing.category].push(listing);
      });

      setListings(groupedListings);
      setOrders(ordersRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminPassword');
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddListing = async (e) => {
    e.preventDefault();

    if (!newListing.title || !newListing.price || !newListing.category) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const adminPass = localStorage.getItem('adminPassword');
      
      if (!adminPass) {
        alert('Please login again');
        setIsAuthenticated(false);
        return;
      }

      const featuresArray = newListing.features.split('\n').filter(f => f.trim());

      await axios.post('/api/listings', {
        ...newListing,
        price: parseFloat(newListing.price),
        features: featuresArray
      }, {
        headers: { 
          'admin-password': adminPass,
          'Content-Type': 'application/json'
        }
      });

      alert('✅ Listing added successfully!\n\nYou can see it in the listings below and on your website.');
      setNewListing({
        title: '',
        description: '',
        category: '',
        price: '',
        features: '',
        inStock: true
      });
      fetchData();
    } catch (error) {
      console.error('Error adding listing:', error);
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        localStorage.removeItem('adminPassword');
        setIsAuthenticated(false);
      } else {
        alert('Error adding listing: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('⚠️ Are you sure you want to delete this listing?\n\nThis action cannot be undone.')) return;

    try {
      const adminPass = localStorage.getItem('adminPassword');
      await axios.delete(`/api/listings/${id}`, {
        headers: { 'admin-password': adminPass }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Error deleting listing');
    }
  };

  const handleToggleStock = async (id, currentStatus) => {
    try {
      const adminPass = localStorage.getItem('adminPassword');
      await axios.put(`/api/listings/${id}`, {
        inStock: !currentStatus
      }, {
        headers: { 'admin-password': adminPass }
      });
      fetchData();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const adminPass = localStorage.getItem('adminPassword');
      await axios.put(`/api/orders/${orderId}/status`, {
        status: newStatus
      }, {
        headers: { 'admin-password': adminPass }
      });
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // NEW FUNCTION - Mark as Paid
  const handleMarkAsPaid = async (orderId) => {
    if (!confirm('✅ Confirm that you received the crypto payment in your Binance wallet?\n\nThis will mark the order as PAID and you should deliver the account to the customer immediately.')) {
      return;
    }

    try {
      const adminPass = localStorage.getItem('adminPassword');
      await axios.put(`/api/orders/${orderId}/status`, {
        status: 'paid'
      }, {
        headers: { 'admin-password': adminPass }
      });
      
      alert('✅ Order marked as PAID!\n\n📧 Now deliver the account details to the customer via:\n• Email (check order details)\n• WhatsApp (check order details)\n\nAfter delivery, mark order as "Delivered".');
      fetchData(); // Refresh orders
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - AccVault</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-purple-500/30">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4 focus:border-purple-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Login
              </button>
            </form>
            <p className="text-gray-400 text-sm mt-4 text-center">
              🔒 Secure admin access only
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-400 hover:text-white mt-4 transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>

          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'listings' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
            >
              Manage Listings
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'orders' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>

          {activeTab === 'listings' && (
            <>
              <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Add New Listing</h2>
                <form onSubmit={handleAddListing} className="space-y-4">
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({...newListing, category: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Title (e.g., Discord Nitro Account - 2 Years Old)"
                    value={newListing.title}
                    onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={newListing.description}
                    onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white h-24 focus:border-purple-500 focus:outline-none"
                    required
                  />

                  <textarea
                    placeholder="Features (one per line)"
                    value={newListing.features}
                    onChange={(e) => setNewListing({...newListing, features: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white h-32 focus:border-purple-500 focus:outline-none"
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price (USD)"
                    value={newListing.price}
                    onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add Listing
                  </button>
                </form>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-6">Your Listings</h2>
                
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading...</p>
                ) : Object.keys(listings).length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No listings yet. Add your first listing above!</p>
                ) : (
                  CATEGORIES.map(category => {
                    const catListings = listings[category.id] || [];
                    if (catListings.length === 0) return null;

                    return (
                      <div key={category.id} className="mb-8">
                        <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          {category.name} ({catListings.length})
                        </h3>
                        <div className="space-y-4">
                          {catListings.map(listing => (
                            <div key={listing._id} className="bg-slate-900 rounded-xl p-4 flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-white">{listing.title}</h4>
                                <p className="text-gray-400 text-sm mt-1">{listing.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-purple-400 font-bold">${listing.price}</span>
                                  <span className={`text-sm ${listing.inStock ? 'text-green-400' : 'text-red-400'}`}>
                                    {listing.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleToggleStock(listing._id, listing.inStock)}
                                  className={`p-2 rounded-lg transition ${
                                    listing.inStock ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                                  }`}
                                  title={listing.inStock ? 'Mark as Out of Stock' : 'Mark as In Stock'}
                                >
                                  {listing.inStock ? <EyeOff size={18} className="text-white" /> : <Eye size={18} className="text-white" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteListing(listing._id)}
                                  className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
                                  title="Delete"
                                >
                                  <Trash2 size={18} className="text-white" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="bg-slate-800 rounded-2xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">Customer Orders</h2>
              
              {loading ? (
                <p className="text-gray-400 text-center py-8">Loading...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice().reverse().map(order => (
                    <div key={order._id} className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                      <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">Order #{order.orderId}</h3>
                          <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                          className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                            order.status === 'pending' || order.status === 'pending_payment' ? 'bg-yellow-600' :
                            order.status === 'awaiting_verification' ? 'bg-orange-600' :
                            order.status === 'paid' ? 'bg-blue-600' :
                            order.status === 'delivered' ? 'bg-green-600' :
                            order.status === 'completed' ? 'bg-purple-600' :
                            'bg-red-600'
                          } text-white`}
                        >
                          <option value="pending_payment">Pending Payment</option>
                          <option value="awaiting_verification">Awaiting Verification</option>
                          <option value="paid">Paid</option>
                          <option value="delivered">Delivered</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="disputed">Disputed</option>
                        </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
                        <div>
                          <p><strong className="text-white">Product:</strong> {order.listingSnapshot.title}</p>
                          <p><strong className="text-white">Category:</strong> {order.listingSnapshot.category}</p>
                          <p><strong className="text-white">Price:</strong> ${order.amount}</p>
                        </div>
                        <div>
                          <p><strong className="text-white">Customer:</strong> {order.buyer.name}</p>
                          <p><strong className="text-white">Email:</strong> {order.buyer.email}</p>
                          <p><strong className="text-white">WhatsApp:</strong> {order.buyer.whatsapp}</p>
                        </div>
                      </div>

                      {/* Payment Details */}
                      {order.paymentDetails && (
                        <div className="mt-4 p-3 bg-slate-800 rounded-lg text-xs text-gray-400">
                          {order.paymentDetails.method && (
                            <p><strong>Payment Method:</strong> {order.paymentDetails.method}</p>
                          )}
                          {order.paymentDetails.transactionId && (
                            <p><strong>Transaction ID:</strong> {order.paymentDetails.transactionId}</p>
                          )}
                          {order.paymentDetails.submittedAt && (
                            <p><strong>Submitted:</strong> {new Date(order.paymentDetails.submittedAt).toLocaleString()}</p>
                          )}
                        </div>
                      )}

                      {/* Mark as Paid Button - Shows only for awaiting_verification */}
                      {order.status === 'awaiting_verification' && (
                        <div className="mt-4 p-4 bg-orange-900/30 border border-orange-500/30 rounded-lg">
                          <p className="text-orange-300 text-sm mb-3">
                            ⚠️ Customer claims payment sent. Check your Binance wallet for incoming {order.paymentDetails?.method} payment of ${order.amount}.
                          </p>
                          <button
                            onClick={() => handleMarkAsPaid(order.orderId)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition font-semibold w-full"
                          >
                            ✓ Verified Payment - Mark as Paid & Deliver
                          </button>
                        </div>
                      )}

                      {/* Paid status info */}
                      {order.status === 'paid' && (
                        <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg text-green-300 text-sm">
                          ✓ Payment verified. Deliver account details to customer via email/WhatsApp, then mark as "Delivered".
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
