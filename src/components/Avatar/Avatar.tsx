import { forwardRef, useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { IconUser } from '../../icons'
import { cx } from '../../utils/cx'

export type AvatarSize = 'sm' | 'md' | 'lg' | number
export type AvatarShape = 'circle' | 'rounded' | 'square'
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 图片地址 */
  src?: string
  /** 图片替代文字 */
  alt?: string
  /** 名称：用于生成首字占位（中文取首字，英文取首字母） */
  name?: string
  /** 尺寸：sm 24 / md 32 / lg 40，或自定义像素数值 */
  size?: AvatarSize
  /** 形状 */
  shape?: AvatarShape
  /** 自定义占位图标（优先于 name 占位） */
  icon?: ReactNode
  /** 在线状态点 */
  status?: AvatarStatus
}

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = { sm: 24, md: 32, lg: 40 }

const STATUS_LABEL: Record<AvatarStatus, string> = {
  online: '在线',
  busy: '忙碌',
  away: '离开',
  offline: '离线',
}

/**
 * 头像 —— 支持图片、首字占位、图标占位、自定义尺寸、形状与在线状态。
 * 图片加载失败时自动降级为占位。
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, name, size = 'md', shape = 'circle', icon, status, className, style, ...rest },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  const isNumeric = typeof size === 'number'
  const boxSize = isNumeric ? size : SIZE_PX[size]
  const mergedStyle = isNumeric
    ? {
        width: boxSize,
        height: boxSize,
        fontSize: Math.max(10, Math.round(boxSize * 0.4)),
        ...style,
      }
    : style

  const showImage = Boolean(src) && failedSrc !== src
  const initial = name ? Array.from(name.trim())[0]?.toUpperCase() : undefined
  const label = alt ?? name ?? '头像'

  return (
    <span
      ref={ref}
      className={cx(
        'aelux-avatar',
        !isNumeric && `aelux-avatar--${size}`,
        `aelux-avatar--${shape}`,
        className,
      )}
      style={mergedStyle}
      {...rest}
    >
      {showImage ? (
        <img
          className="aelux-avatar__image"
          src={src}
          alt={label}
          draggable={false}
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <span className="aelux-avatar__placeholder" role="img" aria-label={label}>
          {icon ? (
            <span className="aelux-avatar__icon" aria-hidden="true">
              {icon}
            </span>
          ) : initial ? (
            <span className="aelux-avatar__initial" aria-hidden="true">
              {initial}
            </span>
          ) : (
            <IconUser size={Math.max(12, Math.round(boxSize * 0.5))} aria-hidden="true" />
          )}
        </span>
      )}
      {status ? (
        <span
          className={cx('aelux-avatar__status', `aelux-avatar__status--${status}`)}
          role="img"
          aria-label={STATUS_LABEL[status]}
        />
      ) : null}
    </span>
  )
})

Avatar.displayName = 'Avatar'
