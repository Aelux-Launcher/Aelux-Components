import { forwardRef, useState } from 'react'
import type { CSSProperties, ChangeEvent, InputHTMLAttributes } from 'react'
import { cx } from '../../utils/cx'

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size'> {
  /** 受控值 */
  value?: number
  /** 非受控默认值 */
  defaultValue?: number
  /** 最小值，默认 0 */
  min?: number
  /** 最大值，默认 100 */
  max?: number
  /** 步长，默认 1 */
  step?: number
  /** 值变化回调 */
  onChange?: (value: number) => void
  /** 尺寸，默认 md */
  size?: 'sm' | 'md'
  /** 右侧显示当前值 */
  showValue?: boolean
}

/**
 * 滑动输入 —— 原生 range + 自定义轨道/滑块，键盘方向键原生可用。
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    size = 'md',
    showValue = false,
    disabled,
    className,
    style,
    ...rest
  },
  ref,
) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<number>(() =>
    defaultValue == null ? min + (max - min) / 2 : defaultValue,
  )
  const currentValue = isControlled ? value : uncontrolledValue

  const ratio = max > min ? (currentValue - min) / (max - min) : 0
  const percent = Math.min(100, Math.max(0, ratio * 100))

  const rootStyle = {
    '--aelux-slider-percent': `${percent}%`,
    ...style,
  } as CSSProperties

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.currentTarget.value)
    if (!isControlled) setUncontrolledValue(next)
    onChange?.(next)
  }

  return (
    <div
      className={cx(
        'aelux-slider',
        `aelux-slider--${size}`,
        disabled && 'aelux-slider--disabled',
        className,
      )}
      style={rootStyle}
    >
      <input
        ref={ref}
        type="range"
        className="aelux-slider__input"
        min={min}
        max={max}
        step={step}
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />
      {showValue ? <span className="aelux-slider__value">{currentValue}</span> : null}
    </div>
  )
})

Slider.displayName = 'Slider'
