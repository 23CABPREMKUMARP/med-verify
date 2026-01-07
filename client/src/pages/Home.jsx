import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Search, AlertTriangle, ArrowRight } from 'lucide-react';
import HeroScene from '../components/3d/scenes/HeroScene';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-colors group">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="text-white" size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
);

export default function Home() {
    return (
        <div className="bg-slate-950">

            {/* HERO SECTION */}
            <section className="relative overflow-hidden min-h-screen flex items-center pt-24 lg:pt-0">
                <div className="w-full px-6 lg:px-12 py-12 lg:py-0 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center h-full">

                    {/* Text Content */}
                    <div className="space-y-8 z-10 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold w-fit tracking-wide">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            Live Regulatory Updates Active
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05]">
                            Verify Medicines. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Protect Lives.
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-xl leading-relaxed font-medium">
                            A regulatory-aware system that checks medicines against official safety alerts from <strong className="text-white">CDSCO, FDA, and WHO</strong> in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 pt-4">
                            <Link to="/verify" className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] text-lg">
                                <Search size={24} /> Verify Medicine Now
                            </Link>
                            <Link to="/how-it-works" className="px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-700 text-lg">
                                How It Works <ArrowRight size={24} />
                            </Link>
                        </div>

                        <div className="pt-10 grid grid-cols-3 gap-8 border-t border-slate-800/50">
                            <div>
                                <h4 className="text-3xl lg:text-4xl font-black text-white">50k+</h4>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Banned Drugs</p>
                            </div>
                            <div>
                                <h4 className="text-3xl lg:text-4xl font-black text-white">3</h4>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Major Authorities</p>
                            </div>
                            <div>
                                <h4 className="text-3xl lg:text-4xl font-black text-white">100%</h4>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Source Transparency</p>
                            </div>
                        </div>
                    </div>

                    {/* 3D Content */}
                    <div className="relative h-[400px] md:h-[600px] lg:h-[800px] w-full flex items-center justify-center lg:justify-end mt-0">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
                        <Suspense fallback={<div className="text-white">Loading 3D Visuals...</div>}>
                            <HeroScene />
                        </Suspense>
                    </div>
                </div>
            </section>

            {/* FEATURES PREVIEW */}
            <section className="py-20 bg-slate-900/50 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-white mb-4">Why MedVerify?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            We aggregate data from standard regulatory bodies to provide a unified safety check layer for patient safety.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Multi-Authority Check"
                            description="Standardized verification against CDSCO (India), FDA (US), and WHO (Global) databases."
                            color="bg-emerald-500"
                        />
                        <FeatureCard
                            icon={AlertTriangle}
                            title="Instant Safety Alerts"
                            description="Receive full-screen critical alerts if a medicine is found in banned or recall lists."
                            color="bg-red-500"
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Real-Time Analysis"
                            description="Advanced matching algorithms identify high-risk unverified medicines instantly."
                            color="bg-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-br from-slate-900 to-black p-12 rounded-3xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 p-32 bg-blue-500/10 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
                            Ready to verify your medicine?
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto relative z-10">
                            Ensure the safety of your medication. It takes less than 5 seconds to run a comprehensive regulatory check.
                        </p>
                        <Link to="/verify" className="inline-block px-10 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors relative z-10">
                            Start Verification
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
