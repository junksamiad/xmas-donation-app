'use client';

import VillageHero from '@/components/VillageHero';
import StatsDashboard from '@/components/StatsDashboard';
import EnhancedDepartmentLeaderboard from '@/components/EnhancedDepartmentLeaderboard';
import SnowEffect from '@/components/SnowEffect';
import toast, { Toaster } from 'react-hot-toast';

const VillagePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Snow Effect */}
      <SnowEffect />

      {/* Village Hero Section */}
      <VillageHero />

      {/* Stats Dashboard */}
      <StatsDashboard />

      {/* Enhanced Department Leaderboard */}
      <EnhancedDepartmentLeaderboard />

      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'font-medium',
          style: {
            marginTop: '20px'
          }
        }}
      />
    </div>
  );
};

export default VillagePage;