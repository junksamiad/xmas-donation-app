'use client';

import { useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

import DonationModal from '@/components/DonationModal';
import SnowEffect from '@/components/SnowEffect';
import StatsTickerBanner from '@/components/StatsTickerBanner';

interface SantaSleigh {
  delay: number;
  direction: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    rotation: number;
  };
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Generate deterministic positions for stars based on index
  const starPositions = [...Array(50)].map((_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${(i * 61) % 100}%`,
    duration: 2 + ((i * 3) % 3),
    delay: (i * 0.7) % 2
  }));

  // Generate Santa sleighs on client-side only to avoid hydration mismatch
  const [santas] = useState<SantaSleigh[]>(() => {
    // Define different direction pattern generators
    const directionGenerators = [
      // Top-left to bottom-right
      () => ({
        startX: Math.random() * 30,
        startY: Math.random() * 20,
        endX: 70 + Math.random() * 30,
        endY: 50 + Math.random() * 30,
        rotation: 45
      }),
      // Top-right to bottom-left
      () => ({
        startX: 70 + Math.random() * 30,
        startY: Math.random() * 20,
        endX: Math.random() * 30,
        endY: 50 + Math.random() * 30,
        rotation: -45
      }),
      // Left to right (more horizontal)
      () => ({
        startX: Math.random() * 20,
        startY: 20 + Math.random() * 40,
        endX: 80 + Math.random() * 20,
        endY: 30 + Math.random() * 40,
        rotation: 20
      }),
    ];

    return [...Array(3)].map((_, i) => ({
      delay: i * 6 + Math.random() * 3,
      direction: directionGenerators[i % directionGenerators.length]()
    }));
  });

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      {/* Starry Background */}
      <div className="absolute inset-0">
        {starPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full"
            style={{
              left: pos.left,
              top: pos.top,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay,
            }}
          />
        ))}
      </div>

      {/* Santa Sleighs */}
      <div className="absolute inset-0">
        {santas.map((santa, i) => (
          <motion.div
            key={`santa-${i}`}
            className="absolute"
            initial={{
              left: `${santa.direction.startX}%`,
              top: `${santa.direction.startY}%`,
              opacity: 0,
            }}
            animate={{
              left: `${santa.direction.endX}%`,
              top: `${santa.direction.endY}%`,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: santa.delay,
              repeat: Infinity,
              repeatDelay: 15,
              ease: 'linear',
            }}
          >
            <Image
              src="/santa.png"
              alt="Santa on sleigh"
              width={180}
              height={90}
              className="object-contain"
              style={{
                transform: santa.direction.rotation < 0 ? 'scaleX(-1)' : 'none'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Snow Animation */}
      <SnowEffect />

      {/* Permanent frosted glass overlay */}
      <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm pointer-events-none z-30" />

      {/* Window Frame Overlay - Below Modal and Tree */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 45 }}>
        <Image
          src="/window-frame.png"
          alt="Window frame"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Stats Ticker Banner - Between window frame and tree */}
      <div className="absolute top-4 left-0 right-0 pointer-events-none" style={{ zIndex: 46 }}>
        <StatsTickerBanner />
      </div>

      {/* ANS Logo - Top left corner, vertically centered with banner */}
      {/* <div
        className="absolute top-12 left-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 px-4 py-2 rounded-sm"
        style={{ zIndex: 47 }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, black 0, black 2px, transparent 2px, transparent 10px)',
          }}
        />
        <Image
          src="/ans_logo.png"
          alt="ANS"
          width={80}
          height={40}
          className="object-contain opacity-90 relative"
        />
      </div> */}

      {/* Christmas Tree - Inside the room with us (no labels) */}
      <motion.div
        className="absolute left-2 bottom-0 pointer-events-none"
        style={{ zIndex: 48 }}
        animate={{
          filter: [
            'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))',
            'drop-shadow(0 0 16px rgba(255, 215, 0, 0.5))',
            'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Image
          src="/tree-no-labels.png"
          alt="Christmas tree"
          width={600}
          height={900}
          className="object-contain"
        />
      </motion.div>

      {/* Donate Now Label - Pulsing CTA on Tree */}
      <motion.div
        className="absolute"
        style={{
          left: '480px',
          bottom: '20px',
          zIndex: 49,
          rotate: -22,
          cursor: isModalOpen ? 'default' : 'pointer',
          filter: isModalOpen ? 'blur(2px)' : 'none',
          opacity: isModalOpen ? 0.5 : 1
        }}
        animate={!isModalOpen ? {
          scale: [1, 1.08, 1],
          filter: [
            'blur(0px) drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))',
            'blur(0px) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
            'blur(0px) drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))'
          ]
        } : {
          scale: 1
        }}
        transition={!isModalOpen ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        } : {
          duration: 0.3
        }}
        onClick={() => !isModalOpen && setIsModalOpen(true)}
        whileHover={!isModalOpen ? { scale: 1.15 } : {}}
        whileTap={!isModalOpen ? { scale: 0.95 } : {}}
      >
        <Image
          src="/donate-label-1.png"
          alt="Donate Now"
          width={250}
          height={125}
          className="object-contain"
          unoptimized
        />
      </motion.div>

      {/* Christmas Campaign Banner - Positioned where modal will appear */}
      {!isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-end pr-4 pointer-events-none" style={{ zIndex: 48, marginTop: '-250px' }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: [1, 1.05, 1],
              filter: [
                'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))',
                'drop-shadow(0 0 16px rgba(255, 215, 0, 0.5))',
                'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
              ]
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.5 },
              x: { duration: 0.5, delay: 0.5 },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              },
              filter: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            style={{ rotate: '20deg' }}
          >
            <Image
              src="/ans-scroll-banner.png"
              alt="ANS Christmas Donations Campaign"
              width={800}
              height={950}
              className="object-contain"
            />
          </motion.div>
        </div>
      )}

      {/* Modal */}
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
