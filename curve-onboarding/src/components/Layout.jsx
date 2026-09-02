import BackgroundEffects from './BackgroundEffects'
import BrandMark from './BrandMark'
import Logo from './Logo'
import ProgressBar from './ProgressBar'
import StepDots from './StepDots'

export default function Layout({ client, currentStep, children, footer }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink">
      <BackgroundEffects />

      <header className="relative z-30 flex-none pt-safe">
        <div className="px-5 pt-3 pb-4">
          <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4">
            <Logo />
            {client && <BrandMark client={client} size="compact" />}
          </div>
        </div>
        <ProgressBar currentStep={currentStep} />
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div
          className="mx-auto w-full max-w-xl px-5 pt-8"
          style={{ paddingBottom: footer ? '168px' : '40px' }}
        >
          {children}
        </div>
      </main>

      {footer && (
        <div className="fixed inset-x-0 bottom-0 z-30 pb-safe">
          <div
            className="bg-gradient-to-t from-ink via-ink/92 to-ink/0 pt-6 backdrop-blur-[2px]"
            aria-hidden
          />
          <div className="relative -mt-px border-t border-line bg-ink/95 backdrop-blur-md">
            <div className="mx-auto w-full max-w-xl px-5 pt-4 pb-3">{footer}</div>
            <div className="pb-4">
              <StepDots currentStep={currentStep} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
