import React from 'react';
import { Quote, Building2, Users, FileCheck } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">About MedVerify</h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed px-4">
                        Our mission is to eliminate the distribution of substandard and falsified medical products through transparent, accessible technology.
                    </p>
                </div>

                {/* Content Blocks */}
                <div className="space-y-8">

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Building2 className="text-emerald-500 shrink-0" /> Who We Are
                        </h2>
                        <p className="text-slate-400 mb-4 leading-relaxed text-sm md:text-base">
                            MedVerify is a health-tech initiative designed to bridge the gap between complex regulatory databases and the end patient. In a world where 1 in 10 medical products in developing nations is substandard or falsified, we provide a critical layer of defense.
                        </p>
                        <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                            We are a team of engineers, regulatory experts, and data scientists committed to public health safety.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <FileCheck className="text-blue-500 shrink-0" /> Our Data Integrity
                        </h2>
                        <p className="text-slate-400 mb-4 leading-relaxed text-sm md:text-base">
                            We strictly adhere to a "No Prediction" policy for safety alerts. Our system only flags a medicine as 'Unsafe' if there is a definitive record in:
                        </p>
                        <ul className="list-disc pl-5 text-slate-400 space-y-2 text-sm md:text-base">
                            <li><strong className="text-white">CDSCO</strong> (Central Drugs Standard Control Organisation) - India</li>
                            <li><strong className="text-white">US FDA</strong> (Food and Drug Administration) - USA</li>
                            <li><strong className="text-white">WHO GSMS</strong> (Global Surveillance and Monitoring System)</li>
                        </ul>
                    </div>

                    <div className="bg-emerald-900/10 p-6 md:p-8 rounded-2xl border border-emerald-500/20">
                        <Quote className="text-emerald-500 mb-4" size={24} />
                        <blockquote className="text-lg md:text-xl font-medium text-emerald-100 italic mb-4">
                            "Patient safety is not a luxury; it is a fundamental human right. Technology must serve this right by making safety information instant and undeniable."
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-slate-900">
                                MV
                            </div>
                            <div>
                                <p className="text-white font-bold">MedVerify Team</p>
                                <p className="text-emerald-400 text-sm">Product Vision</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
