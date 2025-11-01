'use client';

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-20">
        {/* Logo with fade-in animation */}
        <div className="mb-12 animate-fade-in">
          <Image
            className="dark:invert transition-transform hover:scale-105 duration-300"
            src="/next.svg"
            alt="Next.js logo"
            width={220}
            height={46}
            priority
          />
        </div>

        {/* Hero section */}
        <div className="max-w-4xl text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent animate-fade-in-up">
            Build the Future
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light animate-fade-in-up animation-delay-200">
            Create lightning-fast web experiences with Next.js
          </p>
        </div>

        {/* Interactive cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-2xl w-full animate-fade-in-up animation-delay-400">
          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Quick Start</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Edit <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm font-mono">src/app/page.tsx</code> and see changes instantly
            </p>
          </div>

          <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Hot Reload</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Experience instant feedback with automatic page updates as you code
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4 items-center flex-col sm:flex-row mb-16 animate-fade-in-up animation-delay-600">
          <Link
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base px-8 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
            href="/services"
          >
            <span className="relative z-10 flex items-center gap-2">
              Browse Services
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <a
            className="rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-100 font-semibold text-base px-8 py-4 transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>

        {/* Resource links */}
        <div className="flex gap-8 flex-wrap items-center justify-center animate-fade-in-up animation-delay-800">
          <a
            className="group flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
              <Image
                aria-hidden
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
              />
            </div>
            <span className="font-medium">Learn</span>
          </a>
          <a
            className="group flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="https://vercel.com/templates?framework=next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
              <Image
                aria-hidden
                src="/window.svg"
                alt="Window icon"
                width={16}
                height={16}
              />
            </div>
            <span className="font-medium">Examples</span>
          </a>
          <a
            className="group flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
              <Image
                aria-hidden
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
              />
            </div>
            <span className="font-medium">nextjs.org →</span>
          </a>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}