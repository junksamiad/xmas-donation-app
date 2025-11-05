'use client';

import { motion } from 'framer-motion';

interface Department {
  name: string;
  donations: number;
  progress: number;
  color: string;
}

const departments: Department[] = [
  { name: 'Marketing', donations: 12, progress: 60, color: 'bg-christmas-red' },
  { name: 'Sales', donations: 8, progress: 40, color: 'bg-christmas-green' },
  { name: 'Accounts', donations: 5, progress: 25, color: 'bg-christmas-gold' },
];

const DepartmentLeaderboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-1/2 transform -translate-y-1/2 right-6 bg-snow-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-christmas-gold/20 z-20 w-80"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-christmas-green mb-1">
          🎄 Department Leaderboard
        </h3>
        <p className="text-sm text-gray-600">Spreading Christmas Joy</p>
      </div>

      <div className="space-y-4">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-christmas-gold/10"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-semibold text-christmas-green">
                  {dept.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {dept.donations} donations
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-christmas-red">
                  #{index + 1}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dept.progress}%` }}
                transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                className={`h-full ${dept.color} rounded-full relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full" />
              </motion.div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-semibold text-christmas-green">
                {dept.progress}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-christmas-gold/20">
        <div className="text-center">
          <p className="text-sm text-christmas-green font-medium">
            🎁 Total: 25 donations
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Keep spreading the Christmas spirit!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DepartmentLeaderboard;