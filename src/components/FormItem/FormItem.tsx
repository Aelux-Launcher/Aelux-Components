import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'

export interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
  /** 字段标签 */
  label?: ReactNode
  /** 关联控件 id */
  htmlFor?: string
  /** 必填标记 */
  required?: boolean
  /** 辅助说明（错误时被 error 覆盖） */
  hint?: ReactNode
  /** 错误信息 */
  error?: ReactNode
  /** 标签与控件同一行 */
  inline?: boolean
  children?: ReactNode
}

/**
 * 表单项 —— 标签 / 必填标记 / 说明与错误信息的统一布局容器。
 */
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(function FormItem(
  {
    label,
    htmlFor,
    required = false,
    hint,
    error,
    inline = false,
    children,
    className,
    ...rest
  },
  ref,
) {
  const hasError = Boolean(error)

  return (
    <div
      ref={ref}
      className={cx(
        'aelux-form-item',
        inline && 'aelux-form-item--inline',
        hasError && 'aelux-form-item--error',
        className,
      )}
      {...rest}
    >
      {label != null ? (
        <label className="aelux-form-item__label" htmlFor={htmlFor}>
          <span className="aelux-form-item__label-text">{label}</span>
          {required ? (
            <span className="aelux-form-item__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <div className="aelux-form-item__body">
        <div className="aelux-form-item__control">{children}</div>
        {hasError ? (
          <div className="aelux-form-item__message aelux-form-item__message--error" role="alert">
            {error}
          </div>
        ) : hint != null ? (
          <div className="aelux-form-item__message">{hint}</div>
        ) : null}
      </div>
    </div>
  )
})

FormItem.displayName = 'FormItem'
