'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';

interface VillageBuilding {
  id: string;
  name: string;
  icon: string;
  stats: {
    primary: string;
    secondary: string;
  };
  lightAnimation: boolean;
}

const buildings: VillageBuilding[] = [
  {
    id: 'home',
    name: 'Children in Need',
    icon: '🧸',
    stats: { primary: '125', secondary: 'children needing gifts' },
    lightAnimation: false
  },
  {
    id: 'shop',
    name: 'Gifts',
    icon: '🎁',
    stats: { primary: '89', secondary: 'presents donated' },
    lightAnimation: false
  },
  {
    id: 'tree',
    name: 'ANS Collaboration',
    icon: '👥',
    stats: { primary: '72%', secondary: 'goal complete' },
    lightAnimation: false
  },
  {
    id: 'hall',
    name: 'Donations',
    icon: '💝',
    stats: { primary: '£2,450', secondary: 'total raised' },
    lightAnimation: false
  }
];

const VillageHero = () => {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  // Generate deterministic positions for stars based on index
  const starPositions = [...Array(50)].map((_, i) => ({
    left: `${(i * 37) % 100}%`,
    top: `${(i * 61) % 100}%`,
    duration: 2 + ((i * 3) % 3),
    delay: (i * 0.7) % 2
  }));

  return (
    <div className="relative min-h-[100vh] bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            🌟 <span className="text-yellow-300">ANS Christmas Donation Campaign</span> 🎄
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-medium">
            👦 Bringing Christmas Magic to More Than 100 Children 👧
          </p>
          <p className="text-lg text-blue-200 mt-2">
            Join your colleagues in spreading joy this holiday season
          </p>
        </motion.div>

        {/* Village Buildings */}
        <div className="flex justify-center items-end space-x-8 md:space-x-16 mb-24">
          {buildings.map((building, index) => (
            <motion.div
              key={building.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredBuilding(building.id)}
              onMouseLeave={() => setHoveredBuilding(null)}
            >
              {/* Building */}
              <motion.div
                className="text-8xl md:text-9xl filter drop-shadow-lg"
                whileHover={{ scale: 1.1 }}
                animate={{
                  filter: hoveredBuilding === building.id
                    ? "drop-shadow(0 0 20px #ffd700) brightness(1.2)"
                    : "drop-shadow(0 10px 20px rgba(0,0,0,0.3)) brightness(1)"
                }}
                transition={{ duration: 0.3 }}
              >
                {building.icon}
              </motion.div>

              {/* Building Label */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-white font-semibold text-sm whitespace-nowrap">
                  {building.name}
                </p>
              </div>

              {/* Hover Tooltip */}
              {hoveredBuilding === building.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-yellow-300/50 min-w-40"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {building.stats.primary}
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {building.stats.secondary}
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </motion.div>
              )}

              {/* Light Effect */}
              {hoveredBuilding === building.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-yellow-300/20 rounded-full blur-xl scale-150"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Main CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <motion.button
            className="bg-gradient-to-r from-red-600 to-green-600 text-white text-xl md:text-2xl font-bold py-6 px-12 rounded-full shadow-2xl border-4 border-yellow-300 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 215, 0, 0.5)",
                "0 0 40px rgba(255, 215, 0, 0.8)",
                "0 0 20px rgba(255, 215, 0, 0.5)"
              ]
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
              scale: { duration: 0.2 }
            }}
          >
            {/* Button Background Animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-30"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />

            <span className="relative z-10 flex items-center justify-center gap-3">
              <motion.span
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                🎁
              </motion.span>
              Light Up a Child's Christmas
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                ✨
              </motion.span>
            </span>
          </motion.button>

          <p className="text-blue-200 mt-4 text-lg">
            🕒 Only <span className="font-bold text-yellow-300">12 days</span> until Christmas delivery
          </p>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-white">
          <path d="M1200 120L0 16.48C0 16.48 200 0 600 0s600 16.48 600 16.48z" />
        </svg>
      </div>
    </div>
  );
};

export default VillageHero;