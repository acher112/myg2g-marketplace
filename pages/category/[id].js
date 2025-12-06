import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { getCategoryById } from '../../lib/categories';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const category = getCategoryById(id);

  useEffect(() => {
    if (id) {
      fetchListings();
    }
  }, [id]);

  const fetchListings = async () => {
    try {
      const response = await axios.get(`/api/listings?category=${id}`);
      // Show ALL listings including out of stock
      setListings(response.data.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (listing) => {
    if (listing.inStock) {
      router.push(`/checkout/${listing._id}`);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Category not found</h1>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{category.name} - MyG2G</title>
        <meta name="description" content={category.description} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-white mb-6 hover:text-purple-400 transition flex items-center gap-2 inline-flex">
            ← Back to Categories
          </Link>

          <div className="text-white mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">{category.icon}</span>
              {category.name}
            </h1>
            <p className="text-gray-400">{category.description}</p>
            <p className="text-gray-500 mt-2">
              {listings.filter(l => l.inStock).length} available • {listings.filter(l => !l.inStock).length} out of stock
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4">Loading accounts...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-slate-800/50 rounded-2xl p-12 text-center text-white">
              <p className="text-xl">No accounts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <div 
                  key={listing._id} 
                  className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border transition-all shadow-xl relative overflow-hidden ${
                    listing.inStock 
                      ? 'border-purple-500/30 hover:border-purple-500/50' 
                      : 'border-gray-600/30 opacity-75'
                  }`}
                >
                  {/* Price Badge or Out of Stock Badge */}
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-lg shadow-lg ${
                    listing.inStock 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {listing.inStock ? `$${listing.price}` : 'OUT OF STOCK'}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 pr-24">{listing.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{listing.description}</p>
                  
                  {listing.features && listing.features.length > 0 && (
                    <ul className="mb-6 space-y-2">
                      {listing.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-300 flex items-start gap-2">
                          <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={16} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {listing.inStock ? (
                    <button
                      onClick={() => handleBuyNow(listing)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/50 text-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Buy Now
                    </button>
                  ) : (
                    <div>
                      <button
                        disabled
                        className="w-full bg-gray-600 text-gray-300 px-6 py-4 rounded-lg font-semibold cursor-not-allowed text-lg flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={20} />
                        Unavailable
                      </button>
                      <p className="text-center text-gray-400 text-xs mt-2">
                        Check back soon or <Link href="/contact" className="text-purple-400 hover:underline">contact us</Link>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
