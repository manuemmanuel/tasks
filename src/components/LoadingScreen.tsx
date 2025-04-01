import { Loader2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#030014] flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-violet-400 animate-spin mx-auto" />
        <p className="mt-4 text-violet-200 text-lg">Loading...</p>
      </div>
    </div>
  )
} 