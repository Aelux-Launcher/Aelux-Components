import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { IconCheck } from '../../icons'
import { cx } from '../../utils/cx'

export interface ColorPickerPreset {
  value: string
  label?: ReactNode
}

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** 预设色板，允许字符串或 { value, label } */
  presets?: Array<string | ColorPickerPreset>
  /** 是否允许直接输入 hex 色值，默认 true */
  allowCustom?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  className?: string
  ariaLabel?: string
}

const DEFAULT_PRESETS = ['#0EA5E9', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#64748B']
const HEX_PATTERN = /^#?([0-9a-fA-F]{6})$/

interface NormalizedPreset {
  value: string
  label?: ReactNode
}

function normalizeHex(input: string): string | null {
  const match = HEX_PATTERN.exec(input.trim())
  return match ? `#${match[1].toUpperCase()}` : null
}

function srgbChannel(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

/** 依据背景色亮度选择对勾颜色，保证在浅色/深色色块上都清晰可见 */
function contrastColor(hex: string): string {
  const normalized = normalizeHex(hex)
  if (normalized == null) return '#FFFFFF'
  const red = srgbChannel(parseInt(normalized.slice(1, 3), 16) / 255)
  const green = srgbChannel(parseInt(normalized.slice(3, 5), 16) / 255)
  const blue = srgbChannel(parseInt(normalized.slice(5, 7), 16) / 255)
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
  return luminance > 0.5 ? '#10222F' : '#FFFFFF'
}

/**
 * 颜色选择器 —— 方块色板（radiogroup 语义、方向键切换、选中描边 + 对勾），
 * allowCustom 时提供 #RRGGBB 输入，非法色值不提交并展示错误提示。
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  {
    value,
    defaultValue,
    onValueChange,
    presets,
    allowCustom = true,
    disabled = false,
    size = 'md',
    className,
    ariaLabel,
  },
  ref,
) {
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(
    () => normalizeHex(defaultValue ?? '') ?? DEFAULT_PRESETS[0],
  )
  const currentValue = isControlled ? (value ?? '') : uncontrolledValue

  const palette = useMemo<NormalizedPreset[]>(() => {
    const source = presets && presets.length > 0 ? presets : DEFAULT_PRESETS
    return source.map((preset) => {
      if (typeof preset === 'string') {
        return { value: normalizeHex(preset) ?? preset }
      }
      return { value: normalizeHex(preset.value) ?? preset.value, label: preset.label }
    })
  }, [presets])

  const currentHex = (normalizeHex(currentValue) ?? currentValue).toUpperCase()
  const selectedPresetIndex = palette.findIndex((preset) => preset.value.toUpperCase() === currentHex)

  const [draft, setDraft] = useState(currentValue)
  const [invalid, setInvalid] = useState(false)
  const swatchRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    setDraft(currentValue)
    setInvalid(false)
  }, [currentValue])

  const commitValue = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    onValueChange?.(next)
    setDraft(next)
    setInvalid(false)
  }

  const commitDraft = (): boolean => {
    if (disabled) return false
    const normalized = normalizeHex(draft)
    if (normalized == null) {
      setInvalid(true)
      return false
    }
    commitValue(normalized)
    return true
  }

  const focusSwatch = (index: number) => {
    const swatch = swatchRefs.current[index]
    if (swatch == null) return
    swatch.focus()
    commitValue(palette[index].value)
  }

  const handleSwatchKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (disabled || palette.length === 0) return
    const lastIndex = palette.length - 1
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = index === lastIndex ? 0 : index + 1
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = index === 0 ? lastIndex : index - 1
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = lastIndex
    }
    if (nextIndex == null) return
    event.preventDefault()
    focusSwatch(nextIndex)
  }

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitDraft()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setDraft(currentValue)
      setInvalid(false)
    }
  }

  const handleInputBlur = () => {
    const normalized = normalizeHex(draft)
    if (normalized == null) {
      if (draft.trim() !== '') setInvalid(true)
      return
    }
    if (normalized !== currentValue) commitValue(normalized)
    else setInvalid(false)
  }

  const iconSize = size === 'sm' ? 10 : 12

  return (
    <div
      ref={ref}
      className={cx(
        'aelux-color-picker',
        `aelux-color-picker--${size}`,
        disabled && 'aelux-color-picker--disabled',
        className,
      )}
    >
      <div className="aelux-color-picker__palette" role="radiogroup" aria-label={ariaLabel ?? '选择颜色'}>
        {palette.map((preset, index) => {
          const selected = preset.value.toUpperCase() === currentHex
          const presetLabel = typeof preset.label === 'string' ? preset.label : `颜色 ${preset.value}`
          return (
            <button
              key={`${preset.value}-${index}`}
              ref={(element) => {
                swatchRefs.current[index] = element
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={presetLabel}
              title={preset.value}
              tabIndex={disabled ? -1 : selected || (selectedPresetIndex < 0 && index === 0) ? 0 : -1}
              className={cx(
                'aelux-color-picker__swatch',
                selected && 'aelux-color-picker__swatch--selected',
              )}
              style={{ backgroundColor: preset.value }}
              disabled={disabled}
              onKeyDown={(event) => handleSwatchKeyDown(event, index)}
              onClick={() => commitValue(preset.value)}
            >
              {selected ? <IconCheck size={iconSize} style={{ color: contrastColor(preset.value) }} /> : null}
              <span className="aelux-sr-only">{preset.value}</span>
            </button>
          )
        })}
      </div>
      {allowCustom ? (
        <div className={cx('aelux-color-picker__custom', invalid && 'aelux-color-picker__custom--invalid')}>
          <span
            className="aelux-color-picker__preview"
            style={{ backgroundColor: normalizeHex(draft) ?? currentValue }}
            aria-hidden="true"
          />
          <input
            type="text"
            className="aelux-color-picker__input"
            value={draft}
            placeholder="#0EA5E9"
            spellCheck={false}
            disabled={disabled}
            aria-label={ariaLabel ? `${ariaLabel}：自定义色值` : '自定义颜色（#RRGGBB）'}
            aria-invalid={invalid || undefined}
            onChange={(event) => {
              setDraft(event.currentTarget.value)
              setInvalid(false)
            }}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
          />
          <span className="aelux-color-picker__hint">#RRGGBB</span>
        </div>
      ) : null}
      {invalid ? (
        <p className="aelux-color-picker__error" role="alert">
          请输入 #RRGGBB 格式的色值
        </p>
      ) : null}
    </div>
  )
})

ColorPicker.displayName = 'ColorPicker'
