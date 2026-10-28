import { createElement } from 'react'
import {
  IconBell,
  IconEdit,
  IconEye,
  IconFolder,
  IconGrid,
  IconLayout,
  IconPlay,
  IconSun,
} from 'aelux-components'
import type { NavSection } from './types'
import { OverviewSection } from './OverviewSection'
import { BasicSection } from './BasicSection'
import { FormSection } from './FormSection'
import { FeedbackSection } from './FeedbackSection'
import { OverlaySection } from './OverlaySection'
import { DataDisplaySection } from './DataDisplaySection'
import { LayoutSection } from './LayoutSection'
import { ThemeSection } from './ThemeSection'

const icon = (component: typeof IconGrid) => createElement(component, { size: 15 })

/**
 * 展示站的全部页面（顺序即侧边栏与翻页顺序）。
 * 注意：group 字段决定侧边栏分组标题。
 */
export const navSections: NavSection[] = [
  {
    id: 'overview',
    title: '总览',
    description: 'Aelux Components 的定位、安装方式、设计原则与全部组件索引。',
    group: '开始',
    icon: icon(IconGrid),
    component: OverviewSection,
  },
  {
    id: 'basic',
    title: '基础组件',
    description: '按钮与图标按钮 —— 所有交互的起点，强调层级、变体与加载状态。',
    group: '组件',
    icon: icon(IconPlay),
    components: ['Button', 'IconButton'],
    component: BasicSection,
  },
  {
    id: 'form',
    title: '表单组件',
    description: '输入、选择、勾选、开关、滑块与表单布局，覆盖启动器中的各类设置场景。',
    group: '组件',
    icon: icon(IconEdit),
    components: ['Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Switch', 'Slider', 'FormItem'],
    component: FormSection,
  },
  {
    id: 'feedback',
    title: '反馈组件',
    description: '提示、进度、加载与空状态，用于把系统状态清楚地告诉用户。',
    group: '反馈',
    icon: icon(IconBell),
    components: ['Alert', 'Toast', 'Spinner', 'Progress', 'Skeleton', 'Empty'],
    component: FeedbackSection,
  },
  {
    id: 'overlay',
    title: '浮层组件',
    description: '模态框与气泡提示，处理打断式操作与轻量补充说明。',
    group: '反馈',
    icon: icon(IconEye),
    components: ['Modal', 'Tooltip'],
    component: OverlaySection,
  },
  {
    id: 'data-display',
    title: '数据展示',
    description: '卡片、标签、徽标与头像 —— 启动器列表与详情页的主要信息载体。',
    group: '展示',
    icon: icon(IconFolder),
    components: ['Card', 'Tag', 'Badge', 'Avatar'],
    component: DataDisplaySection,
  },
  {
    id: 'layout',
    title: '导航与布局',
    description: '标签页、分割线与间距容器，为页面搭建提供基础骨架。',
    group: '展示',
    icon: icon(IconLayout),
    components: ['Tabs', 'Divider', 'Space'],
    component: LayoutSection,
  },
  {
    id: 'theme',
    title: '设计变量',
    description: '冰蓝主题的色板、字号、圆角、阴影与亮暗主题约定。',
    group: '设计',
    icon: icon(IconSun),
    components: ['Design Tokens', 'Dark Mode'],
    component: ThemeSection,
  },
]
