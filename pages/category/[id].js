import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CheckCircle } from 'lucide-react';
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
      setListings(response.data.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!category) {
    return <div className="min-h-screen flex items-center justify-center text-white">Category not found</div>;
  }

  return (
    <>
      <Head>
        <title>{category.name} - AccVault</title>
        <meta name="description" content={category.description} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-white mb-6 hover:text-purple-400 transition flex items-center gap-2 inline-flex">
            ← Back to Home
          </Link>

          <div className="text-white mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">{category.icon}</span>
              {category.name}
            </h1>
            <p className="text-gray-400">{category.description}</p>
            <p className="text-gray-500 mt-2">{listings.length} accounts available</p>
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
                <div key={listing._id} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-xl">
                  <h3 className="text-2xl font-bold text-white mb-3">{listing.title}</h3>
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

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="text-3xl font-bold text-purple-400">${listing.price}</div>
                    <Link
                      href={`/checkout/${listing._id}`}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/50"
                    >
                      Buy Now
                    </Link>
                  </div>
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