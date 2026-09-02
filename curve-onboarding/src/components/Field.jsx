export function Label({ htmlFor, children, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="label-soft text-bone">
        {children}
      </label>
      {hint && <span className="label-soft text-bone-faint">{hint}</span>}
    </div>
  )
}

const fieldBase =
  'w-full rounded-md border border-line bg-ink-raised/60 px-4 py-[14px] text-[16px] text-bone placeholder:text-bone-faint transition-colors duration-200 focus:border-brand focus:outline-none focus:bg-ink-raised caret-brand'

export function Input({ id, ...rest }) {
  return <input id={id} className={fieldBase} {...rest} />
}

export function Textarea({ id, rows = 3, ...rest }) {
  return <textarea id={id} rows={rows} className={`${fieldBase} resize-none leading-relaxed`} {...rest} />
}

export function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'inline-flex items-center rounded-md border px-[14px] py-[9px] text-[13px] font-medium transition-all duration-200 active:translate-y-[1px]',
        active
          ? 'border-brand bg-brand-glow-10 text-brand shadow-[0_0_0_1px_rgba(255,95,0,0.30)]'
          : 'border-line bg-ink-raised/40 text-bone-dim hover:border-line-bright hover:text-bone',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
