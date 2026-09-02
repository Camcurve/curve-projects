import { STEPS } from '@/lib/useOnboarding'

export default function ProgressBar({ currentStep }) {
  const idx = STEPS.findIndex((s) => s.key === currentStep)
  const total = STEPS.length - 1
  const percent = Math.max(0, Math.min(100, (idx / total) * 100))

  return (
    <div className="h-[2px] w-full bg-line-soft">
      <div
        className="h-full bg-brand shadow-[0_0_8px_rgba(255,95,0,0.6)] transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
