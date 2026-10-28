import { forwardRef, useRef, useState } from 'react'
import type {
  ChangeEvent,
  DragEvent as ReactDragEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react'
import { IconDownload } from '../../icons'
import { cx } from '../../utils/cx'

export interface DropZoneProps {
  /** 通过校验的文件回调 */
  onFiles?: (files: File[]) => void
  /** 被拒绝的文件回调，reason 为 size（超过 maxSize）或 type（不匹配 accept） */
  onReject?: (files: File[], reason: 'size' | 'type') => void
  /** 接受的类型，语法同 input[accept]，如 ".zip,.mrpack" 或 "audio/*" */
  accept?: string
  /** 是否允许多选，默认 false */
  multiple?: boolean
  disabled?: boolean
  /** 单个文件大小上限（字节） */
  maxSize?: number
  /** 标题，默认「点击或拖拽文件到此处」 */
  title?: ReactNode
  /** 说明文案 */
  description?: ReactNode
  /** 自定义图标 */
  icon?: ReactNode
  /** 隐藏 file input 的 id，可用于 label 关联 */
  inputId?: string
  className?: string
  /** 拖拽区无障碍名称 */
  ariaLabel?: string
}

function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 0)
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
 * 拖拽导入区 —— 点击 / 回车 / 空格打开文件选择，拖入高亮，按 accept 与 maxSize 过滤并回调。
 */
export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(function DropZone(
  {
    onFiles,
    onReject,
    accept,
    multiple = false,
    disabled = false,
    maxSize,
    title,
    description,
    icon,
    inputId,
    className,
    ariaLabel,
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)

  const openPicker = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const processFiles = (fileList: FileList | null) => {
    if (disabled || fileList == null || fileList.length === 0) return
    const incoming = Array.from(fileList)
    const candidates = multiple ? incoming : incoming.slice(0, 1)
    const accepted: File[] = []
    const typeRejected: File[] = []
    const sizeRejected: File[] = []

    for (const file of candidates) {
      if (accept != null && accept.trim() !== '' && !matchesAccept(file, accept)) {
        typeRejected.push(file)
        continue
      }
      if (maxSize != null && file.size > maxSize) {
        sizeRejected.push(file)
        continue
      }
      accepted.push(file)
    }

    if (typeRejected.length > 0) onReject?.(typeRejected, 'type')
    if (sizeRejected.length > 0) onReject?.(sizeRejected, 'size')
    if (accepted.length > 0) onFiles?.(accepted)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFiles(event.currentTarget.files)
    event.currentTarget.value = ''
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPicker()
    }
  }

  const handleDragEnter = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return
    dragDepth.current += 1
    setDragging(true)
  }

  const handleDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (disabled) return
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }

  const handleDrop = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepth.current = 0
    setDragging(false)
    if (disabled) return
    processFiles(event.dataTransfer.files)
  }

  const label = ariaLabel ?? (typeof title === 'string' ? title : '导入文件')

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={cx(
        'aelux-dropzone',
        dragging && 'aelux-dropzone--dragging',
        disabled && 'aelux-dropzone--disabled',
        className,
      )}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="aelux-dropzone__input"
        accept={accept}
        multiple={multiple}
        tabIndex={-1}
        aria-hidden="true"
        onClick={(event) => event.stopPropagation()}
        onChange={handleInputChange}
      />
      <span className="aelux-dropzone__icon" aria-hidden="true">
        {icon ?? <IconDownload size={20} />}
      </span>
      <span className="aelux-dropzone__title">{title ?? '点击或拖拽文件到此处'}</span>
      {description != null ? <span className="aelux-dropzone__desc">{description}</span> : null}
    </div>
  )
})

DropZone.displayName = 'DropZone'
