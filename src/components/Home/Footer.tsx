"use client";

import { useState } from 'react';
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ArrowUp,
    Heart
} from 'lucide-react';
import { LeafyGreen } from 'lucide-react';

const Footer = () => {
    const [emailSubscribe, setEmailSubscribe] = useState("");
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailSubscribe) {
            setIsEmailSubmitted(true);
            setTimeout(() => setIsEmailSubmitted(false), 3000);
            setEmailSubscribe("");
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gradient-to-b from-green-600 to-green-900 text-white">
            <div className="container mx-auto max-w-6xl px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold flex items-center gap-2"> <LeafyGreen className="w-6 h-6" />
                            Leafstyle</h3>
                        <p className="text-gray-300">
                            Platform jual beli barang bekas dan karya seni terpercaya
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-green-400 transition-colors">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="#" className="hover:text-green-400 transition-colors">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="#" className="hover:text-green-400 transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                            <a href="#" className="hover:text-green-400 transition-colors">
                                <Youtube className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Tentang Kami', 'Cara Kerja', 'Keamanan', 'Kategori', 'Blog'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-white hover:underline transition-all transform hover:translate-x-2 inline-block"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-green-400" />
                                <span className="text-gray-300">support@secondhand.id</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-green-400" />
                                <span className="text-gray-300">+62 123 4567 890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-green-400" />
                                <span className="text-gray-300">Jakarta, Indonesia</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                        <form onSubmit={handleEmailSubmit} className="space-y-3">
                            <input
                                type="email"
                                value={emailSubscribe}
                                onChange={(e) => setEmailSubscribe(e.target.value)}
                                placeholder="Masukkan email Anda"
                                className="w-full px-4 py-2 rounded-lg bg-green-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            <button
                                type="submit"
                                className={`w-full px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105
                  ${isEmailSubmitted
                                    ? 'bg-green-400 text-green-900'
                                    : 'bg-green-500 hover:bg-green-400'
                                }`}
                            >
                                {isEmailSubmitted ? 'Terima kasih! ✓' : 'Berlangganan'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-green-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-300 flex items-center">
                        © 2024 SecondHand. Made with <Heart className="w-4 h-4 text-red-400 mx-1" /> in Indonesia
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="bg-green-700 p-2 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;