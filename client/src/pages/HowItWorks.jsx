import React from 'react';
import { Search, Database, ShieldAlert, BadgeCheck } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "1. Enter Medicine Details",
        description: "Input the medicine name, manufacturer, or scan the barcode/QR code on the packaging. The system accepts exact brand names or generic molecule names."
    },
    {
        icon: Database,
        title: "2. Multi-Database Scan",
        description: "The system instantly queries three primary datasets: CDSCO Approved List, FDA Recalls, and WHO Falsified Medical Products alerts."
    },
    {
        icon: ShieldAlert,
        title: "3. Risk Assessment",
        description: "Our logic engine categorizes the result. If a 'Critical' match is found (Banned/Unsafe), the system locks the screen. If no record is found, it flags as 'Unverified'."
    },
    {
        icon: BadgeCheck,
        title: "4. Verification Result",
        description: "You receive a clear Go/No-Go result. Verified medicines show a green shield. Unsafe medicines trigger a red alert with specific actionable guidance."
    }
];

export default function HowItWorks() {
    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">How Verification Works</h1>
                    <p className="text-slate-400">
                        A transparent look at our regulatory compliance workflow.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-slate-800 lg:-ml-0.5"></div>

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div key={index} className={`relative flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-6 lg:left-1/2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-950 -ml-2 lg:-ml-2 z-10"></div>

                                {/* Content */}
                                <div className="ml-16 lg:ml-0 flex-1 hover:scale-105 transition-transform duration-300">
                                    <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-20 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
                                            <step.icon size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                                    </div>
                                </div>

                                {/* Spacer for alternate side */}
                                <div className="hidden lg:block flex-1"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
