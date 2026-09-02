import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, EnvelopeSimple, WarningCircle } from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import { useOnboarding } from '@/lib/useOnboarding'
import { firstNameOf } from '@/config/clients'
import { buildManualEmail, fireCompletionWebhook } from '@/lib/webhook'

export default function Done({ client }) {
  const { state, persist } = useOnboarding(client.slug)
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'cam@thecurve.media'
  const fired = useRef(false)
  // 'sending' | 'sent' | 'failed' — drives the fallback below. Starts as 'sent'
  // when a previous visit already delivered, so returning clients see nothing.
  const [delivery, setDelivery] = useState(state.webhookSentAt ? 'sent' : 'sending')
  const [retrying, setRetrying] = useState(false)

  const send = useCallback(async () => {
    const res = await fireCompletionWebhook({ client, state })
    if (res?.ok) {
      persist({
        webhookSentAt: new Date().toISOString(),
        deliveredVia: {
          email: !!res.channels?.email?.ok,
          webhook: !!res.channels?.webhook?.ok,
        },
      })
      setDelivery('sent')
    } else {
      // Leave webhookSentAt null so a return visit retries, and show the client
      // a way to hand the brief over by hand. Never report success we didn't get.
      setDelivery('failed')
    }
    return res
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, state])

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    if (!state.completed) persist({ completed: true })
    if (!state.webhookSentAt) send()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onRetry = async () => {
    setRetrying(true)
    setDelivery('sending')
    await send()
    setRetrying(false)
  }

  const manual = delivery === 'failed' ? buildManualEmail({ client, state }) : null

  const footer = (
    <Button
      variant="ghost"
      size="block"
      onClick={() => (window.location.href = `mailto:${contactEmail}`)}
    >
      <span className="inline-flex items-center gap-2">
        <EnvelopeSimple size={16} weight="regular" />
        {contactEmail}
      </span>
    </Button>
  )

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 22 } },
  }

  return (
    <Layout client={client} currentStep="done" footer={footer}>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
        className="flex flex-col gap-8"
      >
        <motion.div
          variants={item}
          className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-brand-glow-10 shadow-[0_0_0_1px_rgba(255,95,0,0.30),0_0_40px_rgba(255,95,0,0.25)]"
        >
          <Check size={28} weight="bold" className="text-brand" />
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-3">
          <h1 className="font-display text-[34px] font-extrabold leading-[1.02] tracking-[-0.035em] text-bone">
            You&apos;re all set,
            <br />
            <span className="text-brand">{firstNameOf(client)}.</span>
          </h1>
          <p className="text-[14px] leading-[1.55] text-bone-dim">
            Everything we need is in. The first artefacts land within a week of your kick-off call.
          </p>
        </motion.div>

        {manual && (
          <motion.div
            variants={item}
            className="flex flex-col gap-3 rounded-[12px] border border-danger/40 bg-danger/10 p-5"
          >
            <div className="flex items-center gap-2 text-[13px] font-semibold text-danger">
              <WarningCircle size={16} weight="bold" />
              <span>One last step</span>
            </div>
            <p className="text-[13px] leading-[1.55] text-bone-dim">
              We couldn&apos;t send your answers automatically. Nothing is lost — tap below to
              email them over, and you&apos;re done.
            </p>
            <Button
              variant="primary"
              size="block"
              onClick={() => {
                window.location.href = manual.href
              }}
            >
              <span className="inline-flex items-center gap-2">
                <EnvelopeSimple size={16} weight="regular" />
                Email my answers
                <ArrowUpRight size={14} weight="bold" />
              </span>
            </Button>
            <button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              className="self-center text-[12px] font-medium text-bone-muted underline decoration-line-bright decoration-1 underline-offset-4 transition-colors hover:text-bone disabled:opacity-50"
            >
              {retrying ? 'Trying again…' : 'Or try sending again'}
            </button>
          </motion.div>
        )}

        <motion.div variants={item} className="flex flex-col gap-[10px]">
          <h2 className="mb-1 text-[13px] font-semibold text-bone-dim">What happens next</h2>
          <NextBlock
            title="Within 24 hours"
            body="Cam accepts the YouTube invite and gets you an intro note."
          />
          <NextBlock
            title="Before the kick-off"
            body="Ayla ships a channel snapshot — what's working, what's bleeding watch time."
          />
          <NextBlock
            title="After the call"
            body="You get the 30-day plan, content pillars, and the first three packaged concepts."
          />
        </motion.div>
      </motion.div>
    </Layout>
  )
}

function NextBlock({ title, body }) {
  return (
    <div className="flex gap-3 rounded-md border border-line bg-ink-raised p-4">
      <span className="mt-[7px] h-[6px] w-[6px] shrink-0 rounded-full bg-brand shadow-[0_0_8px_rgba(255,95,0,0.6)]" />
      <div className="flex flex-col gap-1">
        <h3 className="text-[14px] font-bold tracking-[-0.01em] text-bone">{title}</h3>
        <p className="text-[13px] leading-[1.55] text-bone-dim">{body}</p>
      </div>
    </div>
  )
}
