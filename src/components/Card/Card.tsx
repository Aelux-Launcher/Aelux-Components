import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export type CardVariant = 'default' | 'flat' | 'outline'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 外观，默认 default */
  variant?: CardVariant
  /** 内边距，默认 md */
  padding?: CardPadding
  /** 悬浮抬升效果 */
  hoverable?: boolean
  children?: ReactNode
}

/** 卡片内可组合区块的公共 Props */
export type CardSectionProps = HTMLAttributes<HTMLDivElement>

/**
 * 卡片页头：通常组合 CardTitle / CardDescription 使用。
 */
export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('aelux-card__header', className)} {...rest} />
})

CardHeader.displayName = 'CardHeader'

/**
 * 卡片标题。
 */
export const CardTitle = forwardRef<HTMLDivElement, CardSectionProps>(function CardTitle(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('aelux-card__title', className)} {...rest} />
})

CardTitle.displayName = 'CardTitle'

/**
 * 卡片副标题 / 说明文字。
 */
export const CardDescription = forwardRef<HTMLDivElement, CardSectionProps>(function CardDescription(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('aelux-card__description', className)} {...rest} />
})

CardDescription.displayName = 'CardDescription'

/**
 * 卡片正文容器。
 */
export const CardContent = forwardRef<HTMLDivElement, CardSectionProps>(function CardContent(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('aelux-card__content', className)} {...rest} />
})

CardContent.displayName = 'CardContent'

/**
 * 卡片页脚：多用于放置操作按钮。
 */
export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('aelux-card__footer', className)} {...rest} />
})

CardFooter.displayName = 'CardFooter'

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', padding = 'md', hoverable = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        'aelux-card',
        `aelux-card--${variant}`,
        `aelux-card--padding-${padding}`,
        hoverable && 'aelux-card--hoverable',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
})

CardRoot.displayName = 'Card'

/**
 * 卡片 —— 白底、圆角 8、padding 20、shadow-sm 为默认外观。
 * 可通过 Card.Header / Card.Title / Card.Description / Card.Content / Card.Footer 组合内容。
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
})
