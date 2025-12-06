import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            {/* Logo image */}
            <Image
              src="/logo.png"
              alt="MyG2G logo"
              width={65}
              height={65}
              className="rounded-md"
            />
            {/* Text */}
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MyG2G
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:text-purple-400 transition">
              Home
            </Link>
            <Link href="/contact" className="hover:text-purple-400 transition">
              Contact
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
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left hover:text-purple-400"
            >
              Home
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left hover:text-purple-400"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
