import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-purple-500/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"        // put logo.png in /public
                alt="MyG2G logo"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MyG2G
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted marketplace for premium game accounts. Secure, fast, and reliable.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-purple-400 transition">Home</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400 transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-400 transition">Privacy Policy</Link></li>
              <li><Link href="/admin" className="hover:text-purple-400 transition">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
            <p className="text-gray-400 text-sm mb-2">We accept cryptocurrency:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-800 px-3 py-1 rounded text-xs text-gray-300">Bitcoin</span>
              <span className="bg-slate-800 px-3 py-1 rounded text-xs text-gray-300">USDT</span>
              <span className="bg-slate-800 px-3 py-1 rounded text-xs text-gray-300">Ethereum</span>
              <span className="bg-slate-800 px-3 py-1 rounded text-xs text-gray-300">+100 more</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MyG2G. All rights reserved.</p>
          <p className="mt-2">Built with Next.js & Crypto Payments</p>
        </div>
      </div>
    </footer>
  );
}
