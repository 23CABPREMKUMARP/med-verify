import React from 'react';
import { ShieldCheck, Activity, Database, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                                <ShieldCheck size={24} className="text-emerald-500" />
                            </div>
                            <span className="text-xl font-bold text-slate-100">MedVerify</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-4">
                            A regulatory-aware medicine verification platform protecting patients from unsafe and counterfeit drugs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-slate-100 font-bold mb-4 uppercase text-xs tracking-wider">Platform</h3>
                        <ul className="space-y-1 text-sm">
                            <li><a href="/" className="block py-1 hover:text-emerald-400 transition-colors">Home</a></li>
                            <li><a href="/verify" className="block py-1 hover:text-emerald-400 transition-colors">Verify Medicine</a></li>
                            <li><a href="/features" className="block py-1 hover:text-emerald-400 transition-colors">Features</a></li>
                            <li><a href="/about" className="block py-1 hover:text-emerald-400 transition-colors">About Us</a></li>
                        </ul>
                    </div>

                    {/* Data Sources */}
                    <div>
                        <h3 className="text-slate-100 font-bold mb-4 uppercase text-xs tracking-wider">Data Sources</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Database size={14} /> CDSCO (India)
                            </li>
                            <li className="flex items-center gap-2">
                                <Database size={14} /> FDA (United States)
                            </li>
                            <li className="flex items-center gap-2">
                                <Database size={14} /> WHO (Global Alerts)
                            </li>
                        </ul>
                    </div>

                    {/* Legal / Disclaimer */}
                    <div>
                        <h3 className="text-slate-100 font-bold mb-4 uppercase text-xs tracking-wider">Legal Disclaimer</h3>
                        <p className="text-xs leading-relaxed text-slate-500">
                            This platform provides checks against publicly available regulatory safety alerts. It does not certify the chemical authenticity or safety of any specific pill.
                        </p>
                        <div className="mt-4 p-3 bg-red-900/10 border border-red-900/20 rounded text-xs text-red-400">
                            <strong>Emergency?</strong> Contact your local healthcare provider immediately.
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© 2026 Medicine Verification Platform. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
                        <span className="hover:text-slate-300 cursor-pointer">Regulatory Compliance</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
