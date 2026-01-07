import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserMultiFormatReader } from '@zxing/library';
import {
    ShieldCheck, Search, ScanLine, AlertTriangle, CheckCircle, Activity,
    Box, X, Info
} from 'lucide-react';
import InteractiveScanner from '../components/3d/scenes/InteractiveScanner';

export default function Verify() {
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [medicineInput, setMedicineInput] = useState('');
    const [batchInput, setBatchInput] = useState('');
    const [manufacturerInput, setManufacturerInput] = useState('');

    // Barcode Scanner State
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef(null);
    const codeReader = useRef(new BrowserMultiFormatReader());

    useEffect(() => {
        if (isScanning && videoRef.current) {
            codeReader.current.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
                if (result) {
                    setMedicineInput(result.getText());
                    setIsScanning(false);
                    codeReader.current.reset();
                }
            });
        }
        return () => {
            if (codeReader.current) {
                codeReader.current.reset();
            }
        };
    }, [isScanning]);

    const stopScanning = () => {
        setIsScanning(false);
        codeReader.current.reset();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setVerificationResult(null);

        try {
            const response = await axios.post('/api/medicine/verify', {
                medicineInput,
                batchNumber: batchInput,
                manufacturerInput,
            });

            setVerificationResult(response.data);
        } catch (error) {
            console.error('Verification Error:', error);
            setVerificationResult({
                verification_status: 'ERROR',
                medicine_details: {},
                disclaimer: 'System Error. Please ensure backend is running.'
            });
        } finally {
            setLoading(false);
        }
    };

    // --- FULL SCREEN MODAL ---
    const [showResultModal, setShowResultModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false); // State for exit animation
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (verificationResult) {
            setShowResultModal(true);

            const backendStatus = verificationResult.verification_status;
            let uiStatus = 'NOT_VERIFIED';
            if (backendStatus === 'VERIFIED') uiStatus = 'VERIFIED';
            else if (backendStatus === 'UNSAFE') uiStatus = 'UNSAFE';
            else if (backendStatus === 'NO_ALERT_FOUND') uiStatus = 'NOT_VERIFIED';

            let soundSrc = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";
            if (uiStatus === 'UNSAFE') soundSrc = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";
            else if (uiStatus === 'VERIFIED') soundSrc = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";

            if (!isMuted && audioRef.current !== soundSrc) {
                const audio = new Audio(soundSrc);
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Audio autoplay blocked', e));
                audioRef.current = soundSrc;
            }
        } else {
            setShowResultModal(false);
            audioRef.current = null;
        }
    }, [verificationResult, isMuted]);

    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowResultModal(false);
            setIsClosing(false);
        }, 500);
    };

    const FullScreenResultModal = () => {
        // Keep component mounted during closing animation
        if ((!showResultModal && !isClosing) || !verificationResult) return null;

        const { verification_status, medicine_details, alert_details, authority, regulatory_checks, confidence_score } = verificationResult;

        let uiStatus = 'NOT_VERIFIED';
        if (verification_status === 'VERIFIED') uiStatus = 'VERIFIED';
        else if (verification_status === 'UNSAFE') uiStatus = 'UNSAFE';

        let theme = {
            bg: "bg-amber-950", border: "border-amber-500", text: "text-amber-50", iconBg: "bg-amber-600", iconColor: "text-white",
            icon: AlertTriangle,
            heading: "MEDICINE COULD NOT BE VERIFIED",
            subtext: "Not found in official regulatory or open-source databases.",
            guidance: "Verify packaging and consult a pharmacist."
        };

        if (uiStatus === 'UNSAFE') {
            theme = {
                bg: "bg-red-950", border: "border-red-600", text: "text-red-50", iconBg: "bg-red-600", iconColor: "text-white",
                icon: AlertTriangle,
                heading: "OFFICIAL SAFETY ALERT – DO NOT USE",
                subtext: "This medicine has been reported as unsafe by a regulatory authority.",
                guidance: "Do not consume. Isolate package immediately."
            };
        } else if (uiStatus === 'VERIFIED') {
            theme = {
                bg: "bg-emerald-950", border: "border-emerald-500", text: "text-emerald-50", iconBg: "bg-emerald-500", iconColor: "text-white",
                icon: ShieldCheck,
                heading: "VERIFIED MEDICINE",
                subtext: "No regulatory safety alerts found.",
                guidance: "Result based on publicly available regulatory safety data."
            };
        }

        return (
            <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${isClosing ? 'opacity-0 backdrop-blur-none' : 'opacity-100'}`}>
                <div className={`absolute inset-0 ${uiStatus === 'UNSAFE' ? 'bg-red-950/95' : (uiStatus === 'VERIFIED' ? 'bg-emerald-950/95' : 'bg-slate-950/95')} backdrop-blur-xl transition-opacity duration-500`}></div>

                <div className={`relative ${theme.bg} border-2 ${theme.border} rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-500 transform ${isClosing ? 'scale-90 opacity-0 translate-y-4' : 'scale-100 opacity-100 translate-y-0'} animate-in zoom-in-95 slide-in-from-bottom-5`}>

                    <div className="p-5 md:p-8 flex items-start justify-between border-b border-white/10">
                        <div className="flex items-center gap-6">
                            <div className={`${theme.iconBg} p-5 rounded-full shadow-lg ${uiStatus === 'UNSAFE' ? 'animate-pulse' : ''}`}>
                                <theme.icon className={`${theme.iconColor} h-12 w-12`} />
                            </div>
                            <div>
                                <h2 className={`text-3xl font-black ${theme.text} uppercase tracking-wider leading-tight`}>{theme.heading}</h2>
                                <p className={`text-lg opacity-90 ${theme.text} mt-2 font-medium`}>{theme.subtext}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-colors border border-white/10">
                            {isMuted ? <span className="opacity-50 line-through text-xs">🔇 OFF</span> : <span className="text-xs">🔊 ON</span>}
                        </button>
                    </div>

                    <div className="p-5 md:p-8 space-y-6 md:space-y-8 overflow-y-auto">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className={`px-4 py-2 rounded-lg border bg-black/20 ${theme.border} flex items-center gap-3`}>
                                <div className={`h-3 w-3 rounded-full ${theme.iconBg} ${uiStatus === 'UNSAFE' ? 'animate-ping' : ''}`}></div>
                                <span className={`font-bold uppercase ${theme.text} tracking-wider`}>Status: {uiStatus.replace('_', ' ')}</span>
                            </div>
                            {confidence_score > 0 && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded bg-black/20 border border-white/10">
                                    <span className="text-xs uppercase text-slate-400 font-bold">Confidence</span>
                                    <span className={`text-xl font-bold ${confidence_score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{confidence_score}%</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6 bg-black/20 rounded-xl border border-white/5">
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Medicine Name</p>
                                <p className="text-white font-bold text-2xl capitalize">
                                    {medicine_details?.brand_name || medicineInput || 'Unknown'}
                                </p>
                            </div>
                            <div><p className="text-slate-400 text-xs uppercase font-bold mb-1">Manufacturer</p><p className="text-white font-semibold text-lg">{(medicine_details?.manufacturer && medicine_details.manufacturer !== medicine_details.brand_name) ? medicine_details.manufacturer : (manufacturerInput || 'Refer to Packaging')}</p></div>
                            <div><p className="text-slate-400 text-xs uppercase font-bold mb-1">Dosage Form</p><p className="text-slate-200">{medicine_details?.dosage_form || 'N/A'}</p></div>
                            <div><p className="text-slate-400 text-xs uppercase font-bold mb-1">Generic / Salt</p><p className="text-slate-200">{medicine_details?.generic_name || 'N/A'}</p></div>
                        </div>

                        {uiStatus === 'UNSAFE' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <div className="p-6 bg-red-950/50 border border-red-500/50 rounded-xl">
                                    <p className="text-red-400 text-xs uppercase font-bold mb-3 tracking-wider flex items-center gap-2">
                                        <AlertTriangle size={14} /> Regulatory Safety Information
                                    </p>
                                    <p className="text-white font-bold text-xl md:text-2xl leading-snug">"{alert_details?.summary}"</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-red-500/20">
                                        <div><p className="text-xs text-red-300 uppercase">Issuing Authority</p><p className="text-white font-mono">{authority}</p></div>
                                        <div><p className="text-xs text-red-300 uppercase">Reference ID</p><p className="text-white font-mono">{alert_details?.reference_id}</p></div>
                                    </div>
                                </div>
                                {verificationResult.historical_uses && verificationResult.historical_uses.length > 0 && (
                                    <div className="p-5 bg-slate-900/80 border border-slate-700 rounded-lg">
                                        <h4 className="text-slate-300 font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wide"><Info size={16} /> Historical / Misuse-Related Uses</h4>
                                        <p className="text-sm text-slate-500 mb-3 italic">Previously used for the following, but now restricted:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {verificationResult.historical_uses.map((use, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-400 line-through decoration-red-500 decoration-2">{use}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Regulatory Checks Visualization */}
                        {uiStatus !== 'UNSAFE' && regulatory_checks && (
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                <p className="text-slate-400 text-xs uppercase font-bold mb-3">Database Checks</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(regulatory_checks).map(([key, check]) => (
                                        <div key={key} className={`flex items-center gap-2 p-2 rounded ${check.status === 'pass' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'}`}>
                                            {check.status === 'pass' ? <CheckCircle size={14} /> : <Activity size={14} />}
                                            <span className="uppercase font-bold text-xs">{key}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-lg border-l-4 border-white/20">
                            <Info className="text-white shrink-0 mt-0.5" />
                            <div><strong className="text-white block mb-1">Guidance</strong><p className="text-slate-300 leading-relaxed">{theme.guidance}</p></div>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 bg-black/40 border-t border-white/10 flex justify-end">
                        <button onClick={handleCloseModal} className={`w-full md:w-auto px-6 py-4 ${uiStatus === 'UNSAFE' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'} text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg uppercase tracking-wide hover:scale-105 active:scale-95`}>
                            {uiStatus === 'UNSAFE' ? 'I Understand – Close Alert' : 'Continue'} <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative h-screen bg-slate-950 overflow-hidden flex flex-col pt-16">
            <InteractiveScanner
                medicineInput={medicineInput}
                batchInput={batchInput}
                manufacturerInput={manufacturerInput}
                loading={loading}
            />

            {/* Inner Scrollable Container */}
            <div className="relative z-10 flex-1 overflow-y-auto w-full">
                <div className="min-h-full flex flex-col justify-center px-6 lg:px-12 w-full py-10">
                    <FullScreenResultModal />

                    {/* Hide Header when Result is shown to save space */}
                    {(!verificationResult || showResultModal) && (
                        <div className="text-center space-y-4 mb-10 transition-all duration-300">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                                Secure Medicine <span className="text-emerald-400">Verification</span>
                            </h1>
                            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                                Cross-reference medicines against CDSCO, FDA, and WHO live databases.
                            </p>
                        </div>
                    )}

                    <div className={`max-w-4xl mx-auto w-full glass-panel relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl transition-all duration-500 ${verificationResult && !showResultModal ? 'p-6 md:p-8' : 'p-8 md:p-10'}`}>
                        <form onSubmit={handleVerify} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-base font-medium text-slate-300">Medicine Name *</label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-4 text-slate-500" size={20} />
                                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-lg text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Amoxicillin" value={medicineInput} onChange={(e) => setMedicineInput(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-base font-medium text-slate-300">Manufacturer</label>
                                    <div className="relative">
                                        <Activity className="absolute left-4 top-4 text-slate-500" size={20} />
                                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-lg text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Sun Pharma" value={manufacturerInput} onChange={(e) => setManufacturerInput(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-base font-medium text-slate-300">Batch Number (Optional)</label>
                                    <div className="relative">
                                        <Box className="absolute left-4 top-4 text-slate-500" size={20} />
                                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-lg text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Check packaging" value={batchInput} onChange={(e) => setBatchInput(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-center pt-2">
                                <button type="submit" className="w-full md:w-auto flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 text-lg">
                                    {loading ? <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></span> : <><ShieldCheck size={24} /> Verify Medicine</>}
                                </button>
                                <button type="button" onClick={() => setIsScanning(true)} className="w-full md:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 border border-slate-700 text-lg">
                                    <ScanLine size={24} /> Scan
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 3. Modern Result Layout Panel */}
                    {!showResultModal && !isClosing && verificationResult && (
                        <div className="max-w-4xl mx-auto mt-8 w-full animate-in slide-in-from-bottom-10 fade-in duration-700 fill-mode-forwards pb-12">

                            {/* Status Badge Header */}
                            <div className={`rounded-t-2xl p-6 flex items-center justify-between shadow-lg ${verificationResult.verification_status === 'VERIFIED' ? 'bg-gradient-to-r from-emerald-900 to-emerald-950 border-b border-emerald-800/50' :
                                (verificationResult.verification_status === 'UNSAFE' ? 'bg-gradient-to-r from-red-900 to-red-950 border-b border-red-800/50' :
                                    'bg-gradient-to-r from-amber-900 to-amber-950 border-b border-amber-800/50')
                                }`}>
                                <div className="flex items-center gap-4">
                                    {verificationResult.verification_status === 'VERIFIED' && <div className="bg-emerald-500 rounded-full p-2"><ShieldCheck className="text-white" size={28} /></div>}
                                    {verificationResult.verification_status === 'UNSAFE' && <div className="bg-red-500 rounded-full p-2"><AlertTriangle className="text-white" size={28} /></div>}
                                    {(verificationResult.verification_status !== 'VERIFIED' && verificationResult.verification_status !== 'UNSAFE') && <div className="bg-amber-500 rounded-full p-2"><Activity className="text-slate-900" size={28} /></div>}

                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider leading-tight">
                                            {verificationResult.verification_status === 'VERIFIED'
                                                ? (verificationResult.verification_level === 'GLOBAL_APPROVAL' ? 'Verified (Global)' : 'Verified')
                                                : (verificationResult.verification_status === 'UNSAFE' ? 'Unsafe / Restricted' : 'Not Verified')
                                            }
                                        </h2>
                                    </div>
                                </div>
                                {verificationResult.confidence_score > 0 &&
                                    <div className="text-right">
                                        <span className={`text-3xl font-black ${verificationResult.confidence_score > 80 ? 'text-emerald-400' : 'text-amber-400'
                                            }`}>{verificationResult.confidence_score}%</span>
                                    </div>
                                }
                            </div>

                            <div className="bg-slate-900/80 backdrop-blur-md border-x border-b border-slate-700/50 rounded-b-2xl shadow-2xl overflow-hidden">

                                {/* Medicine Overview Card */}
                                <div className="p-8 border-b border-white/5 grid md:grid-cols-[2fr_1fr] gap-6 items-center">
                                    <div>
                                        <h3 className="text-3xl font-black text-white capitalize tracking-tight mb-2">
                                            {verificationResult.medicine_details?.brand_name || medicineInput}
                                        </h3>
                                        <div className="flex flex-wrap gap-3 items-center text-slate-300">
                                            <span className="font-medium text-lg">{verificationResult.medicine_details?.generic_name || 'Generic Name N/A'}</span>
                                            <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-slate-600"></span>
                                            <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wide text-slate-400">
                                                {verificationResult.medicine_details?.dosage_form || 'Medicine'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price Information (Visually Safe) */}
                                    <div className={`p-4 rounded-xl border ${verificationResult.verification_status === 'VERIFIED' ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-slate-950/40 border-slate-700'}`}>
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-slate-500 text-xs font-bold uppercase">Price</span>
                                            <span className={`text-2xl font-mono font-bold ${verificationResult.verification_status === 'VERIFIED' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                                {verificationResult.medicine_details?.price || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chemical & Use Details */}
                                <div className="grid md:grid-cols-2">
                                    {/* Chemical Column */}
                                    <div className="p-8 border-b md:border-b-0 md:border-r border-white/5">
                                        <h4 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                                            <Activity size={18} className="text-blue-400" /> Composition
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(verificationResult.medicine_details?.composition) ? (
                                                verificationResult.medicine_details.composition.map((comp, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 font-medium">
                                                        {comp}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-500 italic text-sm">Data unavailable</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Therapeutic Uses Column */}
                                    <div className="p-8">
                                        <h4 className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                                            <CheckCircle size={18} className="text-emerald-500" /> Uses
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(verificationResult.medicine_details?.uses) ? (
                                                verificationResult.medicine_details.uses.slice(0, 3).map((use, i) => (
                                                    <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-900/20 border border-emerald-800/30 rounded-lg text-sm text-emerald-200/80">
                                                        {use}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-slate-500 italic text-sm">No data</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Source Highlight */}
                                <div className="bg-black/20 p-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase">
                                        <ShieldCheck size={18} /> Source Check
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs font-bold ${verificationResult.verification_level === 'GLOBAL_APPROVAL' ? 'text-slate-500' : 'text-emerald-400'}`}>
                                            {verificationResult.cdsco_status || 'CDSCO'}
                                        </span>
                                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs font-bold text-emerald-400">FDA</span>
                                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs font-bold text-emerald-400">WHO</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                    {isScanning && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                            <div className="bg-slate-900 p-6 rounded-2xl max-w-lg w-full relative border border-slate-700 mx-4">
                                <button onClick={stopScanning} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 rounded-full p-2"><X size={20} /></button>
                                <h3 className="text-xl font-bold mb-4 text-center text-white">Scan Barcode</h3>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                                    <video ref={videoRef} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    );
}
