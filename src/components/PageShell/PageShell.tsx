import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { IconChevronLeft } from '../../icons'
import { cx } from '../../utils/cx'

export interface PageShellProps {
  title: ReactNode
  description?: ReactNode
  /** 返回按钮文案，传入时显示返回按钮 */
  backLabel?: ReactNode
  onBack?: () => void
  /** 标题右侧操作区 */
  actions?: ReactNode
  /** 页面底部固定操作区 */
  footer?: ReactNode
  /** 页面级开关（例如“仅本地”） */
  meta?: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * 页面外壳 —— 启动器内容页的「头部 / 内容 / 底部」三段式骨架。
 * 头部包含可选返回按钮、标题、描述、标记与操作区；内容区独立滚动；footer 固定在底部。
 */
export const PageShell = forwardRef<HTMLDivElement, PageShellProps>(function PageShell(
  { title, description, backLabel, onBack, actions, footer, meta, children, className },
  ref,
) {
  return (
    <div ref={ref} className={cx('aelux-page-shell', className)}>
      <header className="aelux-page-shell__header">
        <div className="aelux-page-shell__bar">
          {onBack ? (
            <button type="button" className="aelux-page-shell__back" onClick={onBack}>
              <IconChevronLeft size={14} />
              <span>{backLabel ?? '返回'}</span>
            </button>
          ) : null}
          <div className="aelux-page-shell__titles">
            <div className="aelux-page-shell__title-row">
              <h2 className="aelux-page-shell__title">{title}</h2>
              {meta != null ? <div className="aelux-page-shell__meta">{meta}</div> : null}
            </div>
            {description != null ? (
              <p className="aelux-page-shell__description">{description}</p>
            ) : null}
          </div>
          {actions != null ? <div className="aelux-page-shell__actions">{actions}</div> : null}
        </div>
      </header>

      <div className="aelux-page-shell__content">{children}</div>

      {footer != null ? <footer className="aelux-page-shell__footer">{footer}</footer> : null}
    </div>
  )
})

PageShell.displayName = 'PageShell'
