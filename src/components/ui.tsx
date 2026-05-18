import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string
  size?: string
  className?: string
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </button>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
      {error ? <small className="field-error">{error}</small> : null}
    </label>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: ReactNode
}

export function Select({ label, error, children, ...props }: SelectProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>{children}</select>
      {error ? <small className="field-error">{error}</small> : null}
    </label>
  )
}

interface BadgeProps {
  children: ReactNode
  tone?: string
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

interface ModalProps {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ title, open, onClose, children, footer }: ModalProps) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">x</Button>
        </header>
        <div className="modal-body">{children}</div>
        {footer ? <footer className="modal-footer">{footer}</footer> : null}
      </section>
    </div>
  )
}

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="skeleton-wrap">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton" key={i} />
      ))}
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
