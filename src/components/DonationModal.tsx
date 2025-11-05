'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-2xl rounded-3xl p-1"
              style={{
                background: 'linear-gradient(135deg, #DC2626 0%, #059669 50%, #DC2626 100%)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Inner modal with gradient background */}
              <div
                className="relative rounded-3xl p-8 md:p-10"
                style={{
                  background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Modal Content */}
                <div className="space-y-8 relative z-10">
                  {/* Header */}
                  <div className="text-center">
                    <motion.h2
                      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-yellow-300 to-green-400 bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      style={{
                        backgroundSize: '200% 200%'
                      }}
                    >
                      Choose a Gift Recipient
                    </motion.h2>
                    <p className="mt-3 text-lg text-gray-300">
                      Select how you'd like to choose a child to help this Christmas
                    </p>
                  </div>

                  {/* Button Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Any Child Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1, ease: 'easeOut' }}
                      className="group relative overflow-hidden text-white font-bold py-8 px-6 rounded-2xl cursor-pointer"
                      style={{
                        background: 'linear-gradient(to bottom, #EF4444, #DC2626)',
                        boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-300/30 to-red-400/0"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <Gift className="w-10 h-10" />
                        <span className="text-xl">Any Child</span>
                      </div>
                    </motion.button>

                    {/* Specify Child Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1, ease: 'easeOut' }}
                      className="group relative overflow-hidden text-white font-bold py-8 px-6 rounded-2xl cursor-pointer"
                      style={{
                        background: 'linear-gradient(to bottom, #10B981, #059669)',
                        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-300/30 to-green-400/0"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 1
                        }}
                      />

                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <Sparkles className="w-10 h-10" />
                        <span className="text-xl">Specify Child</span>
                      </div>
                    </motion.button>
                  </div>

                  {/* Bottom decorative text */}
                  <div className="text-center pt-4">
                    <p className="text-yellow-300 text-sm flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Make a child's Christmas magical</span>
                      <Sparkles className="w-4 h-4" />
                    </p>
                  </div>
                </div>

                {/* Subtle pattern overlay */}
                <div
                  className="absolute inset-0 opacity-5 rounded-3xl pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20px 20px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
