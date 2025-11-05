'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import SnowEffect from '@/components/SnowEffect';
import DonationModal from '@/components/DonationModal';

interface ShootingStar {
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

  // Generate shooting stars on client-side only to avoid hydration mismatch
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
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

    const stars = [...Array(3)].map((_, i) => ({
      delay: i * 6 + Math.random() * 3,
      direction: directionGenerators[i % directionGenerators.length]()
    }));

    setShootingStars(stars);
  }, []);

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

      {/* Santa Sleigh */}
      <div className="absolute inset-0">
        {shootingStars.map((star, i) => (
          <motion.div
            key={`santa-${i}`}
            className="absolute"
            initial={{
              left: `${star.direction.startX}%`,
              top: `${star.direction.startY}%`,
              opacity: 0,
            }}
            animate={{
              left: `${star.direction.endX}%`,
              top: `${star.direction.endY}%`,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: star.delay,
              repeat: Infinity,
              repeatDelay: 30,
              ease: 'linear',
            }}
          >
            <Image
              src="/Santa Claus on Sleigh with Reindeer.png"
              alt="Santa on sleigh"
              width={180}
              height={90}
              className="object-contain"
              style={{
                transform: star.direction.rotation < 0 ? 'scaleX(-1)' : 'none'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Snow Animation */}
      <SnowEffect />

      {/* Permanent frosted glass overlay */}
      <div className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm pointer-events-none z-30" />

      {/* Modal */}
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
