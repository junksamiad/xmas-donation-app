'use client'

export default function GentleProgress() {
  const totalGoal = 125
  const currentHelped = 89
  const remaining = totalGoal - currentHelped
  const progressPercent = (currentHelped / totalGoal) * 100

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Progress story */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
            Our Christmas Journey
          </h2>

          {/* Visual progress with gift boxes */}
          <div className="flex justify-center items-center mb-8 gap-2">
            {[1, 2, 3, 4, 5].map((box) => (
              <div key={box} className="text-4xl md:text-5xl">
                {box <= Math.ceil((currentHelped / totalGoal) * 5) ? '🎁' : '📦'}
              </div>
            ))}
          </div>

          <div className="text-2xl md:text-3xl font-semibold text-slate-700 mb-4">
            Together we&apos;ve helped <span className="text-green-600">{currentHelped}</span> children
          </div>

          <div className="text-lg md:text-xl text-slate-600 mb-8">
            Just <span className="font-semibold text-red-600">{remaining} more</span> to reach Christmas magic for all!
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-200 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="flex justify-between text-sm text-slate-500">
            <span>0 children</span>
            <span className="font-semibold">{Math.round(progressPercent)}% complete</span>
            <span>{totalGoal} children</span>
          </div>
        </div>

        {/* Milestone celebration */}
        <div className="mt-12 p-6 bg-green-50 rounded-2xl border border-green-200">
          <div className="text-lg font-semibold text-green-800 mb-2">
            🎉 Milestone Reached!
          </div>
          <div className="text-green-700">
            We&apos;ve crossed the 75% mark! Christmas magic is spreading through our community.
          </div>
        </div>
      </div>
    </section>
  )
}