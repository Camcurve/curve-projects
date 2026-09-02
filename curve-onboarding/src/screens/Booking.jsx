import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarBlank, Check, Paperclip, VideoCamera } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import { useOnboarding } from '@/lib/useOnboarding'

export default function Booking({ client }) {
  const navigate = useNavigate()
  const { state, persist } = useOnboarding(client.slug)
  // cal.com or Calendly — both are just a link we open. VITE_CALENDLY_URL is
  // kept as a fallback so an older env file keeps working.
  const bookingUrl = import.meta.env.VITE_BOOKING_URL || import.meta.env.VITE_CALENDLY_URL
  const hasCalendly = Boolean(bookingUrl)

  const openCalendly = () => {
    if (!bookingUrl) return
    window.open(bookingUrl, '_blank', 'noopener,noreferrer')
  }

  const footer = (
    <div className="flex items-center gap-3">
      <Button variant="ghost" onClick={() => navigate(`/${client.slug}/access`)} className="px-4">
        Back
      </Button>
      <Button
        size="block"
        withArrow
        disabled={!state.bookingDone}
        onClick={() => navigate(`/${client.slug}/done`)}
      >
        Finish
      </Button>
    </div>
  )

  return (
    <Layout client={client} currentStep="booking" footer={footer}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 22 }}
        className="flex flex-col gap-8"
      >
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-[32px] font-extrabold leading-[1.05] tracking-[-0.03em] text-bone">
            Book the
            <br />
            kick-off call.
          </h1>
          <p className="text-[14px] leading-[1.55] text-bone-dim">
            Forty-five minutes with Cam &amp; Ayla to get creative moving.
          </p>
        </header>

        <div className="flex flex-col gap-4 rounded-[12px] border border-line bg-ink-raised p-5">
          <div className="flex items-center gap-2 text-[13px] font-medium text-bone">
            <VideoCamera size={15} weight="regular" className="text-brand" />
            <span>45 min · Google Meet · With Cam &amp; Ayla</span>
          </div>
          <ul className="flex flex-col gap-3">
            <Bullet>Establish the key roles and stakeholders on both sides</Bullet>
            <Bullet>
              Understand access — the event spaces, the talent, and what we&apos;re able to film
            </Bullet>
            <Bullet>Align on brand guidelines and permissions</Bullet>
          </ul>
        </div>

        {/* Separate box, deliberately not styled like the agenda — this is a task
            for them before the call, not a thing we'll cover on it. */}
        <div className="flex flex-col gap-3 rounded-[12px] border border-brand-glow-30 bg-brand-glow-10 p-5">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-brand">
            <Paperclip size={15} weight="bold" />
            <span>Bring with you</span>
          </div>
          <ul className="flex flex-col gap-3">
            <Bullet>Your brand guidelines — however they exist today, a PDF is ideal</Bullet>
            <Bullet>Anyone who owns sign-off on creative or permissions</Bullet>
          </ul>
          <p className="text-[12px] leading-[1.5] text-bone-muted">
            No need to send anything ahead — we&apos;ll go through it together on the call.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {hasCalendly && (
            <Button variant="primary" size="block" onClick={openCalendly}>
              <span className="inline-flex items-center gap-2">
                <CalendarBlank size={16} weight="bold" />
                Open booking calendar
                <ArrowUpRight size={14} weight="bold" />
              </span>
            </Button>
          )}

          {state.bookingDone ? (
            <div className="flex items-center justify-center gap-2 rounded-md border border-brand-glow-30 bg-brand-glow-10 px-4 py-3 text-[13px] font-medium text-brand">
              <Check size={14} weight="bold" /> Booking confirmed
            </div>
          ) : (
            <Button
              variant={hasCalendly ? 'ghost' : 'primary'}
              size="block"
              onClick={() => persist({ bookingDone: true })}
            >
              <span className="inline-flex items-center gap-2">
                {!hasCalendly && <CalendarBlank size={16} weight="bold" />}
                {hasCalendly ? "I've booked" : 'Mark as booked'}
              </span>
            </Button>
          )}
          <p className="text-center text-[12px] text-bone-muted">
            {hasCalendly
              ? 'Tick once the calendar invite lands in your inbox.'
              : 'We\u2019ll email you a time to confirm — tap above to continue.'}
          </p>
        </div>
      </motion.div>
    </Layout>
  )
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-3 text-[14px] leading-[1.55] text-bone-dim">
      <span
        className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full bg-brand"
        style={{ boxShadow: '0 0 6px rgba(255,95,0,0.9), 0 0 14px rgba(255,95,0,0.45)' }}
      />
      <span>{children}</span>
    </li>
  )
}
