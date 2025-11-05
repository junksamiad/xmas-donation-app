'use client';

import toast, { Toaster } from 'react-hot-toast';

import DepartmentLeaderboard from '@/components/DepartmentLeaderboard';
import SnowEffect from '@/components/SnowEffect';
import StatsBar from '@/components/StatsBar';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';


const TreePage = () => {
  const handlePresentClick = () => {
    toast.success('🎁 Present selected! Starting donation process...', {
      duration: 4000,
      style: {
        background: '#1e7e34',
        color: '#fff',
        border: '2px solid #ffc107',
        borderRadius: '12px',
        fontSize: '16px',
        padding: '12px 16px'
      },
      iconTheme: {
        primary: '#ffc107',
        secondary: '#1e7e34'
      }
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Snow Effect */}
      <SnowEffect />

      {/* Stats Bar */}
      <StatsBar />

      {/* Department Leaderboard */}
      <DepartmentLeaderboard />

      {/* Full Page Christmas Tree Background */}
      <div
        className="absolute inset-0 pt-20"
        style={{
          backgroundImage: 'url(/xmas_tree_image.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Enhanced Floating Donate Button with Moving Border */}
      <MovingBorderButton
        onClick={handlePresentClick}
        containerClassName="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        title="Make your Christmas donation now!"
        duration={4000}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span style={{ animation: 'giftBounce 1.5s ease-in-out infinite' }}>🎁</span>
          <span>Make A Donation Now</span>
          <span style={{ animation: 'heartPulse 1s ease-in-out infinite' }}>❤️</span>
        </span>
      </MovingBorderButton>

      {/* CSS animations for emoji effects */}
      <style jsx>{`
        @keyframes giftBounce {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.1);
          }
        }

        @keyframes heartPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        /* Mobile responsive adjustments for MovingBorder button */
        @media (max-width: 768px) {
          :global(.group) {
            bottom: 20px !important;
          }
        }
      `}</style>

      {/* React Hot Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'font-medium',
          style: {
            marginTop: '80px' // Account for the stats bar
          }
        }}
      />
    </div>
  );
};

export default TreePage;