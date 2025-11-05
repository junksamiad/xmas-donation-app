'use client'

export default function FriendlyTeams() {
  const teams = [
    { name: 'Engineering', donations: 23, emoji: '💻', medal: '🥇' },
    { name: 'Marketing', donations: 18, emoji: '📢', medal: '🥈' },
    { name: 'Sales', donations: 15, emoji: '💼', medal: '🥉' },
    { name: 'Design', donations: 12, emoji: '🎨', medal: '' },
    { name: 'Operations', donations: 9, emoji: '⚙️', medal: '' },
  ]

  const maxDonations = Math.max(...teams.map(team => team.donations))

  return (
    <section className="py-16 px-4 bg-white/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Team Christmas Spirit
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            Every department is spreading joy this season
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {teams.map((team, _index) => (
            <div
              key={team.name}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{team.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">
                        {team.name}
                      </span>
                      {team.medal && (
                        <span className="text-xl">{team.medal}</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      {team.donations} gifts donated
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{
                        width: `${(team.donations / maxDonations) * 100}%`
                      }}
                    />
                  </div>
                  <span className="font-bold text-lg text-slate-700 min-w-[2rem]">
                    {team.donations}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Encouraging message */}
        <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
          <div className="text-lg font-semibold text-blue-800 mb-2">
            🤝 Join Your Team&apos;s Christmas Spirit!
          </div>
          <div className="text-blue-700">
            Every gift counts, no matter which team you&apos;re on. Together, we&apos;re making Christmas magical.
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors">
            Add Your Team&apos;s Gift
          </button>
        </div>
      </div>
    </section>
  )
}