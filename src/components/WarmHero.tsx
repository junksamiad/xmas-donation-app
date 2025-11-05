'use client'

export default function WarmHero() {
  return (
    <section className="relative px-4 py-16 text-center">
      {/* Twinkling stars background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" />
        <div className="absolute top-20 right-1/3 w-1 h-1 bg-yellow-200 rounded-full animate-pulse delay-300" />
        <div className="absolute top-32 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-700" />
        <div className="absolute top-16 right-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
          Bring Christmas Magic Home
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-12">
          Every child deserves the wonder of Christmas morning
        </p>

        {/* Village silhouette */}
        <div className="mb-12">
          <div className="text-6xl md:text-8xl mb-4 filter drop-shadow-lg">
            🏠🎄⛪🏫
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent mx-auto opacity-70" />
        </div>

        {/* Key stat */}
        <div className="mb-8">
          <p className="text-2xl md:text-3xl font-semibold text-slate-700 mb-2">
            125 children waiting
          </p>
          <p className="text-lg md:text-xl text-slate-600">
            Your gift lights up a home
          </p>
        </div>

        {/* Main CTA */}
        <button className="bg-red-600 hover:bg-red-700 text-white text-xl md:text-2xl px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
          🎁 Choose a Child to Help
        </button>

        {/* Urgency element */}
        <p className="mt-6 text-slate-500">
          ⏰ 12 days until Christmas delivery
        </p>
      </div>
    </section>
  )
}