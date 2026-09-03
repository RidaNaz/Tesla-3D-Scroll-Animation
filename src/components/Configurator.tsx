import type { RoadsterConfig } from './Roadster'

type ConfiguratorProps = {
  config: RoadsterConfig
  onChange: (config: RoadsterConfig) => void
}

const PAINT_OPTIONS = [
  ['#E31C23', 'Inferno'],
  ['#F2F1ED', 'Pearl'],
  ['#1C1E21', 'Obsidian'],
  ['#4B555B', 'Titanium'],
] as const

export function Configurator({ config, onChange }: ConfiguratorProps) {
  const updateConfig = <K extends keyof RoadsterConfig>(key: K, value: RoadsterConfig[K]) => {
    onChange({ ...config, [key]: value })
  }

  return (
    <aside className="fixed bottom-5 right-5 z-20 w-[min(19rem,calc(100vw-2.5rem))] rounded-2xl border border-black/10 bg-[#f5f3ee]/95 p-5 text-black shadow-2xl shadow-black/10 backdrop-blur-md sm:bottom-8 sm:right-8 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2" aria-label="Roadster configurator">
      <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Your Roadster</p>
          <h2 className="mt-1 text-lg font-bold tracking-tight">Configure the finish</h2>
        </div>
        <span className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: config.paint }} aria-label={`Selected paint ${config.paint}`} />
      </div>

      <div className="space-y-5 pt-4">
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">Paint</legend>
          <div className="flex gap-3">
            {PAINT_OPTIONS.map(([color, name]) => (
              <button key={color} type="button" title={name} aria-label={`${name} paint`} aria-pressed={config.paint === color} onClick={() => updateConfig('paint', color)} className={`size-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${config.paint === color ? 'scale-110 border-black' : 'border-white'}`} style={{ backgroundColor: color }} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">Contrast package</legend>
          <div className="grid grid-cols-2 gap-2">
            {(['chrome', 'blackout'] as const).map((option) => (
              <button key={option} type="button" aria-pressed={config.contrast === option} onClick={() => updateConfig('contrast', option)} className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${config.contrast === option ? 'border-black bg-black text-white' : 'border-black/15 bg-white/50 hover:border-black/40'}`}>
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">Wheels</legend>
            <select value={config.wheels} onChange={(event) => updateConfig('wheels', event.target.value as RoadsterConfig['wheels'])} className="w-full rounded-lg border border-black/15 bg-white/60 px-2 py-2 text-xs font-semibold outline-none focus:border-black">
              <option value="silver">Silver</option>
              <option value="dark">Dark alloy</option>
            </select>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">Interior</legend>
            <select value={config.interior} onChange={(event) => updateConfig('interior', event.target.value as RoadsterConfig['interior'])} className="w-full rounded-lg border border-black/15 bg-white/60 px-2 py-2 text-xs font-semibold outline-none focus:border-black">
              <option value="black">Onyx</option>
              <option value="cream">Cream</option>
            </select>
          </fieldset>
        </div>
      </div>
    </aside>
  )
}
