import React from 'react';
import { ShieldCheck, Zap, Database, Globe, Lock, Smartphone } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: "Multi-Authority Verification",
        description: "Our core engine cross-references exact matches against CDSCO (India), FDA (US), and WHO Global Surveillance databases simultaneously."
    },
    {
        icon: Zap,
        title: "Real-Time Safety Alerts",
        description: "Receive instant, full-screen critical alerts (with sound) if a medicine batch is found in a recall list or is marked unsafe."
    },
    {
        icon: Database,
        title: "Comprehensive Drug Database",
        description: "Access a verified list of over 50,000+ approved medicines with official composition and manufacturer data."
    },
    {
        icon: Globe,
        title: "Global Supply Chain Tracking",
        description: "Monitor supply chain integrity by validating batch numbers against known legitimate manufacturing runs."
    },
    {
        icon: Lock,
        title: "Privacy-First Architecture",
        description: "We do not store personal medical history. Your verification queries are anonymized for global analytics only."
    },
    {
        icon: Smartphone,
        title: "Mobile-First Design",
        description: "Designed for use in pharmacies, hospitals, and homes. Works on any device with a camera for barcode scanning."
    }
];

export default function Features() {
    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">System Capabilities</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto px-4">
                        Built to provide the highest standard of pharmaceutical safety verification accessible to everyone.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl hover:border-emerald-500/50 transition-colors group">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform group-hover:bg-emerald-500/20">
                                <feature.icon className="text-emerald-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
