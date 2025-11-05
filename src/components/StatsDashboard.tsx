'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Gift, Users, DollarSign } from 'lucide-react';
import CountUp from 'react-countup';

interface StatCardProps {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
  isPercentage?: boolean;
  isCurrency?: boolean;
  delay?: number;
}

const StatCard = ({ value, label, icon, trend, isPercentage, isCurrency, delay = 0 }: StatCardProps) => {
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group"
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-green-500 text-white group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
          <span>{trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : 'stable'}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl md:text-4xl font-bold text-gray-800">
          {isCurrency && '£'}
          <CountUp
            start={0}
            end={numericValue}
            duration={2}
            delay={delay}
            separator=","
          />
          {isPercentage && '%'}
        </div>
        <p className="text-gray-600 font-medium capitalize">
          {label}
        </p>
      </div>

      {/* Progress bar for visual appeal */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((numericValue / (isPercentage ? 100 : 150)) * 100, 100)}%` }}
          transition={{ duration: 1.5, delay: delay + 0.5 }}
          className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
        />
      </div>
    </motion.div>
  );
};

const StatsDashboard = () => {
  const stats = [
    {
      value: 125,
      label: 'children in need of gifts',
      icon: <Users className="w-6 h-6" />,
      trend: 'down' as const,
    },
    {
      value: 89,
      label: 'presents donated',
      icon: <Gift className="w-6 h-6" />,
      trend: 'up' as const,
    },
    {
      value: 72,
      label: 'goal complete',
      icon: <TrendingUp className="w-6 h-6" />,
      trend: 'up' as const,
      isPercentage: true,
    },
    {
      value: 2450,
      label: 'total raised',
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'up' as const,
      isCurrency: true,
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            📊 <span className="text-green-700">Live Donation Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch our community come together to spread Christmas joy in real-time
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Overall Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                🎯 Christmas Goal Progress
              </h3>
              <p className="text-gray-600">
                We're <span className="font-bold text-green-600">72%</span> of the way to bringing Christmas to all 125 children!
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">72%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          {/* Large Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 2, delay: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 via-red-500 to-green-600 rounded-full relative"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>

            {/* Progress markers */}
            <div className="absolute inset-0 flex items-center">
              {[25, 50, 75].map((marker) => (
                <div
                  key={marker}
                  className="absolute w-0.5 h-6 bg-white/80"
                  style={{ left: `${marker}%`, transform: 'translateX(-50%)' }}
                />
              ))}
            </div>
          </div>

          {/* Milestone markers */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Start</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>Goal!</span>
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-6 text-center"
          >
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-bold text-red-600">35 more children</span> are still waiting for their Christmas magic ✨
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                🚨 Priority: 5 children need urgent gifts
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                🎉 Last donation: 2 minutes ago
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsDashboard;