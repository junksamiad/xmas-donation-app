'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import SnowEffect from '@/components/SnowEffect';
import DepartmentLeaderboard from '@/components/DepartmentLeaderboard';
import StatsBar from '@/components/StatsBar';

const ChristmasPage = () => {
  const [selectedGift, setSelectedGift] = useState<number | null>(null);

  const giftBoxes = [
    { id: 1, x: '15%', y: '70%', size: 'w-12 h-12 md:w-16 md:h-16', delay: 0.2 },
    { id: 2, x: '25%', y: '65%', size: 'w-14 h-14 md:w-20 md:h-20', delay: 0.4 },
    { id: 3, x: '75%', y: '68%', size: 'w-12 h-12 md:w-18 md:h-18', delay: 0.6 },
  ];

  const handleGiftClick = (id: number) => {
    setSelectedGift(id);
    // Add some haptic feedback or sound effect here
    setTimeout(() => setSelectedGift(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-snow-white relative overflow-hidden flex flex-col">
      {/* Snow Effect */}
      <SnowEffect />

      {/* Stats Bar */}
      <StatsBar />

      {/* Department Leaderboard */}
      <DepartmentLeaderboard />

      {/* Main Content */}
      <div className="relative pt-20 flex flex-col items-center min-h-screen">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-6 z-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-christmas-green mb-2 drop-shadow-lg">
            🎄 Christmas Giving Tree 🎄
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto px-4">
            Click on the gift boxes to make a donation and bring joy to children this holiday season.
          </p>
        </motion.div>

        {/* Christmas Tree with Gift Boxes */}
        <div className="relative w-full max-w-6xl mx-auto px-4 flex-1 flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative w-full max-w-3xl aspect-square"
          >
            {/* Christmas Tree Image */}
            <Image
              src="/xmas_tree_image.jpeg"
              alt="Christmas Tree"
              fill
              className="object-contain drop-shadow-2xl"
              priority
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 50vw"
            />

            {/* Gift Boxes */}
            {giftBoxes.map((gift) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: gift.delay }}
                className={`absolute cursor-pointer ${gift.size}`}
                style={{ left: gift.x, top: gift.y }}
                onClick={() => handleGiftClick(gift.id)}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={`relative w-full h-full ${
                  selectedGift === gift.id ? 'animate-pulse' : ''
                }`}>
                  {/* Gift Box */}
                  <div className="w-full h-full bg-christmas-red rounded-lg shadow-lg border-2 border-christmas-gold relative overflow-hidden">
                    {/* Gift Box Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent" />

                    {/* Ribbon Vertical */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-christmas-gold" />

                    {/* Ribbon Horizontal */}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-2 bg-christmas-gold" />

                    {/* Bow */}
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-christmas-gold rounded-full" />
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-lg bg-christmas-gold/20 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-pulse" />

                  {/* Click Effect */}
                  {selectedGift === gift.id && (
                    <motion.div
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 bg-christmas-gold rounded-full"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-6 mb-8 z-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-christmas-green hover:bg-christmas-green/90 text-snow-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 text-base border-2 border-christmas-gold"
          >
            🎁 Make a Donation 🎁
          </motion.button>
        </motion.div>

      </div>

    </div>
  );
};

export default ChristmasPage;