export function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#e31c23]" />
        </div>
        <p className="text-sm font-medium tracking-wide text-[#a6aaab]">
          Loading Roadster...
        </p>
      </div>
    </div>
  )
}
