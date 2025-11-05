'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

interface Snowflake {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const generateSnowflakes = () => {
      const flakes: Snowflake[] = [];
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 5 + Math.random() * 5, // Faster: 5-10s instead of 10-20s
          size: 2 + Math.random() * 4,
        });
      }
      setSnowflakes(flakes);
    };

    generateSnowflakes();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-snow-white rounded-full opacity-80"
          style={{
            left: `${flake.x}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, -20, 20, 0],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;