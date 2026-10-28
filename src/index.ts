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
