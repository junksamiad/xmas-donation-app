'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';

interface DepartmentRanking {
  rank: number;
  name: string;
  donations: number;
  progress: number;
  badge: string;
  trend: 'rising' | 'falling' | 'same';
  color: string;
  totalAmount: number;
}

const departments: DepartmentRanking[] = [
  {
    rank: 1,
    name: 'Marketing Team',
    donations: 42,
    progress: 89,
    badge: '🔥',
    trend: 'rising',
    color: 'from-yellow-400 to-yellow-600',
    totalAmount: 1250
  },
  {
    rank: 2,
    name: 'Sales Force',
    donations: 31,
    progress: 67,
    badge: '⚡',
    trend: 'rising',
    color: 'from-gray-300 to-gray-400',
    totalAmount: 890
  },
  {
    rank: 3,
    name: 'Finance Dept',
    donations: 18,
    progress: 45,
    badge: '📈',
    trend: 'same',
    color: 'from-amber-600 to-amber-700',
    totalAmount: 625
  },
  {
    rank: 4,
    name: 'Operations',
    donations: 12,
    progress: 32,
    badge: '🚀',
    trend: 'falling',
    color: 'from-slate-400 to-slate-500',
    totalAmount: 410
  },
  {
    rank: 5,
    name: 'IT Department',
    donations: 8,
    progress: 22,
    badge: '💻',
    trend: 'rising',
    color: 'from-slate-400 to-slate-500',
    totalAmount: 280
  }
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return <Trophy className="w-5 h-5 text-gray-500" />;
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'rising':
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'falling':
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    default:
      return <Minus className="w-4 h-4 text-gray-500" />;
  }
};

const DepartmentCard = ({ dept, index }: { dept: DepartmentRanking; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative bg-white rounded-xl p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 group ${
        dept.rank === 1 ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-white' :
        dept.rank === 2 ? 'border-gray-300 bg-gradient-to-r from-gray-50 to-white' :
        dept.rank === 3 ? 'border-amber-300 bg-gradient-to-r from-amber-50 to-white' :
        'border-gray-200'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Rank Badge */}
      <div className={`absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-r ${dept.color} flex items-center justify-center shadow-lg`}>
        {getRankIcon(dept.rank)}
      </div>

      {/* Special Crown Effect for #1 */}
      {dept.rank === 1 && (
        <motion.div
          className="absolute -top-1 -right-1 text-2xl"
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          👑
        </motion.div>
      )}

      <div className="flex justify-between items-start mb-4 ml-6">
        <div>
          <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors">
            {dept.name}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-600">{dept.donations} donations</span>
            <span className="text-lg">{dept.badge}</span>
            {getTrendIcon(dept.trend)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            ${dept.totalAmount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">total raised</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Goal Progress</span>
          <span className="text-sm font-bold text-gray-800">{dept.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${dept.progress}%` }}
            transition={{ duration: 1.5, delay: index * 0.15 + 0.5 }}
            className={`h-full bg-gradient-to-r ${dept.color} rounded-full relative`}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
        💝 Last donation: {5 + (index * 7) % 25} minutes ago
      </div>
    </motion.div>
  );
};

const EnhancedDepartmentLeaderboard = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🏆 <span className="text-red-600">Department Giving Challenge</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch the friendly competition unfold as teams race to spread Christmas joy
          </p>
        </motion.div>

        {/* Competition Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">5</div>
              <div className="text-gray-600 font-medium">Teams Competing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">111</div>
              <div className="text-gray-600 font-medium">Total Donations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                Marketing <span className="text-lg">leads by</span> 11
              </div>
              <div className="text-gray-600 font-medium">Current Leader</div>
            </div>
          </div>
        </motion.div>

        {/* Department Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {departments.map((dept, index) => (
            <DepartmentCard key={dept.name} dept={dept} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            🎯 Help Your Team Climb the Leaderboard!
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Every donation counts toward your department&apos;s ranking. Will Marketing maintain their lead,
            or will another team surge ahead in the final stretch?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button
              className="bg-gradient-to-r from-green-600 to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎁 Donate for Your Team
            </motion.button>

            <div className="text-sm text-gray-500">
              <span className="font-medium">🔥 Hot streak:</span> Marketing has donated 3 times in the last hour!
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedDepartmentLeaderboard;