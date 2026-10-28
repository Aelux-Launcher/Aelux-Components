import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconProps } from './Icon'

function createIcon(displayName: string, children: ReactNode) {
  const Component = forwardRef<SVGSVGElement, IconProps>(function AeluxIcon(props, ref) {
    return (
      <Icon ref={ref} {...props}>
        {children}
      </Icon>
    )
  })
  Component.displayName = displayName
  return Component
}

/** 勾选 */
export const IconCheck = createIcon('IconCheck', <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />)

/** 关闭 */
export const IconClose = createIcon('IconClose', <path d="M6 6l12 12M18 6 6 18" />)

/** 下拉箭头 */
export const IconChevronDown = createIcon('IconChevronDown', <path d="M6 9.5l6 6 6-6" />)

/** 上箭头 */
export const IconChevronUp = createIcon('IconChevronUp', <path d="M6 14.5l6-6 6 6" />)

/** 右箭头 */
export const IconChevronRight = createIcon('IconChevronRight', <path d="M9.5 6l6 6-6 6" />)

/** 左箭头 */
export const IconChevronLeft = createIcon('IconChevronLeft', <path d="M14.5 6l-6 6 6 6" />)

/** 加号 */
export const IconPlus = createIcon('IconPlus', <path d="M12 5v14M5 12h14" />)

/** 减号 */
export const IconMinus = createIcon('IconMinus', <path d="M5 12h14" />)

/** 搜索 */
export const IconSearch = createIcon(
  'IconSearch',
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 20 20" />
  </>,
)

/** 信息 */
export const IconInfo = createIcon(
  'IconInfo',
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11.2v5" />
    <path d="M12 7.8h.01" />
  </>,
)

/** 成功 */
export const IconSuccess = createIcon(
  'IconSuccess',
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.2 12.3l2.6 2.6 5-5.2" />
  </>,
)

/** 警告 */
export const IconWarning = createIcon(
  'IconWarning',
  <>
    <path d="M12 4.2 21 19.8H3z" />
    <path d="M12 9.6v4.3" />
    <path d="M12 17.3h.01" />
  </>,
)

/** 错误 */
export const IconError = createIcon(
  'IconError',
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" />
  </>,
)

/** 加载中（配合 aelux-spin 类使用） */
export const IconLoader = createIcon(
  'IconLoader',
  <>
    <path d="M12 3.5v3" />
    <path d="M12 17.5v3" />
    <path d="M3.5 12h3" />
    <path d="M17.5 12h3" />
    <path d="M6 6l2.1 2.1" />
    <path d="M15.9 15.9 18 18" />
    <path d="M18 6l-2.1 2.1" />
    <path d="M8.1 15.9 6 18" />
  </>,
)

/** 文件夹 */
export const IconFolder = createIcon(
  'IconFolder',
  <path d="M3.5 7.2A2.2 2.2 0 0 1 5.7 5h3.1c.6 0 1.1.2 1.5.6l1.5 1.7c.4.4.9.6 1.5.6h5A2.2 2.2 0 0 1 20.5 10v7.3a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2z" />,
)

/** 下载 */
export const IconDownload = createIcon(
  'IconDownload',
  <>
    <path d="M12 3.5v10.8" />
    <path d="M7.5 10.2 12 14.7l4.5-4.5" />
    <path d="M4.5 19.5h15" />
  </>,
)

/** 设置 */
export const IconSettings = createIcon(
  'IconSettings',
  <>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M19.2 14.6a1.6 1.6 0 0 0 .32 1.76l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.76-.32 1.6 1.6 0 0 0-.97 1.47V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.46 1.6 1.6 0 0 0-1.76.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.76 1.6 1.6 0 0 0-1.47-.97H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.46-1.05 1.6 1.6 0 0 0-.32-1.76l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.76.32h.08a1.6 1.6 0 0 0 .97-1.47V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 .97 1.46 1.6 1.6 0 0 0 1.76-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.76v.08a1.6 1.6 0 0 0 1.47.97H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.46.97z" />
  </>,
)

/** 用户 */
export const IconUser = createIcon(
  'IconUser',
  <>
    <circle cx="12" cy="8.2" r="3.6" />
    <path d="M5 20c1.4-3.3 4-4.7 7-4.7s5.6 1.4 7 4.7" />
  </>,
)

/** 太阳（浅色主题） */
export const IconSun = createIcon(
  'IconSun',
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4" />
  </>,
)

/** 月亮（深色主题） */
export const IconMoon = createIcon(
  'IconMoon',
  <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a6.9 6.9 0 0 0 11.1 11.1z" />,
)

/** 外部链接 */
export const IconExternal = createIcon(
  'IconExternal',
  <>
    <path d="M13.5 4H20v6.5" />
    <path d="M20 4l-8.5 8.5" />
    <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </>,
)

/** 删除 */
export const IconTrash = createIcon(
  'IconTrash',
  <>
    <path d="M4 7h16" />
    <path d="M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
    <path d="M6.5 7l.9 12.2a1.4 1.4 0 0 0 1.4 1.3h6.4a1.4 1.4 0 0 0 1.4-1.3L17.5 7" />
    <path d="M10.2 11v5M13.8 11v5" />
  </>,
)

/** 更多操作 */
export const IconMore = createIcon(
  'IconMore',
  <>
    <circle cx="5.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="18.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </>,
)

/** 复制 */
export const IconCopy = createIcon(
  'IconCopy',
  <>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2.2" />
    <path d="M15.5 8.5V6.2A1.7 1.7 0 0 0 13.8 4.5H6.2A1.7 1.7 0 0 0 4.5 6.2v7.6a1.7 1.7 0 0 0 1.7 1.7h2.3" />
  </>,
)

/** 播放 */
export const IconPlay = createIcon('IconPlay', <path d="M8 5.5l11 6.5-11 6.5z" />)

/** 刷新 */
export const IconRefresh = createIcon(
  'IconRefresh',
  <>
    <path d="M20 11.5a8 8 0 0 0-13.7-5.2L4 8.5" />
    <path d="M4 4v4.5h4.5" />
    <path d="M4 12.5a8 8 0 0 0 13.7 5.2L20 15.5" />
    <path d="M20 20v-4.5h-4.5" />
  </>,
)

/** 收藏 */
export const IconStar = createIcon(
  'IconStar',
  <path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8z" />,
)

/** 四宫格（总览） */
export const IconGrid = createIcon(
  'IconGrid',
  <>
    <rect x="4" y="4" width="7" height="7" rx="1.6" />
    <rect x="13" y="4" width="7" height="7" rx="1.6" />
    <rect x="4" y="13" width="7" height="7" rx="1.6" />
    <rect x="13" y="13" width="7" height="7" rx="1.6" />
  </>,
)

/** 菜单（汉堡） */
export const IconMenu = createIcon('IconMenu', <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />)

/** 编辑（表单） */
export const IconEdit = createIcon(
  'IconEdit',
  <>
    <path d="M15.5 5.5l3 3L8 19H5v-3z" />
    <path d="M13.5 7.5l3 3" />
  </>,
)

/** 通知（反馈） */
export const IconBell = createIcon(
  'IconBell',
  <>
    <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
    <path d="M10.5 19.5a1.8 1.8 0 0 0 3 0" />
  </>,
)

/** 布局（展示） */
export const IconLayout = createIcon(
  'IconLayout',
  <>
    <rect x="3.5" y="4.5" width="17" height="6" rx="1.8" />
    <rect x="3.5" y="13.5" width="8" height="6" rx="1.8" />
    <rect x="13.5" y="13.5" width="7" height="6" rx="1.8" />
  </>,
)

/** 代码 */
export const IconCode = createIcon(
  'IconCode',
  <>
    <path d="M8.5 7.5 3.5 12l5 4.5" />
    <path d="M15.5 7.5l5 4.5-5 4.5" />
  </>,
)

/** 包（安装） */
export const IconPackage = createIcon(
  'IconPackage',
  <>
    <path d="M12 3.5 20.5 8v8L12 20.5 3.5 16V8z" />
    <path d="M3.5 8 12 12.5 20.5 8" />
    <path d="M12 12.5V20.5" />
  </>,
)

/** 眼睛 */
export const IconEye = createIcon(
  'IconEye',
  <>
    <path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
)
