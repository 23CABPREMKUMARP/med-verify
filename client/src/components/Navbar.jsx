import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Verify Medicine', path: '/verify' },
        { name: 'Features', path: '/features' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="w-full px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <NavLink to="/" className="flex items-center space-x-3 group">
                        <div className="bg-emerald-500 p-2.5 rounded-xl group-hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/20">
                            <ShieldCheck size={28} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                            MedVerify
                        </span>
                    </NavLink>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-10">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-base font-bold transition-all duration-200 tracking-wide ${isActive
                                        ? 'text-emerald-400'
                                        : 'text-slate-400 hover:text-white'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-400 hover:text-white focus:outline-none p-2"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 h-screen">
                    <div className="px-6 pt-8 pb-6 space-y-4 flex flex-col justify-center h-2/3">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-6 py-5 rounded-2xl text-2xl font-bold text-center transition-all duration-200 ${isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
