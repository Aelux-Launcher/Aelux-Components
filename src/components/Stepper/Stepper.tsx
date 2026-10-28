import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { IconCheck } from '../../icons'
import { cx } from '../../utils/cx'

export interface StepItem {
  key: string
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface StepperProps {
  /** 步骤列表 */
  steps: StepItem[]
  /** 当前步骤索引（从 0 开始） */
  current: number
  /** clickable 时点击步骤触发 */
  onStepChange?: (index: number) => void
  /** 是否允许点击切换步骤 */
  clickable?: boolean
  className?: string
  /** 步骤条无障碍名称 */
  ariaLabel?: string
}

/**
 * 步骤条 —— 横向布局，完成步骤显示对勾，当前步骤高亮，可点击切换。
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, onStepChange, clickable = false, className, ariaLabel },
  ref,
) {
  return (
    <ol ref={ref} className={cx('aelux-stepper', className)} aria-label={ariaLabel ?? '步骤'}>
      {steps.map((step, index) => {
        const status = index < current ? 'done' : index === current ? 'current' : 'todo'
        const interactive = clickable && !step.disabled && onStepChange != null
        const content = (
          <>
            <div className="aelux-stepper__head">
              <span className="aelux-stepper__indicator">
                {status === 'done' ? (
                  <IconCheck size={13} />
                ) : (
                  (step.icon ?? <span className="aelux-stepper__number">{index + 1}</span>)
                )}
              </span>
              {index < steps.length - 1 ? (
                <span
                  className={cx('aelux-stepper__line', index < current && 'aelux-stepper__line--done')}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className="aelux-stepper__body">
              <span className="aelux-stepper__title">{step.title}</span>
              {step.description != null ? (
                <span className="aelux-stepper__desc">{step.description}</span>
              ) : null}
            </div>
          </>
        )
        return (
          <li
            key={step.key}
            className={cx(
              'aelux-stepper__item',
              `aelux-stepper__item--${status}`,
              step.disabled && 'aelux-stepper__item--disabled',
            )}
            aria-current={status === 'current' ? 'step' : undefined}
            aria-disabled={step.disabled || undefined}
          >
            {interactive ? (
              <button
                type="button"
                className="aelux-stepper__inner aelux-stepper__inner--interactive"
                onClick={() => onStepChange?.(index)}
              >
                {content}
              </button>
            ) : (
              <div className="aelux-stepper__inner">{content}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
})

Stepper.displayName = 'Stepper'
