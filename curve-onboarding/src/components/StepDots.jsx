import { STEPS } from '@/lib/useOnboarding'

export default function StepDots({ currentStep }) {
  const idx = STEPS.findIndex((s) => s.key === currentStep)
  return (
    <div className="flex items-center justify-center gap-[8px]">
      {STEPS.map((s, i) => {
        const state = i < idx ? 'done' : i === idx ? 'current' : 'upcoming'
        return (
          <span
            key={s.key}
            aria-label={s.label}
            className={[
              'block h-[5px] rounded-[2px] transition-all duration-500',
              state === 'current' ? 'w-5 bg-brand' : 'w-[5px]',
              state === 'done' ? 'bg-bone-muted' : '',
              state === 'upcoming' ? 'bg-line-bright' : '',
            ].join(' ')}
          />
        )
      })}
    </div>
  )
}
