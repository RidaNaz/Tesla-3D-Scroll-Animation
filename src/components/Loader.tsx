export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(ellipse_65%_55%_at_50%_48%,rgba(227,28,35,0.24),transparent_70%),#050505] text-[#f5f3ee]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#e31c23]" />
        </div>

        <p className="text-sm font-medium tracking-wide text-[#f5f3ee]/75">
          Loading Roadster...
        </p>
      </div>
    </div>
  )
}
