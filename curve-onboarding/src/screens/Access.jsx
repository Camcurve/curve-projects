import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  CaretDown,
  Check,
  EnvelopeSimple,
  Lock,
  SlackLogo,
  WhatsappLogo,
  X,
  YoutubeLogo,
} from '@phosphor-icons/react'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import SlackJoinAnimation from '@/components/SlackJoinAnimation'
import WhatsAppJoinAnimation from '@/components/WhatsAppJoinAnimation'
import { useOnboarding } from '@/lib/useOnboarding'
import { buildStudioPermissionsUrl, isDeepLink, resolveChannelId } from '@/lib/youtube'
import { buildSlackChannelUrl } from '@/lib/slack'
import { COMMS, commsOf, isValidEmail, isValidPhone, normalisePhone } from '@/lib/comms'

// The Google account that receives the YouTube Manager invite. Must be a real
// Google account that can accept channel access — not just a mail alias.
const curveEmail = import.meta.env.VITE_YOUTUBE_MANAGER_EMAIL || 'data@thecurve.media'

export default function Access({ client }) {
  const navigate = useNavigate()
  const { state, persist } = useOnboarding(client.slug)
  const [showError, setShowError] = useState(false)
  const [slackAnimating, setSlackAnimating] = useState(false)
  const [contactError, setContactError] = useState(false)
  const [delegating, setDelegating] = useState(false)
  const [admin, setAdmin] = useState(state.ytDelegatedTo ?? { name: '', email: '' })
  const [adminError, setAdminError] = useState(false)

  const adminValid = admin.name.trim().length > 1 && isValidEmail(admin.email)

  const confirmDelegate = () => {
    if (!adminValid) {
      setAdminError(true)
      return
    }
    persist({ ytDelegatedTo: { name: admin.name.trim(), email: admin.email.trim() } })
    setDelegating(false)
  }
  const [waAnimating, setWaAnimating] = useState(false)

  const comms = commsOf(client)
  // Settled either by granting access or by telling us who can.
  const ytSettled = state.ytDone || !!state.ytDelegatedTo
  const canContinue = ytSettled && state.commsDone
  // Prefer a resolved channel ID; fall back to whatever they pasted.
  const channelRef = state.brief.channelId || state.brief.youtube
  const studioUrl = buildStudioPermissionsUrl(channelRef)
  const studioIsDirect = isDeepLink(channelRef)

  useEffect(() => {
    // A pasted @handle carries no channel ID, so resolve it once (needs the API
    // key) and store it — that turns "Open YouTube Studio" into a link straight
    // to their permissions page.
    if (state.brief.channelId || !state.brief.youtube) return
    let cancelled = false
    resolveChannelId(state.brief.youtube).then((id) => {
      if (!cancelled && id) {
        persist({ brief: { ...state.brief, channelId: id } })
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.brief.youtube])
  const slackUrl = buildSlackChannelUrl(client.slackChannelId)

  // Only used when comms === 'email' — we need a reply-to for a project that
  // runs entirely over email, and nothing else in the brief captures one.
  const [contact, setContact] = useState(
    state.brief.contact ?? { name: '', email: '', people: [{ name: '', phone: '' }] }
  )
  const people = contact.people?.length ? contact.people : [{ name: '', phone: '' }]

  const setPerson = (i, patch) => {
    setContactError(false)
    setContact((c) => {
      const next = (c.people?.length ? [...c.people] : [{ name: '', phone: '' }])
      next[i] = { ...next[i], ...patch }
      return { ...c, people: next }
    })
  }
  const addPerson = () =>
    setContact((c) => ({ ...c, people: [...(c.people || []), { name: '', phone: '' }] }))
  const removePerson = (i) =>
    setContact((c) => ({ ...c, people: c.people.filter((_, j) => j !== i) }))
  const contactValid = contact.name.trim().length > 1 && isValidEmail(contact.email)
  // Every row that has anything in it must be complete and valid, and we need
  // at least one — a half-filled row is a number we can't attribute.
  const filledPeople = people.filter((p) => p.name.trim() || p.phone.trim())
  const whatsappValid =
    filledPeople.length > 0 &&
    filledPeople.every((p) => p.name.trim().length > 1 && isValidPhone(p.phone))

  // We need the number to confirm they actually landed in the group — matching a
  // join to a person is impossible otherwise.
  const confirmWhatsApp = () => {
    if (!whatsappValid) {
      setContactError(true)
      return
    }
    persist({
      brief: {
        ...state.brief,
        contact: {
          ...state.brief.contact,
          people: filledPeople.map((p) => ({
            name: p.name.trim(),
            phone: normalisePhone(p.phone),
          })),
        },
      },
    })
    setWaAnimating(true)
  }

  const confirmContact = () => {
    if (!contactValid) {
      setContactError(true)
      return
    }
    persist({
      brief: { ...state.brief, contact: { name: contact.name.trim(), email: contact.email.trim() } },
      commsDone: true,
    })
  }

  const onContinue = () => {
    if (!canContinue) {
      setShowError(true)
      return
    }
    navigate(`/${client.slug}/booking`)
  }

  const footer = (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate(`/${client.slug}/brief`)} className="px-4">
          Back
        </Button>
        <Button size="block" withArrow onClick={onContinue} disabled={!canContinue && !showError}>
          Continue
        </Button>
      </div>
      {showError && !canContinue && (
        <p className="text-center text-[12px] text-danger">
          Both steps need to be confirmed to continue.
        </p>
      )}
    </div>
  )

  return (
    <Layout client={client} currentStep="access" footer={footer}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 22 }}
        className="flex flex-col gap-8"
      >
        <header className="flex flex-col gap-3">
          <h1 className="font-display text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-bone sm:text-[36px]">
            Grant us
            <br />
            the two keys.
          </h1>
          <p className="text-[14px] leading-[1.55] text-bone-dim">
            YouTube Manager access, plus a line to reach you. Both must be confirmed to
            continue.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          <AccessCard
            title="Add Curve as a YouTube Manager"
            icon={<YoutubeLogo size={20} weight="regular" />}
            done={ytSettled}
            doneLabel={
              state.ytDone
                ? 'Confirmed'
                : `Passed to ${state.ytDelegatedTo?.name ?? 'your channel manager'}`
            }
            locked={false}
            onConfirm={() => persist({ ytDone: true })}
            secondary={
              delegating ? (
                <div className="flex flex-col gap-2 rounded-md border border-line bg-ink/40 p-3">
                  <p className="text-[12px] leading-[1.5] text-bone-muted">
                    No problem — tell us who manages the channel and we&apos;ll take it up with
                    them directly.
                  </p>
                  <input
                    type="text"
                    value={admin.name}
                    onChange={(e) => {
                      setAdminError(false)
                      setAdmin((a) => ({ ...a, name: e.target.value }))
                    }}
                    placeholder="Their name"
                    className="w-full rounded-md border border-line bg-ink-raised/60 px-3 py-[11px] text-[14px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:bg-ink-raised focus:outline-none caret-brand"
                  />
                  <input
                    type="email"
                    inputMode="email"
                    value={admin.email}
                    onChange={(e) => {
                      setAdminError(false)
                      setAdmin((a) => ({ ...a, email: e.target.value }))
                    }}
                    placeholder="their.name@company.com"
                    className="w-full rounded-md border border-line bg-ink-raised/60 px-3 py-[11px] text-[14px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:bg-ink-raised focus:outline-none caret-brand"
                  />
                  {adminError && (
                    <p className="text-[12px] text-danger">
                      We need their name and a valid email address.
                    </p>
                  )}
                  <Button variant="ghost" size="block" onClick={confirmDelegate}>
                    Pass this to them
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDelegating(true)}
                  className="self-center text-[12px] font-medium text-bone-muted underline decoration-line-bright decoration-1 underline-offset-4 transition-colors hover:text-bone"
                >
                  Someone else manages our channel
                </button>
              )
            }
            confirmLabel="I've added Curve"
            action={
              <a
                href={studioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] font-medium text-brand underline decoration-brand/40 decoration-1 underline-offset-[4px] transition-colors hover:decoration-brand"
              >
                {studioIsDirect ? 'Open your channel permissions' : 'Open YouTube Studio'}
                <ArrowUpRight size={13} weight="bold" />
              </a>
            }
            steps={[
              studioIsDirect ? (
                <>Click the link above — it opens the permissions page for your channel.</>
              ) : (
                <>Click the link above to open YouTube Studio, then go to Settings → Permissions.</>
              ),
              <>
                Hit <strong className="text-bone">Invite</strong>, paste{' '}
                <code className="rounded bg-line px-[6px] py-[2px] font-mono text-[12px] text-bone">
                  {curveEmail}
                </code>{' '}
                and set the role to <strong className="text-bone">Manager</strong>.
              </>,
              <>Send. We&apos;ll accept within a few hours.</>,
              <>Tick below once the invite&apos;s sent.</>,
            ]}
          />

          {comms === COMMS.SLACK && (
            <AccessCard
              title="Join the Curve Slack workspace"
              icon={<SlackLogo size={20} weight="regular" />}
              done={state.commsDone}
              locked={!ytSettled}
              onConfirm={() => setSlackAnimating(true)}
              confirmLabel="I've joined"
              action={
                slackUrl ? (
                  <a
                    href={slackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-brand underline decoration-brand/40 decoration-1 underline-offset-[4px] transition-colors hover:decoration-brand"
                  >
                    Open #{client.slug}
                    <ArrowUpRight size={13} weight="bold" />
                  </a>
                ) : null
              }
              steps={[
                <>Check your inbox for the Slack invite from Curve.</>,
                <>Accept and set up your profile — a real photo helps us tag the right people.</>,
                <>
                  Open <strong className="text-bone">#{client.slug}</strong>
                  {slackUrl ? ' (link above once the invite is accepted)' : ''} and introduce
                  yourself. One line is enough.
                </>,
                <>Tick below once you&apos;re in.</>,
              ]}
              animation={
                slackAnimating && !state.commsDone ? (
                  <SlackJoinAnimation
                    channelName={client.slug}
                    onComplete={() => {
                      setSlackAnimating(false)
                      persist({ commsDone: true })
                    }}
                  />
                ) : null
              }
            />
          )}

          {comms === COMMS.WHATSAPP && (
            <AccessCard
              title="Add your WhatsApp numbers"
              icon={<WhatsappLogo size={20} weight="regular" />}
              done={state.commsDone}
              locked={!ytSettled}
              onConfirm={confirmWhatsApp}
              confirmLabel="Send these numbers"
              action={
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-4">
                    {people.map((person, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {/* Side by side wherever there's room. Below ~420px a name, an
                            international number and the remove button can't share a line
                            without clipping, so the pair stacks instead. */}
                        <div className="flex min-w-0 flex-1 flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center">
                          <input
                            type="text"
                            value={person.name}
                            onChange={(e) => setPerson(i, { name: e.target.value })}
                            placeholder="Name"
                            className="w-full rounded-md border border-line bg-ink-raised/60 px-3 py-[12px] text-[14px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:bg-ink-raised focus:outline-none caret-brand min-[420px]:w-[42%] min-[420px]:shrink-0"
                          />
                          <input
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            value={person.phone}
                            onChange={(e) => setPerson(i, { phone: e.target.value })}
                            placeholder="+44 7700 900123"
                            className="w-full min-w-0 rounded-md border border-line bg-ink-raised/60 px-3 py-[12px] text-[14px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:bg-ink-raised focus:outline-none caret-brand min-[420px]:flex-1"
                          />
                        </div>
                        {people.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePerson(i)}
                            aria-label={`Remove ${person.name || 'this person'}`}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line text-bone-muted transition-colors hover:border-line-bright hover:text-bone"
                          >
                            <X size={12} weight="bold" />
                          </button>
                        )}
                      </div>
                    ))}
                    </div>

                    <button
                      type="button"
                      onClick={addPerson}
                      className="self-start text-[12px] font-semibold text-brand underline decoration-brand-glow-30 decoration-1 underline-offset-4 transition-colors hover:decoration-brand"
                    >
                      + Add another person
                    </button>

                    <p className="text-[11px] leading-[1.5] text-bone-muted">
                      Numbers as they appear on WhatsApp, with country code — it&apos;s how we
                      match each join to a name.
                    </p>
                    {contactError && (
                      <p className="text-[12px] text-danger">
                        Every row needs a name and a valid number, including country code.
                      </p>
                    )}
                  </div>
                </div>
              }
              steps={[
                <>Add everyone on your side who should be in the group.</>,
                <>
                  Use the number each person has on WhatsApp, with the country code — we add
                  people by number.
                </>,
                <>We&apos;ll set the group up and add you once onboarding&apos;s complete.</>,
              ]}
              animation={
                waAnimating && !state.commsDone ? (
                  <WhatsAppJoinAnimation
                    groupName={`${client.name} \u00d7 Curve`}
                    people={filledPeople.map((p) => ({
                      name: p.name.trim(),
                      phone: normalisePhone(p.phone),
                    }))}
                    onComplete={() => {
                      setWaAnimating(false)
                      persist({ commsDone: true })
                    }}
                  />
                ) : null
              }
            />
          )}

          {comms === COMMS.EMAIL && (
            <AccessCard
              title="Confirm your point of contact"
              icon={<EnvelopeSimple size={20} weight="regular" />}
              done={state.commsDone}
              locked={!ytSettled}
              onConfirm={confirmContact}
              confirmLabel="That's correct"
              action={
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => {
                      setContactError(false)
                      setContact((c) => ({ ...c, name: e.target.value }))
                    }}
                    placeholder="Full name"
                    className="w-full rounded-md border border-line bg-ink-raised/60 px-4 py-[12px] text-[15px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:bg-ink-raised focus:outline-none caret-brand"
                  />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={contact.email}
                    onChange={(e) => {
                      setContactError(false)
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }}
                    placeholder="name@company.com"
                    className="w-full rounded-md border border-line bg-ink-raised/60 px-4 py-[12px] text-[15px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:bg-ink-raised focus:outline-none caret-brand"
                  />
                  {contactError && (
                    <p className="text-[12px] text-danger">
                      We need a name and a valid email address.
                    </p>
                  )}
                </div>
              }
              steps={[
                <>Everything on this project runs over email — nothing new to install.</>,
                <>
                  Give us the best person and address for day-to-day, so nothing lands in the
                  wrong inbox.
                </>,
                <>Tick below once it&apos;s right.</>,
              ]}
            />
          )}
        </div>
      </motion.div>
    </Layout>
  )
}

function AccessCard({
  title,
  icon,
  done,
  locked,
  onConfirm,
  confirmLabel,
  steps,
  action,
  animation,
  secondary,
  doneLabel = 'Confirmed',
}) {
  const [open, setOpen] = useState(!done && !locked)

  // Auto-expand when the card becomes active (e.g. Slack unlocks after YouTube confirms).
  useEffect(() => {
    if (!locked && !done) setOpen(true)
  }, [locked, done])

  return (
    <motion.section
      layout
      className={[
        'relative overflow-hidden rounded-[12px] border bg-ink-raised transition-[opacity,border-color] duration-400',
        locked
          ? 'border-line-soft opacity-55'
          : done
            ? 'border-brand-glow-30 shadow-[0_0_0_1px_rgba(255,95,0,0.15)]'
            : 'border-line',
      ].join(' ')}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="mt-[2px] text-bone-dim">{icon}</span>
        <div className="flex flex-1 flex-col gap-[2px]">
          <h2 className="text-[15px] font-bold leading-[1.3] tracking-[-0.01em] text-bone">
            {title}
          </h2>
          {locked ? (
            <span className="mt-1 inline-flex items-center gap-[6px] text-[12px] text-bone-muted">
              <Lock size={12} weight="regular" /> Unlocks after step one
            </span>
          ) : done ? (
            <span className="mt-1 inline-flex items-center gap-[6px] text-[12px] font-medium text-brand">
              <Check size={12} weight="bold" /> {doneLabel}
            </span>
          ) : null}
        </div>
        {!locked && !done && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-bone-dim transition-colors hover:border-line-bright hover:text-bone"
            aria-expanded={open}
            aria-label={open ? 'Hide steps' : 'Show steps'}
          >
            <CaretDown size={12} weight="bold" className={open ? 'rotate-180' : ''} />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && !locked && !done && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {action && (
              <div className="border-t border-line px-4 py-3">{action}</div>
            )}
            <ol className="flex flex-col gap-3 border-t border-line px-4 py-4">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-[14px] leading-[1.55] text-bone-dim">
                  <span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-line-bright text-[11px] font-semibold text-bone-dim tabular">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            {animation && <div className="border-t border-line p-4">{animation}</div>}
            {!animation && (
              <div className="flex flex-col gap-3 border-t border-line p-4">
                <Button variant="primary" size="block" onClick={onConfirm}>
                  {confirmLabel}
                </Button>
                {secondary}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
