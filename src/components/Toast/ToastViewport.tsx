import { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { IconClose, IconError, IconInfo, IconLoader, IconSuccess, IconWarning } from '../../icons'
import { cx } from '../../utils/cx'
import type { ToastType } from './toast'

export type ToastPosition = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'

export interface ToastItem {
  id: string
  message: ReactNode
  description?: ReactNode
  type: ToastType
  position: ToastPosition
  closable: boolean
  icon?: ReactNode
}

/* ------------------------------------------------------------------ 轻量 store */
let snapshot: readonly ToastItem[] = []
const listeners = new Set<() => void>()

function emitToasts(): void {
  for (const listener of listeners) listener()
}

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getToastsSnapshot(): readonly ToastItem[] {
  return snapshot
}

export function addToastItem(item: ToastItem): void {
  snapshot = [...snapshot, item]
  emitToasts()
}

export function removeToastItem(id: string): void {
  if (!snapshot.some((item) => item.id === id)) return
  snapshot = snapshot.filter((item) => item.id !== id)
  emitToasts()
}

export function clearToastItems(): void {
  if (snapshot.length === 0) return
  snapshot = []
  emitToasts()
}

/* ------------------------------------------------------------------ 视图 */
const TOAST_ICONS: Record<ToastType, ReactNode> = {
  info: <IconInfo size={16} />,
  success: <IconSuccess size={16} />,
  warning: <IconWarning size={16} />,
  error: <IconError size={16} />,
  loading: <IconLoader size={16} className="aelux-spin" />,
}

interface ToastViewportProps {
  position: ToastPosition
  onDismiss: (id: string) => void
}

/**
 * Toast 视图 —— 由 toast.ts 挂载到 document.body 的单例容器（每个 position 一个）。
 * 数据来自模块级 store，命令式 API 调用后自动刷新。
 */
export function ToastViewport({ position, onDismiss }: ToastViewportProps) {
  const toasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot, getToastsSnapshot)
  const visibleToasts = toasts.filter((item) => item.position === position)

  if (visibleToasts.length === 0) return null

  return (
    <>
      {visibleToasts.map((item) => (
        <div
          key={item.id}
          role="status"
          aria-live={item.type === 'error' ? 'assertive' : 'polite'}
          className={cx('aelux-toast', `aelux-toast--${item.type}`)}
        >
          <span className="aelux-toast__icon" aria-hidden="true">
            {item.icon ?? TOAST_ICONS[item.type]}
          </span>
          <div className="aelux-toast__content">
            <div className="aelux-toast__message">{item.message}</div>
            {item.description != null ? (
              <div className="aelux-toast__description">{item.description}</div>
            ) : null}
          </div>
          {item.closable ? (
            <button
              type="button"
              className="aelux-toast__close"
              aria-label="关闭通知"
              onClick={() => onDismiss(item.id)}
            >
              <IconClose size={14} />
            </button>
          ) : null}
        </div>
      ))}
    </>
  )
}
