import { createElement } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { addToastItem, clearToastItems, removeToastItem, ToastViewport } from './ToastViewport'
import type { ToastPosition } from './ToastViewport'

export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'loading'

export interface ToastOptions {
  /** 副标题 / 描述 */
  description?: ReactNode
  /** 停留时长 ms，默认 3200 */
  duration?: number
  /** 位置，默认 top-right */
  position?: ToastPosition
  /** 是否显示关闭按钮，默认 false */
  closable?: boolean
  /** 自定义图标 */
  icon?: ReactNode
  /** 类型（一般用 toast.success / toast.error 等方法） */
  type?: ToastType
}

export interface ToastApi {
  (message: ReactNode, options?: ToastOptions & { type?: ToastType }): string
  success(message: ReactNode, options?: ToastOptions): string
  error(message: ReactNode, options?: ToastOptions): string
  warning(message: ReactNode, options?: ToastOptions): string
  info(message: ReactNode, options?: ToastOptions): string
  loading(message: ReactNode, options?: ToastOptions): string
  /** 手动关闭 */
  dismiss(id: string): void
  /** 关闭全部 */
  clear(): void
}

const DEFAULT_DURATION = 3200

let sequence = 0
const timers = new Map<string, ReturnType<typeof setTimeout>>()
const containers = new Set<ToastPosition>()

/** 惰性创建某个 position 的单例容器并挂到 document.body。 */
function ensureContainer(position: ToastPosition): void {
  if (containers.has(position)) return
  const element = document.createElement('div')
  element.className = `aelux-toast-root aelux-toast-root--${position}`
  document.body.appendChild(element)
  containers.add(position)
  createRoot(element).render(createElement(ToastViewport, { position, onDismiss: dismiss }))
}

function dismiss(id: string): void {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
  removeToastItem(id)
}

function clearAll(): void {
  for (const timer of timers.values()) clearTimeout(timer)
  timers.clear()
  clearToastItems()
}

function showToast(message: ReactNode, options: ToastOptions = {}): string {
  if (typeof document === 'undefined') return ''

  const type: ToastType = options.type ?? 'info'
  const position: ToastPosition = options.position ?? 'top-right'
  const duration = options.duration ?? DEFAULT_DURATION
  const id = `aelux-toast-${++sequence}`

  ensureContainer(position)
  addToastItem({
    id,
    message,
    description: options.description,
    type,
    position,
    closable: options.closable ?? false,
    icon: options.icon,
  })

  // loading 不会自动消失，需要手动 dismiss / 用 clear 清理
  if (type !== 'loading' && duration > 0) {
    timers.set(
      id,
      setTimeout(() => {
        dismiss(id)
      }, duration),
    )
  }

  return id
}

const baseToast = (message: ReactNode, options: ToastOptions = {}): string =>
  showToast(message, options)

/**
 * 命令式轻提示 API —— 单例容器惰性挂载到 document.body，
 * 无 document（SSR）环境下安全降级为空字符串。
 */
export const toast: ToastApi = Object.assign(baseToast, {
  success: (message: ReactNode, options: ToastOptions = {}) =>
    showToast(message, { ...options, type: 'success' }),
  error: (message: ReactNode, options: ToastOptions = {}) =>
    showToast(message, { ...options, type: 'error' }),
  warning: (message: ReactNode, options: ToastOptions = {}) =>
    showToast(message, { ...options, type: 'warning' }),
  info: (message: ReactNode, options: ToastOptions = {}) =>
    showToast(message, { ...options, type: 'info' }),
  loading: (message: ReactNode, options: ToastOptions = {}) =>
    showToast(message, { ...options, type: 'loading' }),
  dismiss,
  clear: clearAll,
})
