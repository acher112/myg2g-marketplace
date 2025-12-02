import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - MyG2G</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link href="/" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="bg-slate-800/50 rounded-2xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
                <p>We collect email addresses and WhatsApp numbers for order delivery purposes only. Payment information is processed securely through third-party crypto payment processors.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                <p>Your contact information is used solely to deliver purchased account credentials and provide customer support. We do not sell or share your information with third parties.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">3. Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information. All connections are encrypted with SSL/TLS.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">4. Cookies</h2>
                <p>We use minimal cookies for essential website functionality and admin authentication only.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">5. Your Rights</h2>
                <p>You have the right to request deletion of your personal information at any time by contacting us.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">6. Contact</h2>
                <p>For privacy concerns, email: privacy@myg2g.me</p>
              </section>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}