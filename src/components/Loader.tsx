export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-black animate-spin" />
        </div>
        
        {/* Loading text */}
        <p className="text-sm text-gray-600 font-medium tracking-wide">
          Loading Roadster...
        </p>
      </div>
    </div>
  )
}
