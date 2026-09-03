import { useEffect, useRef, useState } from 'react'
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

type SelectOption = {
    value: string
    label: string
}

type ConfiguratorSelectProps = {
    label: string
    value: string
    options: SelectOption[]
    onChange: (value: string) => void
}

function ConfiguratorSelect({ label, value, options, onChange }: ConfiguratorSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const selectedOption = options.find((option) => option.value === value) ?? options[0]

    useEffect(() => {
        if (!isOpen) return

        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [isOpen])

    return (
        <div ref={containerRef} className="relative">
            <button type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)} className={`flex w-full items-center justify-between rounded-lg border px-2 py-2 text-left text-xs font-semibold text-[#f5f3ee] outline-none transition-colors focus-visible:border-[#e31c23] focus-visible:ring-1 focus-visible:ring-[#e31c23] ${isOpen ? 'border-[#e31c23] ring-1 ring-[#e31c23]' : 'border-white/15 bg-white/5'}`}>
                {selectedOption.label}
                <span aria-hidden="true" className={`ml-2 text-[#e31c23] transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
            </button>
            {isOpen && (
                <div role="listbox" aria-label={label} className="absolute bottom-[calc(100%+0.35rem)] left-0 z-30 w-full overflow-hidden rounded-lg border border-white/10 bg-[#141617] shadow-xl shadow-black/40 md:bottom-auto md:top-[calc(100%+0.35rem)]">
                    {options.map((option) => (
                        <button key={option.value} type="button" role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); setIsOpen(false) }} className={`block w-full rounded-md px-2 py-2 text-left text-xs font-semibold transition-colors hover:bg-white/10 hover:text-[#f5f3ee] focus-visible:bg-white/10 focus-visible:text-[#f5f3ee] focus-visible:outline-none ${option.value === value ? 'bg-[#e31c23] text-white' : 'text-[#f5f3ee]/80'}`}>              {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export function Configurator({ config, onChange }: ConfiguratorProps) {
    const [isOpen, setIsOpen] = useState(false)

    const updateConfig = <K extends keyof RoadsterConfig>(key: K, value: RoadsterConfig[K]) => {
        onChange({ ...config, [key]: value })
    }

    return (
        <>
            <button type="button" aria-label="Open configurator" title="Open configurator" aria-expanded={isOpen} aria-controls="roadster-configurator" onClick={() => setIsOpen(true)} className={`${isOpen ? 'hidden' : 'flex'} fixed bottom-5 right-5 z-20 size-11 items-center justify-center rounded-full border border-white/10 bg-[#141617]/80 text-2xl font-medium leading-none text-[#f5f3ee] shadow-xl shadow-black/30 backdrop-blur-md transition-colors hover:bg-[#e31c23] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e31c23] md:hidden`}>
                <span aria-hidden="true">⚙</span>
            </button>

            <aside id="roadster-configurator" className={`${isOpen ? 'block' : 'hidden'} fixed bottom-5 right-5 z-20 max-h-[calc(100vh-5rem)] w-[min(19rem,calc(100vw-2.5rem))] overflow-y-auto rounded-2xl border border-white/10 bg-[#141617]/95 p-5 text-[#f5f3ee] shadow-2xl shadow-black/40 backdrop-blur-md md:block md:max-h-none md:overflow-visible md:bottom-auto md:right-8 md:top-1/2 md:-translate-y-1/2`} aria-label="Roadster configurator">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a6aaab]">Your Roadster</p>
                    <h2 className="mt-1 text-lg font-bold tracking-tight">Configure the finish</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="mt-1 size-3 shrink-0 rounded-full" style={{ backgroundColor: config.paint }} aria-label={`Selected paint ${config.paint}`} />
                    <button type="button" aria-label="Close configurator" title="Close configurator" onClick={() => setIsOpen(false)} className="p-0 text-3xl leading-none text-[#f5f3ee] transition-colors hover:text-[#e31c23] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e31c23] md:hidden">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
            </div>

            <div className="space-y-5 pt-4">
                <fieldset>
                            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a6aaab]">Paint</legend>
                    <div className="flex gap-3">
                        {PAINT_OPTIONS.map(([color, name]) => (
                            <button key={color} type="button" title={name} aria-label={`${name} paint`} aria-pressed={config.paint === color} onClick={() => updateConfig('paint', color)} className={`size-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${config.paint === color ? 'scale-110 border-black' : 'border-white'}`} style={{ backgroundColor: color }} />
                        ))}
                    </div>
                </fieldset>

                <fieldset>
                            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a6aaab]">Contrast package</legend>
                    <div className="grid grid-cols-2 gap-2">
                        {(['chrome', 'blackout'] as const).map((option) => (
                            <button key={option} type="button" aria-pressed={config.contrast === option} onClick={() => updateConfig('contrast', option)} className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${config.contrast === option ? 'border-[#e31c23] bg-[#e31c23] text-white' : 'border-white/15 bg-white/5 text-[#f5f3ee]/80 hover:border-white/30'}`}>
                                {option}
                            </button>
                        ))}
                    </div>
                </fieldset>

                <div className="grid grid-cols-2 gap-4">
                    <fieldset>
                        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a6aaab]">Wheels</legend>
                        <ConfiguratorSelect label="Wheels" value={config.wheels} onChange={(value) => updateConfig('wheels', value as RoadsterConfig['wheels'])} options={[{ value: 'silver', label: 'Silver' }, { value: 'dark', label: 'Dark alloy' }]} />
                    </fieldset>
                    <fieldset>
                        <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#a6aaab]">Interior</legend>
                        <ConfiguratorSelect label="Interior" value={config.interior} onChange={(value) => updateConfig('interior', value as RoadsterConfig['interior'])} options={[{ value: 'black', label: 'Onyx' }, { value: 'cream', label: 'Cream' }]} />
                    </fieldset>
                </div>
            </div>
            </aside>
        </>
    )
}
