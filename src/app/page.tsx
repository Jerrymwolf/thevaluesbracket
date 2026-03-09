'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/Logo';

export default function Home() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    router.push('/assess/start');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-white">
      <div className="h-1.5 sm:h-2 bg-prism flex-shrink-0" />

      <header className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-gray-100/50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={handleStart}
            disabled={isStarting}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm sm:text-base font-medium rounded-full transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Start Free →
          </button>
        </nav>
      </header>

      <main className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-prism-subtle" />

        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-4 sm:mb-6">
              <Image
                src="/bracket-hero.png"
                alt="Values Bracket — magnifying glass revealing a tournament bracket"
                width={280}
                height={280}
                className="w-36 h-36 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-contain drop-shadow-lg"
                priority
              />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-900 leading-[1.1] mb-4 sm:mb-6"
            >
              The Values
              <br />
              <span className="bg-prism bg-clip-text text-transparent">Bracket</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Sort your values. Watch them face off. Discover what you stand for.
            </motion.p>

            <motion.div variants={itemVariants} className="mb-6">
              <button
                onClick={handleStart}
                disabled={isStarting}
                className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 min-h-[56px]"
              >
                {isStarting ? 'Starting...' : 'Start the Bracket'}
              </button>
            </motion.div>

            <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-500">
              21 values · ~5 minutes · No signup
            </motion.p>
          </motion.div>
        </div>
      </main>

      <footer className="flex-shrink-0 py-4 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-2">
          <p className="text-xs sm:text-sm text-gray-400">
            Brought to you by Wolf Partners
          </p>
          {/* <a
            href="https://buymeacoffee.com/thew0lf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Coffee size={14} />
            Buy me a coffee
          </a> */}
        </div>
      </footer>
    </div>
  );
}
