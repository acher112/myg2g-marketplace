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
        {/* Primary Meta Tags */}
        <title>MyG2G - Buy Premium Game Accounts with Crypto | Discord, Steam, Valorant</title>
        <meta name="title" content="MyG2G - Buy Premium Game Accounts with Crypto | Discord, Steam, Valorant" />
        <meta name="description" content="Buy verified game accounts instantly with cryptocurrency. Secure Discord, Steam, Fortnite, Valorant, League of Legends accounts. Fast delivery, 100% safe, crypto payments accepted." />
        <meta name="keywords" content="buy game accounts, gaming accounts, discord accounts, steam accounts, valorant accounts, fortnite accounts, crypto gaming marketplace, buy accounts with bitcoin, myg2g, g2g marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://myg2g.me/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://myg2g.me/" />
        <meta property="og:title" content="MyG2G - Buy Premium Game Accounts with Crypto" />
        <meta property="og:description" content="Buy verified game accounts instantly with cryptocurrency. Discord, Steam, Valorant, Fortnite and more. Fast delivery & secure payments." />
        <meta property="og:image" content="https://myg2g.me/og-image.jpg" />
        <meta property="og:site_name" content="MyG2G" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://myg2g.me/" />
        <meta property="twitter:title" content="MyG2G - Buy Premium Game Accounts with Crypto" />
        <meta property="twitter:description" content="Buy verified game accounts instantly with cryptocurrency. Discord, Steam, Valorant, Fortnite and more." />
        <meta property="twitter:image" content="https://myg2g.me/og-image.jpg" />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="MyG2G" />
        <meta name="theme-color" content="#7c3aed" />

        {/* Structured Data - JSON-LD for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MyG2G",
              "url": "https://myg2g.me",
              "description": "Buy verified game accounts with cryptocurrency",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://myg2g.me/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
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
          <h2 className="text-3xl font-bold text-white text-center mb-8">Browse Game Accounts</h2>
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
                    alt={`Buy ${category.name} accounts with crypto`}
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
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose MyG2G?</h2>
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