import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Plus, Trash2, Eye, EyeOff, Mail, Edit2, X } from 'lucide-react';
import { CATEGORIES } from '../../lib/categories';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

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
      const messagesRes = await axios.get('/api/contact', {
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
      setMessages(messagesRes.data.data);
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

  const handleEditListing = (listing) => {
    setEditingListing({
      ...listing,
      features: listing.features.join('\n')
    });
  };

  const handleUpdateListing = async () => {
    if (!editingListing.title || !editingListing.price || !editingListing.category) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const adminPass = localStorage.getItem('adminPassword');
      const featuresArray = editingListing.features.split('\n').filter(f => f.trim());

      await axios.put(`/api/listings/${editingListing._id}`, {
        title: editingListing.title,
        description: editingListing.description,
        category: editingListing.category,
        price: parseFloat(editingListing.price),
        features: featuresArray,
        inStock: editingListing.inStock
      }, {
        headers: { 'admin-password': adminPass }
      });

      alert('✅ Listing updated successfully!');
      setEditingListing(null);
      fetchData();
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Error updating listing');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('⚠️ Are you sure you want to delete this listing?\n\nThis action cannot be undone.')) return;

    try {
      const adminPass = localStorage.getItem('adminPassword');
      await axios.delete(`/api/listings/${id}`, {
        headers: { 'admin-password': adminPass }
      });
      alert('✅ Listing deleted successfully!');
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

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('⚠️ Are you sure you want to delete this order?\n\nThis action cannot be undone.')) return;

    try {
      const adminPass = localStorage.getItem('adminPassword');
      await axios.delete(`/api/orders/${orderId}/delete`, {
        headers: { 'admin-password': adminPass }
      });
      alert('✅ Order deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    }
  };

  const handleUpdateMessageStatus = async (messageId, newStatus) => {
    try {
      const adminPass = localStorage.getItem('adminPassword');
      await axios.put(`/api/contact/${messageId}/status`, {
        status: newStatus
      }, {
        headers: { 'admin-password': adminPass }
      });
      fetchData();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('⚠️ Are you sure you want to delete this message?\n\nThis action cannot be undone.')) return;

    try {
      const adminPass = localStorage.getItem('adminPassword');
      await axios.delete(`/api/contact/${messageId}/delete`, {
        headers: { 'admin-password': adminPass }
      });
      alert('✅ Message deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
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

  const newMessagesCount = messages.filter(m => m.status === 'new').length;

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
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-lg font-semibold transition relative ${
                activeTab === 'messages' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'
              }`}
            >
              Messages ({messages.length})
              {newMessagesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {newMessagesCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'listings' && (
            <>
              {/* Edit Modal */}
              {editingListing && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-white">Edit Listing</h2>
                      <button
                        onClick={() => setEditingListing(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <select
                        value={editingListing.category}
                        onChange={(e) => setEditingListing({...editingListing, category: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Title"
                        value={editingListing.title}
                        onChange={(e) => setEditingListing({...editingListing, title: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      />

                      <textarea
                        placeholder="Description"
                        value={editingListing.description}
                        onChange={(e) => setEditingListing({...editingListing, description: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white h-24 focus:border-purple-500 focus:outline-none"
                      />

                      <textarea
                        placeholder="Features (one per line)"
                        value={editingListing.features}
                        onChange={(e) => setEditingListing({...editingListing, features: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white h-32 focus:border-purple-500 focus:outline-none"
                      />

                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price (USD)"
                        value={editingListing.price}
                        onChange={(e) => setEditingListing({...editingListing, price: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      />

                      <label className="flex items-center gap-3 text-white">
                        <input
                          type="checkbox"
                          checked={editingListing.inStock}
                          onChange={(e) => setEditingListing({...editingListing, inStock: e.target.checked})}
                          className="w-5 h-5"
                        />
                        In Stock
                      </label>

                      <div className="flex gap-3">
                        <button
                          onClick={handleUpdateListing}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingListing(null)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
    onClick={() => handleEditListing(listing)}
    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition"
    title="Edit"
  >
    <Edit2 size={18} className="text-white" />
  </button>
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
                        <div className="flex gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                            className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                              order.status === 'pending' ? 'bg-yellow-600' :
                              order.status === 'pending_payment' ? 'bg-orange-600' :
                              order.status === 'awaiting_verification' ? 'bg-blue-600' :
                              order.status === 'paid' ? 'bg-green-600' :
                              order.status === 'delivered' ? 'bg-purple-600' :
                              order.status === 'completed' ? 'bg-teal-600' :
                              'bg-red-600'
                            } text-white`}
                          >
                            <option value="pending">Pending</option>
                            <option value="pending_payment">Pending Payment</option>
                            <option value="awaiting_verification">Awaiting Verification</option>
                            <option value="paid">Paid</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="disputed">Disputed</option>
                          </select>
                          <button
                            onClick={() => handleDeleteOrder(order.orderId)}
                            className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
                            title="Delete Order"
                          >
                            <Trash2 size={18} className="text-white" />
                          </button>
                        </div>
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

                      {order.paymentDetails?.method && (
                        <div className="mt-4 p-3 bg-slate-800 rounded-lg text-xs text-gray-400">
                          <p><strong>Payment Method:</strong> {order.paymentDetails.method}</p>
                          {order.paymentDetails.transactionId && (
                            <p><strong>Transaction ID:</strong> {order.paymentDetails.transactionId}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-slate-800 rounded-2xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Messages</h2>
              
              {loading ? (
                <p className="text-gray-400 text-center py-8">Loading...</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No messages yet.</p>
              ) : (
                <div className="space-y-4">
                  {messages.slice().reverse().map(message => (
                    <div key={message._id} className={`bg-slate-900 rounded-xl p-6 border ${
                      message.status === 'new' ? 'border-yellow-500/50' : 'border-slate-700'
                    }`}>
                      <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                        <div className="flex items-start gap-3">
                          <Mail className="text-purple-400 mt-1" size={24} />
                          <div>
                            <h3 className="text-lg font-bold text-white">{message.name}</h3>
                            <p className="text-gray-400 text-sm">{message.email}</p>
                            <p className="text-gray-500 text-xs mt-1">{new Date(message.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={message.status}
                            onChange={(e) => handleUpdateMessageStatus(message._id, e.target.value)}
                            className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                              message.status === 'new' ? 'bg-yellow-600' :
                              message.status === 'read' ? 'bg-blue-600' :
                              message.status === 'replied' ? 'bg-purple-600' :
                              'bg-green-600'
                            } text-white`}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
                            title="Delete Message"
                          >
                            <Trash2 size={18} className="text-white" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-gray-300 text-sm mb-4">
                        {message.orderId && (
                          <p><strong className="text-white">Order ID:</strong> {message.orderId}</p>
                        )}
                        <p><strong className="text-white">Issue:</strong> {message.issue.replace(/_/g, ' ').toUpperCase()}</p>
                      </div>

                      <div className="bg-slate-800 rounded-lg p-4">
                        <p className="text-white font-semibold mb-2">Message:</p>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <a
                          href={`mailto:${message.email}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                          Reply via Email
                        </a>
                        {message.orderId && (
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition"
                          >
                            View Order
                          </button>
                        )}
                      </div>
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
