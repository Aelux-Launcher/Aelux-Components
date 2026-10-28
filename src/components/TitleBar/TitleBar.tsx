import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { IconClose, IconMinus } from '../../icons'
import { cx } from '../../utils/cx'

export interface TitleBarProps {
  /** 标题 */
  title?: ReactNode
  /** 应用图标 */
  icon?: ReactNode
  /** 副标题 / 状态文案 */
  subtitle?: ReactNode
  /** 标题栏中间区域 */
  children?: ReactNode
  /** 最小化回调 */
  onMinimize?: () => void
  /** 最大化 / 还原回调 */
  onMaximize?: () => void
  /** 关闭回调 */
  onClose?: () => void
  /** 当前是否已最大化（切换还原图标） */
  maximized?: boolean
  /** 是否渲染右侧窗口按钮，默认 true */
  showControls?: boolean
  /** 为可拖动区域添加 data-tauri-drag-region */
  dragRegion?: boolean
  className?: string
}

function MaximizeGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <rect x="0.5" y="0.5" width="9" height="9" rx="1.2" />
    </svg>
  )
}

function RestoreGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <rect x="0.5" y="2.5" width="7" height="7" rx="1" />
      <path d="M2.5 2.5V2a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 9.5 2v4A1.5 1.5 0 0 1 8 7.5H7.5" />
    </svg>
  )
}

/**
 * 自定义窗口标题栏（Auri / Tauri 启动器使用）——36px 高，左侧图标 + 标题 + 副标题，
 * 中间内容区，右侧最小化 / 最大化（还原）/ 关闭按钮。dragRegion 时按钮以外的区域可拖动窗口。
 */
export const TitleBar = forwardRef<HTMLDivElement, TitleBarProps>(function TitleBar(
  {
    title,
    icon,
    subtitle,
    children,
    onMinimize,
    onMaximize,
    onClose,
    maximized = false,
    showControls = true,
    dragRegion = false,
    className,
  },
  ref,
) {
  const dragAttr = dragRegion ? '' : undefined

  return (
    <div
      ref={ref}
      data-tauri-drag-region={dragAttr}
      className={cx('aelux-titlebar', maximized && 'aelux-titlebar--maximized', className)}
    >
      <div className="aelux-titlebar__brand" data-tauri-drag-region={dragAttr}>
        {icon !== undefined ? (
          <span className="aelux-titlebar__icon" data-tauri-drag-region={dragAttr}>
            {icon}
          </span>
        ) : null}
        <span className="aelux-titlebar__titles" data-tauri-drag-region={dragAttr}>
          {title !== undefined ? (
            <span className="aelux-titlebar__title" data-tauri-drag-region={dragAttr}>
              {title}
            </span>
          ) : null}
          {subtitle !== undefined ? (
            <span className="aelux-titlebar__subtitle" data-tauri-drag-region={dragAttr}>
              {subtitle}
            </span>
          ) : null}
        </span>
      </div>
      <div className="aelux-titlebar__center" data-tauri-drag-region={dragAttr}>
        {children}
      </div>
      {showControls ? (
        <div className="aelux-titlebar__controls">
          <button
            type="button"
            className="aelux-titlebar__control"
            aria-label="最小化"
            title="最小化"
            onClick={() => onMinimize?.()}
          >
            <IconMinus size={13} />
          </button>
          <button
            type="button"
            className="aelux-titlebar__control"
            aria-label={maximized ? '还原' : '最大化'}
            title={maximized ? '还原' : '最大化'}
            onClick={() => onMaximize?.()}
          >
            {maximized ? <RestoreGlyph /> : <MaximizeGlyph />}
          </button>
          <button
            type="button"
            className="aelux-titlebar__control aelux-titlebar__control--close"
            aria-label="关闭"
            title="关闭"
            onClick={() => onClose?.()}
          >
            <IconClose size={13} />
          </button>
        </div>
      ) : null}
    </div>
  )
})

TitleBar.displayName = 'TitleBar'
