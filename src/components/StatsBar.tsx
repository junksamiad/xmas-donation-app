'use client';

import { motion } from 'framer-motion';

const StatsBar = () => {
  const stats = [
    { label: 'children awaiting gifts', value: '25', icon: '🎁' },
    { label: 'donations made', value: '25', icon: '💝' },
    { label: 'complete', value: '45%', icon: '🎄' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 bg-christmas-green/95 backdrop-blur-sm text-snow-white py-4 px-6 z-30 border-b-4 border-christmas-gold"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center space-x-8 md:space-x-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl" role="img" aria-label={stat.label}>
                {stat.icon}
              </span>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-christmas-gold">
                  {stat.value}
                </div>
                <div className="text-lg md:text-xl font-semibold text-snow-white tracking-wide capitalize">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-red" />
    </motion.div>
  );
};

export default StatsBar;