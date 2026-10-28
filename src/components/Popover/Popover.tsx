import { cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react'
import type {
  FocusEvent as ReactFocusEvent,
  MouseEvent as ReactMouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../utils/cx'

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface PopoverProps {
  /** 气泡内容（可放任意富内容） */
  content: ReactNode
  /** 触发元素（单个 React 元素） */
  children: ReactElement
  /** 触发方式，默认 click */
  trigger?: 'click' | 'hover' | 'focus'
  /** 位置，默认 bottom */
  placement?: PopoverPlacement
  /** 受控展开状态 */
  open?: boolean
  /** 展开状态变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 禁用 */
  disabled?: boolean
  /** 与触发元素的间距 px，默认 8 */
  offset?: number
  /** 气泡面板附加 class */
  panelClassName?: string
  /** 触发容器附加 class */
  className?: string
}

interface PopoverTriggerProps {
  id?: string
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void
  onMouseEnter?: (event: ReactMouseEvent<HTMLElement>) => void
  onMouseLeave?: (event: ReactMouseEvent<HTMLElement>) => void
  onFocus?: (event: ReactFocusEvent<HTMLElement>) => void
  onBlur?: (event: ReactFocusEvent<HTMLElement>) => void
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'aria-haspopup'?: 'dialog'
}

interface PopoverPosition {
  left: number
  top: number
}

const DEFAULT_OFFSET = 8
const HOVER_OPEN_DELAY = 60
const HOVER_CLOSE_DELAY = 120

/**
 * 富内容气泡 —— portal + fixed 定位，支持 click / hover / focus 触发与受控开关。
 */
export function Popover({
  content,
  children,
  trigger = 'click',
  placement = 'bottom',
  open,
  onOpenChange,
  disabled = false,
  offset = DEFAULT_OFFSET,
  panelClassName,
  className,
}: PopoverProps) {
  const panelId = useId()
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [innerOpen, setInnerOpen] = useState(false)
  const [position, setPosition] = useState<PopoverPosition | null>(null)

  const controlled = open !== undefined
  const actualOpen = controlled ? open : innerOpen

  const onOpenChangeRef = useRef(onOpenChange)
  const actualOpenRef = useRef(actualOpen)
  const controlledRef = useRef(controlled)
  onOpenChangeRef.current = onOpenChange
  actualOpenRef.current = actualOpen
  controlledRef.current = controlled

  const setOpen = useCallback((next: boolean) => {
    if (actualOpenRef.current === next) return
    if (!controlledRef.current) setInnerOpen(next)
    onOpenChangeRef.current?.(next)
  }, [])

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }, [])

  useEffect(() => clearHoverTimer, [clearHoverTimer])

  const updatePosition = useCallback(() => {
    const element = wrapperRef.current?.firstElementChild
    if (!(element instanceof HTMLElement)) return
    const rect = element.getBoundingClientRect()
    const next: PopoverPosition =
      placement === 'top'
        ? { left: rect.left + rect.width / 2, top: rect.top - offset }
        : placement === 'left'
          ? { left: rect.left - offset, top: rect.top + rect.height / 2 }
          : placement === 'right'
            ? { left: rect.right + offset, top: rect.top + rect.height / 2 }
            : { left: rect.left + rect.width / 2, top: rect.bottom + offset }
    setPosition(next)
  }, [placement, offset])

  const focusTrigger = () => {
    const element = wrapperRef.current?.firstElementChild
    if (element instanceof HTMLElement) element.focus()
  }

  // 展开时定位，滚动 / 尺寸变化时重新定位
  useEffect(() => {
    if (!actualOpen) {
      setPosition(null)
      return
    }
    updatePosition()
    const handleChange = () => updatePosition()
    window.addEventListener('scroll', handleChange, true)
    window.addEventListener('resize', handleChange)
    return () => {
      window.removeEventListener('scroll', handleChange, true)
      window.removeEventListener('resize', handleChange)
    }
  }, [actualOpen, updatePosition])

  // 点击外部关闭
  useEffect(() => {
    if (!actualOpen) return
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (panelRef.current?.contains(target)) return
      if (wrapperRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [actualOpen, setOpen])

  // Esc 关闭：捕获阶段处理，避免嵌套浮层同时关闭；焦点在面板内时归还触发元素
  useEffect(() => {
    if (!actualOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      const insidePanel = panelRef.current?.contains(document.activeElement) === true
      setOpen(false)
      if (insidePanel) focusTrigger()
    }
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [actualOpen, setOpen])

  const scheduleHoverOpen = () => {
    clearHoverTimer()
    hoverTimerRef.current = setTimeout(() => {
      updatePosition()
      setOpen(true)
    }, HOVER_OPEN_DELAY)
  }

  const scheduleHoverClose = () => {
    clearHoverTimer()
    hoverTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY)
  }

  if (disabled) return children

  const child = children as ReactElement<PopoverTriggerProps>
  const childProps = child.props
  const triggerId = childProps.id ?? `${panelId}-trigger`

  const triggerElement = cloneElement(child, {
    id: triggerId,
    'aria-haspopup': 'dialog',
    'aria-expanded': actualOpen,
    'aria-controls': actualOpen ? panelId : undefined,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      childProps.onClick?.(event)
      if (trigger !== 'click') return
      setOpen(!actualOpenRef.current)
    },
    onMouseEnter: (event: ReactMouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(event)
      if (trigger !== 'hover') return
      scheduleHoverOpen()
    },
    onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(event)
      if (trigger !== 'hover') return
      scheduleHoverClose()
    },
    onFocus: (event: ReactFocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event)
      if (trigger !== 'focus' || actualOpenRef.current) return
      updatePosition()
      setOpen(true)
    },
    onBlur: (event: ReactFocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event)
      if (trigger !== 'focus') return
      const next = event.relatedTarget
      if (next instanceof Node && (panelRef.current?.contains(next) || wrapperRef.current?.contains(next))) return
      setOpen(false)
    },
  })

  return (
    <>
      <span ref={wrapperRef} className={cx('aelux-popover-trigger', className)}>
        {triggerElement}
      </span>
      {actualOpen && position !== null && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-labelledby={triggerId}
              className={cx('aelux-popover', `aelux-popover--${placement}`, panelClassName)}
              style={{ left: position.left, top: position.top }}
              onMouseEnter={() => {
                if (trigger === 'hover') clearHoverTimer()
              }}
              onMouseLeave={() => {
                if (trigger === 'hover') scheduleHoverClose()
              }}
              onBlur={(event: ReactFocusEvent<HTMLDivElement>) => {
                if (trigger !== 'focus') return
                const next = event.relatedTarget
                if (next instanceof Node && (panelRef.current?.contains(next) || wrapperRef.current?.contains(next))) {
                  return
                }
                setOpen(false)
              }}
            >
              <span className="aelux-popover__arrow" aria-hidden="true" />
              <div className="aelux-popover__content">{content}</div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
