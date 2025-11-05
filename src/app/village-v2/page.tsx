import WarmHero from '@/components/WarmHero'
import GentleProgress from '@/components/GentleProgress'
import FriendlyTeams from '@/components/FriendlyTeams'
import HeartStories from '@/components/HeartStories'

export default function VillageV2() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Gentle snow effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" />
      </div>

      <main className="relative z-10">
        <WarmHero />
        <GentleProgress />
        <FriendlyTeams />
        <HeartStories />
      </main>

      {/* Warm footer */}
      <footer className="bg-green-800 text-white py-8 text-center">
        <p className="text-green-100">
          🎄 Spreading Christmas magic, one gift at a time
        </p>
      </footer>
    </div>
  )
}