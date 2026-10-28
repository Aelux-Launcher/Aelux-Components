import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Empty,
  IconFolder,
  IconRefresh,
  IconSearch,
  IconUser,
  Progress,
  ProgressRing,
  Skeleton,
  Spinner,
  toast,
} from 'aelux-components'
import { ShowcaseBlock } from '../components/ShowcaseBlock'
import type { SectionProps } from './types'

/**
 * 反馈类组件演示：Alert / Toast / Spinner / Progress / ProgressRing / Skeleton / Empty
 */
export function FeedbackSection(_props: SectionProps) {
  const [alertClosed, setAlertClosed] = useState(false)
  const [progress, setProgress] = useState(42)
  const [skeletonLoading, setSkeletonLoading] = useState(true)
  const loadingToastTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (loadingToastTimer.current !== null) {
        window.clearTimeout(loadingToastTimer.current)
      }
    },
    [],
  )

  const showLoadingToast = () => {
    if (loadingToastTimer.current !== null) {
      window.clearTimeout(loadingToastTimer.current)
    }
    const id = toast.loading('正在同步组件目录…', {
      description: 'loading 类型不会自动消失，3 秒后这里手动关闭它',
      position: 'bottom-right',
      closable: true,
    })
    loadingToastTimer.current = window.setTimeout(() => {
      toast.dismiss(id)
      loadingToastTimer.current = null
    }, 3000)
  }

  return (
    <>
      <ShowcaseBlock
        title="Alert 提示"
        anchor="Alert"
        description="4 种语义类型，软色调背景 + 左侧图标，支持关闭按钮与自定义内容。"
        code={`<Alert type="success" title="保存成功" description="配置已同步到本地。" />`}
        column
      >
        <div className="demo-stack">
          <Alert type="info" title="版本更新" description="Aelux Components v0.2 已发布，新增 6 个反馈组件。" />
          <Alert type="success" title="保存成功" description="你的配置已同步到本地，刷新页面后仍然生效。" />
          <Alert type="warning" title="注意" description="当前项目有 2 个组件尚未通过视觉验收，请先确认设计走查。" />
          <Alert type="error" title="连接失败" description="无法连接到本地服务，请确认服务已启动后重试。" />
        </div>

        <div className="demo-label">closable —— 关闭后由外部状态控制重新显示</div>
        {alertClosed ? (
          <div className="demo-row">
            <Button variant="secondary" size="sm" onClick={() => setAlertClosed(false)}>
              重新显示可关闭的 Alert
            </Button>
          </div>
        ) : (
          <Alert
            type="info"
            title="可关闭提示"
            description="点击右侧关闭按钮收起本条提示，onClose 会同步触发。"
            closable
            onClose={() => setAlertClosed(true)}
          />
        )}

        <div className="demo-label">showIcon={'{false}'} 与自定义 children</div>
        <Alert type="warning" showIcon={false} title="不支持拖拽排序">
          请使用列表右侧的上下箭头调整顺序，排序结果会自动保存。
        </Alert>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Toast 轻提示"
        anchor="Toast"
        description="命令式调用，单例容器惰性挂载到 body；支持描述、位置、手动关闭与 loading 常驻。"
        code={`toast.success('保存成功', { description: '配置已同步到本地', duration: 3200 })`}
        column
      >
        <div className="demo-row">
          <Button
            variant="success"
            size="sm"
            onClick={() => toast.success('保存成功', { description: '配置已同步到本地。' })}
          >
            成功
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => toast.error('请求失败', { description: '接口返回 500，请稍后重试。' })}
          >
            错误
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={() => toast.warning('磁盘空间不足', { description: '剩余空间低于 10%。' })}
          >
            警告
          </Button>
          <Button variant="secondary" size="sm" onClick={() => toast.info('已复制到剪贴板')}>
            信息
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast.loading('正在加载组件…')}>
            Loading
          </Button>
        </div>

        <div className="demo-label">带描述、指定位置与清理</div>
        <div className="demo-row">
          <Button variant="secondary" size="sm" onClick={showLoadingToast}>
            Loading + 描述（3s 后关闭）
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.info('底部居中提示', {
                position: 'bottom-center',
                description: 'position 支持 top-right / top-center / bottom-right / bottom-center。',
              })
            }
          >
            底部居中
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast.clear()}>
            关闭全部
          </Button>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Spinner 加载指示器"
        anchor="Spinner"
        description="纯 CSS 转圈动画，3 种尺寸；label 提供屏幕阅读器文案。"
        code={`<Spinner size="md" label="加载中" />`}
        column
      >
        <div className="demo-grid">
          <div className="demo-surface demo-row">
            <Spinner size="sm" />
            <span>sm</span>
          </div>
          <div className="demo-surface demo-row">
            <Spinner size="md" />
            <span>md</span>
          </div>
          <div className="demo-surface demo-row">
            <Spinner size="lg" />
            <span>lg</span>
          </div>
        </div>
        <div className="demo-row">
          <Button loading>按钮加载态</Button>
          <Button variant="secondary" loading>
            同步中…
          </Button>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Progress 进度条"
        anchor="Progress"
        description="确定 / 不确定进度，平滑宽度过渡，支持语义颜色与百分比文案。"
        code={`<Progress value={42} showLabel />`}
        column
      >
        <div className="demo-stack">
          <Progress value={progress} showLabel />
          <Progress value={progress} size="sm" showLabel />
          <Progress indeterminate />
        </div>
        <div className="demo-label">点击切换进度值（含 100%）</div>
        <div className="demo-row">
          <Button variant="secondary" size="sm" onClick={() => setProgress(0)}>
            0%
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setProgress(28)}>
            28%
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setProgress(64)}>
            64%
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setProgress(100)}>
            100%
          </Button>
        </div>
        <div className="demo-label">语义变体：success / warning / danger</div>
        <div className="demo-stack">
          <Progress value={100} variant="success" showLabel />
          <Progress value={72} variant="warning" showLabel />
          <Progress value={45} variant="danger" showLabel />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="ProgressRing 圆环进度"
        anchor="ProgressRing"
        description="纯 SVG stroke-dasharray 实现，确定 / 不确定两种状态，支持尺寸、线宽与语义色调。"
        code={`<ProgressRing value={42} showValue label="同步进度" />`}
        column
      >
        <div className="demo-grid">
          <div className="demo-surface demo-stack">
            <div className="demo-label">确定进度 + 百分比</div>
            <ProgressRing value={progress} showValue label="组件同步进度" />
          </div>
          <div className="demo-surface demo-stack">
            <div className="demo-label">不确定进度</div>
            <ProgressRing indeterminate label="正在校验组件" />
          </div>
          <div className="demo-surface demo-stack">
            <div className="demo-label">自定义线宽 10 / 尺寸 96</div>
            <ProgressRing value={68} size={96} thickness={10} showValue />
          </div>
        </div>

        <div className="demo-label">尺寸对比（48 / 64 / 96）</div>
        <div className="demo-row">
          <ProgressRing value={progress} size={48} thickness={4} showValue />
          <ProgressRing value={progress} size={64} showValue />
          <ProgressRing value={progress} size={96} thickness={8} showValue />
        </div>

        <div className="demo-label">语义色调：primary / success / warning / danger</div>
        <div className="demo-row">
          <ProgressRing value={100} tone="success" showValue label="完成" />
          <ProgressRing value={72} tone="warning" showValue label="待确认" />
          <ProgressRing value={45} tone="danger" showValue label="失败" />
        </div>

        <div className="demo-label">与上方 Progress 共用进度值，点击切换会同步更新</div>
        <div className="demo-row">
          <Button variant="secondary" size="sm" onClick={() => setProgress(0)}>
            0%
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setProgress(28)}>
            28%
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setProgress(64)}>
            64%
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setProgress(100)}>
            100%
          </Button>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Skeleton 骨架屏"
        anchor="Skeleton"
        description="文本、头像与卡片占位；loading 结束后平滑渲染真实内容。"
        code={`<Skeleton loading={loading} lines={3} height={14}>{content}</Skeleton>`}
        column
      >
        <div className="demo-row">
          <Button
            variant={skeletonLoading ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={<IconRefresh size={14} />}
            onClick={() => setSkeletonLoading((value) => !value)}
          >
            {skeletonLoading ? '完成加载' : '重新加载'}
          </Button>
        </div>

        <div className="demo-grid">
          <div className="demo-surface demo-stack">
            <div className="demo-label">文本</div>
            <Skeleton loading={skeletonLoading} lines={3} height={14}>
              <div className="demo-stack">
                <span>构建 Aelux Launcher 的通用组件库，覆盖表单、反馈、数据展示与布局。</span>
                <span>零运行时依赖，仅以 react / react-dom 作为 peer 依赖。</span>
                <span>冰蓝设计语言，自动适配浅色与深色主题。</span>
              </div>
            </Skeleton>
          </div>

          <div className="demo-surface demo-stack">
            <div className="demo-label">头像 + 文本</div>
            <div className="demo-row">
              <Skeleton loading={skeletonLoading} circle width={40} height={40}>
                <IconUser size={36} />
              </Skeleton>
              <Skeleton loading={skeletonLoading} width={150} height={12}>
                <span>Aelux 前端工程师</span>
              </Skeleton>
            </div>
          </div>

          <div className="demo-surface demo-stack">
            <div className="demo-label">卡片</div>
            <Skeleton loading={skeletonLoading} width="100%" height={12} lines={2}>
              <div className="demo-stack">
                <span>发布清单</span>
                <span>集成展示站外壳与全部组件示例。</span>
              </div>
            </Skeleton>
          </div>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Empty 空状态"
        anchor="Empty"
        description="内置轻量内联 SVG 插画，支持自定义图标、描述与操作区。"
        code={`<Empty title="暂无数据" description="创建第一条记录开始。" action={<Button>新建</Button>} />`}
        column
      >
        <div className="demo-grid">
          <div className="demo-surface">
            <Empty title="暂无数据" description="创建第一个项目开始协作。" />
          </div>
          <div className="demo-surface">
            <Empty
              size="sm"
              icon={<IconFolder size={44} />}
              title="文件夹为空"
              description="把组件源码拖进来，或从模板新建一个文件夹。"
            />
          </div>
          <div className="demo-surface">
            <Empty
              icon={<IconSearch size={44} />}
              title="没有搜索结果"
              description="试试更换关键词，或重置筛选条件。"
              action={
                <Button variant="secondary" size="sm" onClick={() => toast.info('已重置筛选条件')}>
                  重置筛选
                </Button>
              }
            />
          </div>
        </div>
      </ShowcaseBlock>
    </>
  )
}
