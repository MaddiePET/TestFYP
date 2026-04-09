"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ChevronLeftIcon from "@/icons/chevron-left.svg"; 

export default function PersonalMalaysianMyKad() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifiedOnMobile, setIsVerifiedOnMobile] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setIsVerifiedOnMobile(true);
        setStep(3);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSubmit = () => {
    if (isVerifiedOnMobile) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.push('/personal/malaysian/phone');
      }, 2000);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 bg-[#F9FAFB] dark:bg-gray-950 overflow-hidden">
      <div className="absolute top-0 left-0 w-full leading-none z-0 pointer-events-none opacity-20">
        <svg className="relative block w-full h-24 sm:h-32 md:h-48 lg:h-64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path className="fill-[#3D405B]/80" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,117.3C672,117,768,171,864,192C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          <path className="fill-[#3D405B]" d="M0,128L48,138.7C96,149,192,171,288,176C384,181,480,171,576,144C672,117,768,75,864,69.3C960,64,1056,96,1152,112C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-full leading-none z-0 pointer-events-none opacity-20">
        <svg className="relative block w-full h-24 sm:h-32 md:h-48 lg:h-64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path className="fill-[#F0CA8E]" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
        </svg>
      </div>

      <header className="absolute top-6 left-4 right-4 flex justify-between items-center max-w-7xl mx-auto w-full z-20">
        <button
          type="button"
          onClick={() => router.push("/personal/nationality_selection")}
          className="inline-flex items-center text-sm text-gray-600 dark:text-white/80 transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Image src="/images/logo/logo-light.svg" alt="Logo" width={40} height={40} className="block dark:invert-0 invert" />
          <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-800 dark:text-white">DTCOB</h1>
        </div>
      </header>

      <main className="relative w-full max-w-2xl z-10">
        <div className="mb-10 text-center">
          <h1 className="mb-3 font-bold text-gray-800 text-title-sm dark:text-white sm:text-title-md">
            Capture Your MyKad
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please scan this QR code with your mobile phone to upload the front and back of your MyKad for verification.
          </p>
        </div>

        <section className="flex flex-col items-center justify-center">
          {step === 1 && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="p-4 bg-white rounded-2xl shadow-lg mb-6 border border-gray-100">
                <Image 
                  src="/images/qr.svg" 
                  alt="Scan QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>
              <button 
                onClick={() => setStep(2)}
                className="text-xs font-bold text-[#F0CA8E] hover:underline tracking-widest"
              >
                Simulate Scan
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-10 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col items-center animate-in fade-in duration-500">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-[#F0CA8E] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#F0CA8E]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 10V3z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center">Connected to Mobile</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">Please follow the instructions on your phone...</p>
            </div>
          )}

          {step === 3 && (
            <div className="p-10 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col items-center animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center">Documents Received</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-8 text-center">
                Your MyKad front and back images have been <br /> captured successfully.
              </p>
              <button 
                onClick={() => { setStep(1); setIsVerifiedOnMobile(false); }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Retake Photos
              </button>
            </div>
          )}
        </section>

        <section className="mt-8 w-full max-w-md mx-auto relative z-10">
          <button
            onClick={handleSubmit}
            disabled={!isVerifiedOnMobile || isLoading}
            className={`inline-flex items-center justify-center w-full px-4 py-3 text-sm font-bold transition rounded-lg ${
                (isVerifiedOnMobile && !isLoading)
                ? 'bg-[#3D405B] text-white hover:bg-[#2c2f42] dark:bg-[#3D405B] dark:hover:bg-[#4a4e6d] shadow-lg shadow-[#3D405B]/20' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
            }`}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
          
          <div className="mt-5 text-center">
            <p className="text-sm font-normal">
                <span className="text-gray-500 dark:text-gray-400">Having trouble? </span>
                <Link 
                  href="/support" 
                  className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Contact Support
                </Link>
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 rounded-xl flex gap-3 border transition-all backdrop-blur-sm bg-amber-50/80 border-amber-200 dark:bg-amber-900/20 dark:border-amber-500/40">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-xs leading-relaxed text-amber-900 dark:text-amber-100">
                <p className="font-bold mb-1 text-amber-800 dark:text-amber-300">Important Notice:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Ensure all details are clearly visible and not cut off.</li>
                  <li>Information is not obscured by fingers or shadows.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl flex gap-3 border transition-all backdrop-blur-sm bg-blue-50/80 border-blue-200 dark:bg-blue-900/30 dark:border-blue-500/50 dark:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <p className="text-xs leading-relaxed text-blue-900 dark:text-blue-100">
                Your data is encrypted and processed securely. We only use this information for <span className="font-bold text-blue-700 dark:text-blue-300">mandatory identity verification</span>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative mt-8 text-xs text-gray-400 dark:text-gray-200 text-center z-10">
        &copy; {new Date().getFullYear()} DTCOB Banking Services. All rights reserved.
      </footer>
    </div>
  );
}