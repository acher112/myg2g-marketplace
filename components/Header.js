import { useState } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, User } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MyG2G
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:text-purple-400 transition">
              Home
            </Link>
            <Link href="/admin" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition flex items-center gap-2">
              <User size={18} />
              Admin
            </Link>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3 pb-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-left hover:text-purple-400">
              Home
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-left bg-purple-600 px-4 py-2 rounded">
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}