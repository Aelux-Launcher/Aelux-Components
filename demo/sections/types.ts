import type { ReactNode } from 'react'

export type DemoTheme = 'light' | 'dark'

/** 每个展示页收到的统一 props */
export interface SectionProps {
  /** 当前主题（部分示例需要感知主题） */
  theme: DemoTheme
  /** 页内跳转到其他展示页（可选定位到具体组件的示例块） */
  onNavigate?: (sectionId: string, anchor?: string) => void
}

/** 侧边栏 / 路由用的页面声明 */
export interface NavSection {
  id: string
  title: string
  /** 一句话说明，显示在页面标题下方 */
  description: string
  /** 侧边栏分组名 */
  group: string
  /** 侧边栏图标 */
  icon: ReactNode
  /** 该页覆盖的组件名（显示为标题右侧的小标签） */
  components?: string[]
  component: (props: SectionProps) => ReactNode
}
