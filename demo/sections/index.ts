import { createElement } from 'react'
import {
  IconBell,
  IconCheck,
  IconEdit,
  IconEye,
  IconFolder,
  IconGrid,
  IconLayout,
  IconPackage,
  IconPlay,
  IconSun,
} from 'aelux-components'
import type { NavSection } from './types'
import { OverviewSection } from './OverviewSection'
import { BasicSection } from './BasicSection'
import { FormSection } from './FormSection'
import { ChoiceSection } from './ChoiceSection'
import { FeedbackSection } from './FeedbackSection'
import { OverlaySection } from './OverlaySection'
import { DataDisplaySection } from './DataDisplaySection'
import { LayoutSection } from './LayoutSection'
import { PatternsSection } from './PatternsSection'
import { ThemeSection } from './ThemeSection'

const icon = (component: typeof IconGrid) => createElement(component, { size: 15 })

/**
 * 展示站的全部页面（顺序即侧边栏与翻页顺序）。
 * group 决定侧边栏一级分组，components 决定页面下的二级导航（点击滚动到对应示例块）。
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
    description: '按钮、图标按钮与键盘按键 —— 所有交互的起点，强调层级、变体与加载状态。',
    group: '组件',
    icon: icon(IconPlay),
    components: ['Button', 'IconButton', 'Kbd', 'ButtonGroup', 'SplitButton'],
    component: BasicSection,
  },
  {
    id: 'form',
    title: '输入与选择',
    description: '文本框、搜索框、数字输入、下拉组合框与拖拽导入，覆盖启动器的各类设置与安装场景。',
    group: '组件',
    icon: icon(IconEdit),
    components: ['Input', 'Textarea', 'SearchInput', 'InputNumber', 'Select', 'Combobox', 'MultiSelect', 'FilePicker', 'DropZone', 'ColorPicker', 'FormItem'],
    component: FormSection,
  },
  {
    id: 'choice',
    title: '开关与滑块',
    description: '勾选、单选、开关、滑块、分段控制与步骤条 —— 启动器设置项与安装向导的常用控件。',
    group: '组件',
    icon: icon(IconCheck),
    components: ['Checkbox', 'CheckboxCard', 'Radio', 'RadioCard', 'Switch', 'InheritSwitch', 'ToggleCard', 'Slider', 'SegmentedControl', 'Chips', 'Stepper'],
    component: ChoiceSection,
  },
  {
    id: 'feedback',
    title: '反馈组件',
    description: '提示、进度、加载与空状态，用于把系统状态清楚地告诉用户。',
    group: '反馈',
    icon: icon(IconBell),
    components: ['Alert', 'Toast', 'Spinner', 'Progress', 'ProgressRing', 'Skeleton', 'Empty'],
    component: FeedbackSection,
  },
  {
    id: 'overlay',
    title: '浮层组件',
    description: '模态框、对话框、抽屉、气泡、提示与菜单，处理打断式操作与轻量补充说明。',
    group: '反馈',
    icon: icon(IconEye),
    components: ['Modal', 'Dialog', 'PromptDialog', 'ProgressDialog', 'Drawer', 'Popover', 'ContextMenu', 'Tooltip', 'DropdownMenu'],
    component: OverlaySection,
  },
  {
    id: 'data-display',
    title: '数据展示',
    description: '卡片、标签、头像、列表、表格、键值对与统计 —— 启动器列表与详情页的主要信息载体。',
    group: '展示',
    icon: icon(IconFolder),
    components: ['Card', 'Tag', 'Badge', 'Avatar', 'Image', 'ListItem', 'ListBox', 'TaskList', 'Table', 'DescriptionList', 'Statistic', 'Timeline', 'SettingSection'],
    component: DataDisplaySection,
  },
  {
    id: 'layout',
    title: '导航与布局',
    description: '标签页、侧边导航、标题栏、工具栏、折叠面板与分页，为启动器搭建窗口骨架。',
    group: '展示',
    icon: icon(IconLayout),
    components: ['Tabs', 'SidebarNav', 'TitleBar', 'Toolbar', 'FilterBar', 'NotificationPanel', 'PageShell', 'SplitLayout', 'Wizard', 'Breadcrumb', 'Hint', 'StatusBar', 'Accordion', 'Pagination', 'Divider', 'Space'],
    component: LayoutSection,
  },
  {
    id: 'patterns',
    title: '启动器组合',
    description: '把组件拼成启动器真实界面：窗口骨架、实例列表与详情、设置页、任务队列。',
    group: '展示',
    icon: icon(IconPackage),
    components: ['Window', 'Settings', 'Tasks'],
    component: PatternsSection,
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
