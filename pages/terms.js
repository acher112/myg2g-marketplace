import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - MyG2G</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link href="/" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
            ← Back to Home
          </Link>

          <div className="bg-slate-800/50 rounded-2xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                <p>By accessing and using MyG2G, you accept and agree to be bound by these Terms of Service.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">2. Account Sales</h2>
                <p>All accounts sold on this platform are verified and delivered within 24 hours of payment confirmation. Accounts are sold as-is and we do not guarantee their continued validity after delivery.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">3. Payment</h2>
                <p>We accept cryptocurrency payments only. All sales are final once account credentials are delivered.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">4. Refund Policy</h2>
                <p>Refunds are only provided if the account credentials are incorrect or non-functional within 24 hours of delivery. No refunds after account access has been confirmed.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">5. User Conduct</h2>
                <p>Users must not use purchased accounts for illegal activities. We reserve the right to refuse service to anyone.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">6. Contact</h2>
                <p>For any questions, contact us at: support@myg2g.me</p>
              </section>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}