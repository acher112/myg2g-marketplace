import Head from 'next/head';
import Link from 'next/link';
import { Shield, Zap, Globe, Lock, CheckCircle } from 'lucide-react';
import { CATEGORIES } from '../lib/categories';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>MyG2G - Buy Premium Game Accounts with Crypto</title>
        <meta name="description" content="Buy verified game accounts with cryptocurrency. Discord, Steam, Fortnite, Valorant and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center text-white">
         <h1 className="text-5xl md:text-7xl font-bold mb-6...">
  Buy Premium Game Accounts
</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Instant delivery • Secure crypto payments • Trusted worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <Shield className="text-green-400" />
              <span>100% Safe</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <Zap className="text-yellow-400" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <Globe className="text-blue-400" />
              <span>Global Access</span>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-16">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
  {CATEGORIES.map(category => (
    <Link
      key={category.id}
      href={`/category/${category.id}`}
      className="group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/50 shadow-xl hover:shadow-purple-500/20"
    >
      {/* Fixed size image container */}
      <div className="relative w-full h-40 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center p-4">
        <img 
          src={category.image} 
          alt={category.name}
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
        />
      </div>
      
      {/* Category info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-base mb-1">{category.name}</h3>
        <p className="text-gray-400 text-xs">View Accounts →</p>
      </div>
    </Link>
  ))}
</div>
        </section>

        {/* Trust Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center text-white">
                <Lock className="mx-auto mb-4 text-purple-400" size={48} />
                <h3 className="text-xl font-semibold mb-3">Crypto Payments</h3>
                <p className="text-gray-300">Secure global transactions with Bitcoin, USDT, Ethereum and more</p>
              </div>
              <div className="text-center text-white">
                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                <h3 className="text-xl font-semibold mb-3">Verified Accounts</h3>
                <p className="text-gray-300">All accounts are tested and verified before sale</p>
              </div>
              <div className="text-center text-white">
                <Zap className="mx-auto mb-4 text-yellow-400" size={48} />
                <h3 className="text-xl font-semibold mb-3">Quick Delivery</h3>
                <p className="text-gray-300">Receive your account details within 24 hours</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}