import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { IconCheck, IconChevronLeft, IconChevronRight } from '../../icons'
import { cx } from '../../utils/cx'
import { Button } from '../Button'
import { Stepper } from '../Stepper'

export interface WizardStep {
  key: string
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface WizardProps {
  steps: WizardStep[]
  current: number
  children?: ReactNode
  onStepChange?: (index: number) => void
  onNext?: () => void
  onPrev?: () => void
  onFinish?: () => void
  nextText?: ReactNode
  prevText?: ReactNode
  finishText?: ReactNode
  clickable?: boolean
  loading?: boolean
  className?: string
}

/**
 * 安装向导 —— 顶部复用 Stepper 步骤条，中部为当前步骤内容，底部提供「上一步 / 下一步 / 完成」。
 * 步骤索引由 current 受控，所有切换都通过回调交给调用方处理。
 */
export const Wizard = forwardRef<HTMLDivElement, WizardProps>(function Wizard(
  {
    steps,
    current,
    children,
    onStepChange,
    onNext,
    onPrev,
    onFinish,
    nextText,
    prevText,
    finishText,
    clickable = false,
    loading = false,
    className,
  },
  ref,
) {
  const lastIndex = steps.length - 1
  const safeCurrent = lastIndex < 0 ? 0 : Math.min(Math.max(current, 0), lastIndex)
  const isFirst = safeCurrent <= 0
  const isLast = safeCurrent >= lastIndex

  return (
    <div ref={ref} className={cx('aelux-wizard', className)}>
      <div className="aelux-wizard__steps">
        <Stepper
          steps={steps.map((step) => ({
            key: step.key,
            title: step.label,
            description: step.description,
            disabled: step.disabled,
          }))}
          current={safeCurrent}
          clickable={clickable}
          onStepChange={onStepChange}
          ariaLabel="向导步骤"
        />
      </div>

      <div className="aelux-wizard__body">{children}</div>

      <div className="aelux-wizard__footer">
        <Button
          variant="secondary"
          size="md"
          disabled={isFirst || loading}
          leftIcon={<IconChevronLeft size={14} />}
          onClick={onPrev}
        >
          {prevText ?? '上一步'}
        </Button>
        <span className="aelux-wizard__spacer" />
        {isLast ? (
          <Button
            variant="primary"
            size="md"
            loading={loading}
            rightIcon={<IconCheck size={14} />}
            onClick={onFinish}
          >
            {finishText ?? '完成'}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            loading={loading}
            rightIcon={<IconChevronRight size={14} />}
            onClick={onNext}
          >
            {nextText ?? '下一步'}
          </Button>
        )}
      </div>
    </div>
  )
})

Wizard.displayName = 'Wizard'
