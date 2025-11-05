'use client';

import { motion } from 'framer-motion';

const FlyingSanta = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {/* Santa Sleigh Animation */}
      <motion.div
        className="absolute"
        initial={{
          x: "-200px",
          y: "10vh"
        }}
        animate={{
          x: ["calc(-200px)", "calc(100vw + 200px)"],
          y: ["10vh", "8vh", "12vh", "7vh", "11vh", "10vh"]
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 10
          },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <div className="relative">
          {/* Santa and Sleigh emoji/text representation */}
          <div className="text-6xl md:text-8xl transform scale-x-[-1]">
            🎅🦌🛷
          </div>

          {/* Trail effect */}
          <motion.div
            className="absolute left-0 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex space-x-2">
              <span className="text-2xl">✨</span>
              <span className="text-2xl" style={{ animationDelay: '0.1s' }}>⭐</span>
              <span className="text-2xl" style={{ animationDelay: '0.2s' }}>✨</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Alternative version with different timing */}
      <motion.div
        className="absolute"
        initial={{
          x: "calc(100vw + 200px)",
          y: "70vh"
        }}
        animate={{
          x: ["calc(100vw + 200px)", "calc(-200px)"],
          y: ["70vh", "72vh", "68vh", "73vh", "69vh", "70vh"]
        }}
        transition={{
          x: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 15,
            delay: 12
          },
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <div className="text-4xl md:text-6xl">
          🎅🛷
        </div>
      </motion.div>
    </div>
  );
};

export default FlyingSanta;