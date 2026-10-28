import { forwardRef, useId, useRef, useState } from 'react'
import type { DragEvent, ReactNode } from 'react'
import { IconClose, IconFolder } from '../../icons'
import { cx } from '../../utils/cx'

export interface FilePickerProps {
  /** 字段标签 */
  label?: ReactNode
  /** 辅助说明，例如接受的格式 */
  hint?: ReactNode
  /** 接受的文件类型，如 ".zip,.mrpack" */
  accept?: string
  /** 是否允许多选，默认 false */
  multiple?: boolean
  /** 受控文件列表 */
  files?: File[]
  /** 非受控初始文件列表 */
  defaultFiles?: File[]
  /** 文件列表变化回调 */
  onChange?: (files: File[]) => void
  /** 移除某个文件时触发（列表仍会同步变化） */
  onRemove?: (file: File, index: number) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  ariaLabel?: string
  /** 附加类名 */
  className?: string
  /** 未选择文件时的占位文案 */
  emptyText?: ReactNode
}

const ICON_SIZE = { sm: 14, md: 16, lg: 18 } as const

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

/** 判断文件是否命中 accept 声明：扩展名、通配 MIME 或精确 MIME。 */
function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  if (tokens.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

/**
 * 文件选择器 —— 点击或拖入文件后以列表展示，可逐个移除。
 */
export const FilePicker = forwardRef<HTMLDivElement, FilePickerProps>(function FilePicker(
  {
    label,
    hint,
    accept,
    multiple = false,
    files,
    defaultFiles,
    onChange,
    onRemove,
    disabled = false,
    size = 'md',
    block = false,
    ariaLabel,
    className,
    emptyText,
  },
  ref,
) {
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [innerFiles, setInnerFiles] = useState<File[]>(() => defaultFiles ?? [])

  const controlled = files !== undefined
  const currentFiles = controlled ? files : innerFiles

  const update = (next: File[]) => {
    if (!controlled) setInnerFiles(next)
    onChange?.(next)
  }

  const addFiles = (incoming: File[]) => {
    const accepted = accept ? incoming.filter((file) => matchesAccept(file, accept)) : incoming
    if (accepted.length === 0) return
    update(multiple ? [...currentFiles, ...accepted] : accepted.slice(0, 1))
  }

  const handleInputChange = () => {
    const input = inputRef.current
    if (!input) return
    addFiles(Array.from(input.files ?? []))
    input.value = ''
  }

  const handleRemove = (file: File, index: number) => {
    update(currentFiles.filter((_, itemIndex) => itemIndex !== index))
    onRemove?.(file, index)
  }

  const handleDragEnter = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (disabled) return
    dragDepth.current += 1
    setDragging(true)
  }

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (disabled) return
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    if (disabled) return
    addFiles(Array.from(event.dataTransfer.files))
  }

  const triggerText =
    currentFiles.length === 0
      ? '点击选择文件'
      : multiple
        ? `已选择 ${currentFiles.length} 个文件 · 继续添加`
        : '重新选择文件'

  return (
    <div
      ref={ref}
      className={cx(
        'aelux-file-picker',
        `aelux-file-picker--${size}`,
        block && 'aelux-file-picker--block',
        disabled && 'aelux-file-picker--disabled',
        className,
      )}
    >
      {label == null ? null : <span className="aelux-file-picker__label">{label}</span>}
      <button
        type="button"
        className={cx('aelux-file-picker__trigger', dragging && 'is-dragging')}
        disabled={disabled}
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : '选择文件')}
        aria-describedby={hint == null ? undefined : hintId}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="aelux-file-picker__icon" aria-hidden="true">
          <IconFolder size={ICON_SIZE[size]} />
        </span>
        <span className="aelux-file-picker__text">
          <span className="aelux-file-picker__title">{triggerText}</span>
          {hint == null ? null : (
            <span className="aelux-file-picker__hint" id={hintId}>
              {hint}
            </span>
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="aelux-file-picker__input"
        hidden
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
      />
      <ul className="aelux-file-picker__list">
        {currentFiles.length === 0 ? (
          <li className="aelux-file-picker__empty">{emptyText ?? '尚未选择文件'}</li>
        ) : (
          currentFiles.map((file, index) => (
            <li key={`${file.name}-${file.size}-${index}`} className="aelux-file-picker__item">
              <span className="aelux-file-picker__item-name" title={file.name}>
                {file.name}
              </span>
              <span className="aelux-file-picker__item-size">{formatFileSize(file.size)}</span>
              <button
                type="button"
                className="aelux-file-picker__remove"
                disabled={disabled}
                aria-label={`移除文件 ${file.name}`}
                onClick={() => handleRemove(file, index)}
              >
                <IconClose size={12} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
})

FilePicker.displayName = 'FilePicker'
