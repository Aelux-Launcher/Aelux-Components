/**
 * Aelux Components —— 公共 API 入口
 *
 * 使用方式：
 *   import { Button, Input, Card } from 'aelux-components'
 *   import 'aelux-components/style.css'
 */
import './styles/index.css'

/* ------------------------------------------------------------------- 组件 */
export { Button } from './components/Button'
export type { ButtonProps, ButtonSize, ButtonVariant } from './components/Button'

export { IconButton } from './components/IconButton'
export type { IconButtonProps } from './components/IconButton'

export { Input } from './components/Input'
export type { InputProps, InputSize, InputStatus } from './components/Input'

export { Textarea } from './components/Textarea'
export type { TextareaProps } from './components/Textarea'

export { Select } from './components/Select'
export type { SelectOption, SelectProps } from './components/Select'

export { Checkbox } from './components/Checkbox'
export type { CheckboxProps } from './components/Checkbox'

export { Radio } from './components/Radio'
export type { RadioProps } from './components/Radio'
export { RadioGroup } from './components/Radio'
export type { RadioGroupProps, RadioOption } from './components/Radio'

export { Switch } from './components/Switch'
export type { SwitchProps } from './components/Switch'

export { Slider } from './components/Slider'
export type { SliderProps } from './components/Slider'

export { FormItem } from './components/FormItem'
export type { FormItemProps } from './components/FormItem'

export { Alert } from './components/Alert'
export type { AlertProps, AlertType } from './components/Alert'

export { Modal } from './components/Modal'
export type { ModalProps } from './components/Modal'

export { toast } from './components/Toast'
export type { ToastApi, ToastOptions, ToastType } from './components/Toast'

export { Tooltip } from './components/Tooltip'
export type { TooltipProps } from './components/Tooltip'

export { Spinner } from './components/Spinner'
export type { SpinnerProps } from './components/Spinner'

export { Progress } from './components/Progress'
export type { ProgressProps } from './components/Progress'

export { Empty } from './components/Empty'
export type { EmptyProps } from './components/Empty'

export { Card } from './components/Card'
export type { CardProps } from './components/Card'

export { Tag } from './components/Tag'
export type { TagColor, TagProps } from './components/Tag'

export { Badge } from './components/Badge'
export type { BadgeProps } from './components/Badge'

export { Avatar } from './components/Avatar'
export type { AvatarProps } from './components/Avatar'

export { Tabs } from './components/Tabs'
export type { TabItem, TabsProps } from './components/Tabs'

export { Divider } from './components/Divider'
export type { DividerProps } from './components/Divider'

export { Space } from './components/Space'
export type { SpaceProps } from './components/Space'

export { Skeleton } from './components/Skeleton'
export type { SkeletonProps } from './components/Skeleton'

/* -------------------------------------------------------- 表单 / 输入增强 */
export { SearchInput } from './components/SearchInput'
export type { SearchInputProps } from './components/SearchInput'

export { InputNumber } from './components/InputNumber'
export type { InputNumberProps } from './components/InputNumber'

export { Combobox } from './components/Combobox'
export type { ComboboxOption, ComboboxProps } from './components/Combobox'

export { SegmentedControl } from './components/SegmentedControl'
export type { SegmentedControlProps, SegmentedOption } from './components/SegmentedControl'

export { Stepper } from './components/Stepper'
export type { StepItem, StepperProps } from './components/Stepper'

export { DropZone } from './components/DropZone'
export type { DropZoneProps } from './components/DropZone'

export { Kbd } from './components/Kbd'
export type { KbdProps } from './components/Kbd'

/* -------------------------------------------------------- 浮层 / 反馈增强 */
export { Dialog } from './components/Dialog'
export type { DialogProps } from './components/Dialog'

export { Drawer } from './components/Drawer'
export type { DrawerProps } from './components/Drawer'

export { Popover } from './components/Popover'
export type { PopoverPlacement, PopoverProps } from './components/Popover'

export { DropdownMenu } from './components/DropdownMenu'
export type {
  DropdownItem,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuProps,
  DropdownMenuSeparator,
} from './components/DropdownMenu'

export { ProgressRing } from './components/ProgressRing'
export type { ProgressRingProps } from './components/ProgressRing'

/* ---------------------------------------------------- 导航 / 布局 / 数据 */
export { SidebarNav } from './components/SidebarNav'
export type { SidebarNavGroup, SidebarNavItem, SidebarNavProps } from './components/SidebarNav'

export { TitleBar } from './components/TitleBar'
export type { TitleBarProps } from './components/TitleBar'

export { Toolbar } from './components/Toolbar'
export type { ToolbarProps } from './components/Toolbar'

export { Accordion } from './components/Accordion'
export type { AccordionItem, AccordionProps } from './components/Accordion'

export { Pagination } from './components/Pagination'
export type { PaginationProps } from './components/Pagination'

export { ListBox } from './components/ListBox'
export type { ListBoxOption, ListBoxProps } from './components/ListBox'

export { Table } from './components/Table'
export type { TableColumn, TableProps } from './components/Table'

export { DescriptionList } from './components/DescriptionList'
export type { DescriptionItem, DescriptionListProps } from './components/DescriptionList'

export { Statistic } from './components/Statistic'
export type { StatisticProps } from './components/Statistic'

export { SettingSection, SettingRow } from './components/Setting'
export type { SettingRowProps, SettingSectionProps } from './components/Setting'

/* ------------------------------------------------------------------- 图标 */
export { Icon } from './icons'
export type { IconProps } from './icons'
export {
  IconBell,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconClose,
  IconCode,
  IconCopy,
  IconDownload,
  IconEdit,
  IconError,
  IconExternal,
  IconEye,
  IconFolder,
  IconGrid,
  IconInfo,
  IconLayout,
  IconLoader,
  IconMinus,
  IconMoon,
  IconMore,
  IconPackage,
  IconPlay,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconStar,
  IconSuccess,
  IconSun,
  IconTrash,
  IconUser,
  IconWarning,
} from './icons'

/* ------------------------------------------------------------------- 工具 */
export { cx } from './utils/cx'
export type { ClassValue } from './utils/cx'
export { composeRefs } from './utils/composeRefs'
