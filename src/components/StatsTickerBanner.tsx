'use client';

import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import {
  getDonationStats,
  getUnassignedChildrenCount,
  getLatestDonation,
} from '@/app/actions';

interface StatItem {
  icon: string;
  text: string;
  id: string;
}

export default function StatsTickerBanner() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [totalChildren] = useState(160); // Total children in database

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [donationStatsResult, unassignedCountResult, latestDonationResult] =
          await Promise.all([
            getDonationStats(),
            getUnassignedChildrenCount(),
            getLatestDonation(),
          ]);

        const newStats: StatItem[] = [];

        // Donations stats
        if (donationStatsResult.success) {
          const { totalDonations, totalCashAmount } =
            donationStatsResult.data;

          newStats.push({
            icon: '🎁',
            text: `${totalDonations} ${totalDonations === 1 ? 'present' : 'presents'} donated`,
            id: 'total-donations',
          });

          if (totalCashAmount > 0) {
            newStats.push({
              icon: '💝',
              text: `£${totalCashAmount.toLocaleString()} raised`,
              id: 'total-raised',
            });
          }

          // Goal percentage
          const goalPercentage = Math.round((totalDonations / totalChildren) * 100);
          newStats.push({
            icon: '🎯',
            text: `${goalPercentage}% toward our goal of helping all ${totalChildren} children`,
            id: 'goal-percentage',
          });
        }

        // Unassigned children
        if (unassignedCountResult.success) {
          const count = unassignedCountResult.data;
          if (count > 0) {
            newStats.push({
              icon: '👶',
              text: `${count} ${count === 1 ? 'child' : 'children'} still waiting for gifts`,
              id: 'waiting-children',
            });
          }
        }

        // Latest donation
        if (latestDonationResult.success && latestDonationResult.data) {
          const { donorName, departmentName, donationType, amount, minutesAgo } =
            latestDonationResult.data;

          const timeText =
            minutesAgo === 0
              ? 'just now'
              : minutesAgo === 1
              ? '1 minute ago'
              : `${minutesAgo} minutes ago`;

          const donationText =
            donationType === 'cash' && amount
              ? `£${amount.toFixed(2)}`
              : 'a gift';

          newStats.push({
            icon: '⏰',
            text: `Last donation: ${timeText}`,
            id: 'last-donation-time',
          });

          newStats.push({
            icon: '✨',
            text: `${donorName} from ${departmentName} donated ${donationText}`,
            id: 'last-donation-details',
          });
        }

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    // Initial fetch
    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [totalChildren]);

  if (stats.length === 0) {
    return null;
  }

  // Duplicate stats for seamless infinite scroll
  const duplicatedStats = [...stats, ...stats];

  return (
    <div className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-y-4 border-black overflow-hidden shadow-lg">
      <div className="relative h-14 flex items-center">
        {/* Scrolling container */}
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{
            x: [0, -50 * stats.length + '%'],
          }}
          transition={{
            duration: stats.length * 15, // Even slower scroll - 15 seconds per stat item
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {duplicatedStats.map((stat, index) => (
            <div
              key={`${stat.id}-${index}`}
              className="flex items-center gap-3 text-black font-bold text-lg"
            >
              <span className="text-2xl">{stat.icon}</span>
              <span className="tracking-wide uppercase font-mono">{stat.text}</span>
            </div>
          ))}
        </motion.div>
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
