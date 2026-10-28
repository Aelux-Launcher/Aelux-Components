import { cloneElement, useEffect, useId, useRef, useState } from 'react'
import type {
  FocusEvent as ReactFocusEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../utils/cx'

export interface TooltipProps {
  /** 提示内容 */
  content: ReactNode
  /** 触发元素（单个 React 元素） */
  children: ReactElement
  /** 位置，默认 top */
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /** 显示延迟 ms，默认 120 */
  delay?: number
  /** 禁用 */
  disabled?: boolean
  className?: string
}

interface TriggerProps {
  onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void
  onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void
  onFocus?: (event: ReactFocusEvent<HTMLElement>) => void
  onBlur?: (event: ReactFocusEvent<HTMLElement>) => void
  'aria-describedby'?: string
}

interface TooltipPosition {
  left: number
  top: number
}

const TOOLTIP_GAP = 8

/**
 * 文字提示 —— 基于 getBoundingClientRect 的 fixed 定位 + portal 渲染，
 * hover / focus 触发，并同步 aria-describedby。
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 120,
  disabled = false,
  className,
}: TooltipProps) {
  const tooltipId = useId()
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<TooltipPosition | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => clearTimer, [])

  useEffect(() => {
    if (disabled) setVisible(false)
  }, [disabled])

  useEffect(() => {
    if (!visible) return
    const hideOnChange = () => setVisible(false)
    window.addEventListener('scroll', hideOnChange, true)
    window.addEventListener('resize', hideOnChange)
    return () => {
      window.removeEventListener('scroll', hideOnChange, true)
      window.removeEventListener('resize', hideOnChange)
    }
  }, [visible])

  if (disabled || content == null) return children

  const open = (element: HTMLElement, immediate: boolean) => {
    clearTimer()
    const show = () => {
      const rect = element.getBoundingClientRect()
      const next: TooltipPosition =
        placement === 'bottom'
          ? { left: rect.left + rect.width / 2, top: rect.bottom + TOOLTIP_GAP }
          : placement === 'left'
            ? { left: rect.left - TOOLTIP_GAP, top: rect.top + rect.height / 2 }
            : placement === 'right'
              ? { left: rect.right + TOOLTIP_GAP, top: rect.top + rect.height / 2 }
              : { left: rect.left + rect.width / 2, top: rect.top - TOOLTIP_GAP }
      setPosition(next)
      setVisible(true)
    }
    if (immediate) {
      show()
    } else {
      timerRef.current = setTimeout(show, delay)
    }
  }

  const close = () => {
    clearTimer()
    setVisible(false)
  }

  const child = children as ReactElement<TriggerProps>
  const childProps = child.props
  const describedBy = [childProps['aria-describedby'], visible ? tooltipId : undefined]
    .filter(Boolean)
    .join(' ')

  const trigger = cloneElement(child, {
    onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(event)
      open(event.currentTarget, false)
    },
    onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(event)
      close()
    },
    onFocus: (event: ReactFocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event)
      open(event.currentTarget, true)
    },
    onBlur: (event: ReactFocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event)
      close()
    },
    'aria-describedby': describedBy === '' ? undefined : describedBy,
  })

  return (
    <>
      {trigger}
      {visible && position !== null && typeof document !== 'undefined'
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              className={cx('aelux-tooltip', `aelux-tooltip--${placement}`, className)}
              style={{ left: position.left, top: position.top }}
            >
              <span className="aelux-tooltip__content">{content}</span>
              <span className="aelux-tooltip__arrow" aria-hidden="true" />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
