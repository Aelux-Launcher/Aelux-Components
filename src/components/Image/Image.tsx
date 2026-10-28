import { forwardRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { IconEye } from '../../icons'

export interface ImageProps {
  src?: string
  alt?: string
  /** 无图 / 加载失败时展示的内容 */
  fallback?: ReactNode
  /** 宽高比：预设 square / video / wide / auto 或数字（1.5） */
  ratio?: 'square' | 'video' | 'wide' | 'auto' | number
  /** 图片填充方式 */
  fit?: 'cover' | 'contain' | 'fill'
  rounded?: boolean
  loading?: 'lazy' | 'eager'
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

function toAspectRatio(ratio: ImageProps['ratio']): string | undefined {
  if (typeof ratio === 'number') {
    return Number.isFinite(ratio) && ratio > 0 ? String(ratio) : undefined
  }
  if (ratio === 'square') return '1 / 1'
  if (ratio === 'video') return '16 / 9'
  if (ratio === 'wide') return '21 / 9'
  return undefined
}

export const Image = forwardRef<HTMLDivElement, ImageProps>(function Image(
  { src, alt, fallback, ratio = 'auto', fit = 'cover', rounded = false, loading, className, style, onClick },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined)
  const hasSource = Boolean(src) && failedSrc !== src
  const clickable = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      ref={ref}
      className={cx(
        'aelux-image',
        fit && `aelux-image--${fit}`,
        rounded && 'aelux-image--rounded',
        clickable && 'aelux-image--clickable',
        className,
      )}
      style={{ aspectRatio: toAspectRatio(ratio), ...style }}
      onClick={onClick}
      onKeyDown={clickable ? handleKeyDown : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? alt || '图片' : undefined}
    >
      {hasSource ? (
        <img
          className="aelux-image__img"
          src={src}
          alt={alt ?? ''}
          loading={loading}
          draggable={false}
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <div className="aelux-image__fallback" role="img" aria-label={alt || '图片未加载'}>
          {fallback ?? (
            <>
              <IconEye size={20} />
              {alt ? <span className="aelux-image__alt">{alt}</span> : null}
            </>
          )}
        </div>
      )}
    </div>
  )
})

Image.displayName = 'Image'
