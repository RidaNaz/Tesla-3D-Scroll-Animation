export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f1f0ec] text-[#111214]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-2 border-black/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#e31c23]" />
        </div>

        <p className="text-sm font-medium tracking-wide text-[#5e6265]">
          Loading Roadster...
        </p>
      </div>
    </div>
  )
}
