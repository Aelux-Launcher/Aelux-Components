import { useState } from 'react'
import type { ReactNode } from 'react'
import { cx, IconCheck, IconCopy } from 'aelux-components'

export interface ShowcaseBlockProps {
  /** 示例标题 */
  title: string
  /** 示例说明 */
  description?: ReactNode
  /** 可选的示例代码 */
  code?: string
  /** 纵向排列（默认横向 wrap） */
  column?: boolean
  children: ReactNode
}

/**
 * 展示站的示例区块：标题 + 说明 + 预览区 + 可选代码。
 */
export function ShowcaseBlock({ title, description, code, column = false, children }: ShowcaseBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // 剪贴板不可用时静默失败（例如非安全上下文）
    }
  }

  return (
    <section className="demo-block">
      <header className="demo-block__head">
        <div className="demo-block__heading">
          <h3 className="demo-block__title">{title}</h3>
          {description ? <p className="demo-block__desc">{description}</p> : null}
        </div>
        {code ? (
          <button
            type="button"
            className={cx('demo-block__copy', copied && 'is-copied')}
            onClick={handleCopy}
            aria-label="复制示例代码"
          >
            {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
            <span>{copied ? '已复制' : '复制代码'}</span>
          </button>
        ) : null}
      </header>

      <div className={cx('demo-block__preview', column && 'demo-block__preview--column')}>{children}</div>

      {code ? (
        <pre className="demo-block__code">
          <code>{code}</code>
        </pre>
      ) : null}
    </section>
  )
}
