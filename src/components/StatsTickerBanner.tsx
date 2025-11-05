'use client';

import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import {
  getDonationStats,
  getUnassignedChildrenCount,
  getLatestDonation,
  getTopDepartmentsByCount,
  getUnderperformingGroups,
} from '@/app/actions';

interface StatItem {
  icon: string;
  text: string;
  id: string;
}

export default function StatsTickerBanner() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalChildren] = useState(160); // Total children in database

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          donationStatsResult,
          unassignedCountResult,
          latestDonationResult,
          topDeptsResult,
          underperformingResult,
        ] = await Promise.all([
          getDonationStats(),
          getUnassignedChildrenCount(),
          getLatestDonation(),
          getTopDepartmentsByCount(3),
          getUnderperformingGroups(),
        ]);

        const newStats: StatItem[] = [];

        // Donations stats
        if (donationStatsResult.success) {
          const { totalGiftDonations, totalCashAmount, totalDonations } =
            donationStatsResult.data;

          // Total presents donated (gifts only)
          if (totalGiftDonations > 0) {
            newStats.push({
              icon: '',
              text: `${totalGiftDonations} ${totalGiftDonations === 1 ? 'present' : 'presents'} donated`,
              id: 'total-gifts',
            });
          }

          // Total cash raised
          if (totalCashAmount > 0) {
            newStats.push({
              icon: '',
              text: `£${totalCashAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} raised`,
              id: 'total-cash',
            });
          }

          // Goal percentage - updated wording
          const goalPercentage = Math.round((totalDonations / totalChildren) * 100);
          newStats.push({
            icon: '',
            text: `We're ${goalPercentage}% of the way to bringing Christmas to all ${totalChildren} children!`,
            id: 'goal-percentage',
          });
        }

        // Children waiting (160 - assigned)
        if (unassignedCountResult.success) {
          const count = unassignedCountResult.data;
          if (count > 0) {
            newStats.push({
              icon: '',
              text: `${count} ${count === 1 ? 'child' : 'children'} still waiting for gifts`,
              id: 'waiting-children',
            });
          }
        }

        // Last donation time
        if (latestDonationResult.success && latestDonationResult.data) {
          const { minutesAgo } = latestDonationResult.data;

          const timeText =
            minutesAgo === 0
              ? 'just now'
              : minutesAgo === 1
              ? '1 minute ago'
              : minutesAgo < 60
              ? `${minutesAgo} minutes ago`
              : minutesAgo < 120
              ? '1 hour ago'
              : `${Math.floor(minutesAgo / 60)} hours ago`;

          newStats.push({
            icon: '',
            text: `Last donation: ${timeText}`,
            id: 'last-donation-time',
          });
        }

        // Top 3 departments by total donations
        if (topDeptsResult.success && topDeptsResult.data.length > 0) {
          topDeptsResult.data.forEach((dept, index) => {
            const totalValue = dept.totalCashAmount > 0
              ? `£${dept.totalCashAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `${dept.totalDonations} ${dept.totalDonations === 1 ? 'gift' : 'gifts'}`;

            newStats.push({
              icon: '',
              text: `${dept.name} - ${dept.totalDonations} ${dept.totalDonations === 1 ? 'donation' : 'donations'} (${totalValue})`,
              id: `top-dept-${index}`,
            });
          });
        }

        // CTA for underperforming groups
        if (underperformingResult.success && underperformingResult.data.message) {
          newStats.push({
            icon: '',
            text: underperformingResult.data.message,
            id: 'cta-underperforming',
          });
        }

        setStats(newStats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [totalChildren]);

  // Loading skeleton
  if (isLoading || stats.length === 0) {
    return (
      <div className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-y-4 border-black overflow-hidden shadow-lg">
        <div className="relative h-10 md:h-14 flex items-center px-4 md:px-6">
          <motion.div
            className="flex items-center gap-3 text-black/50 font-bold text-sm md:text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="tracking-wide uppercase font-mono">Loading stats...</span>
          </motion.div>
        </div>
        {/* Diagonal stripes */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, black 0, black 2px, transparent 2px, transparent 10px)',
          }}
        />
      </div>
    );
  }

  // Duplicate stats for seamless infinite scroll
  const duplicatedStats = [...stats, ...stats];

  return (
    <div className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-y-4 border-black overflow-hidden shadow-lg">
      {/* Top star row - Hidden on mobile */}
      <div className="w-full py-1 px-2 hidden md:block">
        <div className="flex justify-around text-black/60 text-sm">
          {Array.from({ length: 30 }).map((_, i) => {
            const stars = ['✦', '✧', '★'];
            return <span key={`top-${i}`}>{stars[i % 3]}</span>;
          })}
        </div>
      </div>

      <div className="relative flex items-center py-1">
        {/* Scrolling container */}
        <motion.div
          className="flex gap-6 lg:gap-12 whitespace-nowrap"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: stats.length * 12, // Faster scroll - 12 seconds per stat item
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {duplicatedStats.map((stat, index) => (
            <div
              key={`${stat.id}-${index}`}
              className="flex items-center gap-4 lg:gap-8 text-black font-bold text-sm lg:text-lg"
            >
              <span
                className="tracking-wide uppercase font-mono"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,215,0,0.2)',
                }}
              >
                {stat.text}
              </span>
              <span className="flex gap-1 text-yellow-600 text-xl">
                <span>★</span>
                <span>★</span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom star row - Hidden on mobile */}
      <div className="w-full py-1 px-2 hidden md:block">
        <div className="flex justify-around text-black/60 text-sm">
          {Array.from({ length: 30 }).map((_, i) => {
            const stars = ['★', '✦', '✧'];
            return <span key={`bottom-${i}`}>{stars[i % 3]}</span>;
          })}
        </div>
      </div>

      {/* Diagonal stripes pattern overlay for "digital board" effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, black 0, black 2px, transparent 2px, transparent 10px)',
        }}
      />
    </div>
  );
}
