export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>{children}</button>
}

export function Input({ label, error, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} />{error ? <small className="field-error">{error}</small> : null}</label>
}

export function Select({ label, error, children, ...props }) {
  return <label className="field"><span>{label}</span><select {...props}>{children}</select>{error ? <small className="field-error">{error}</small> : null}</label>
}

export function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header"><h2>{title}</h2><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">x</Button></header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-footer">{footer}</footer> : null}
      </section>
    </div>
  )
}

export function Skeleton({ rows = 3 }) {
  return <div className="skeleton-wrap">{Array.from({ length: rows }).map((_, index) => <div className="skeleton" key={index} />)}</div>
}

export function EmptyState({ title, description }) {
  return <div className="empty-state"><h3>{title}</h3><p>{description}</p></div>
}
