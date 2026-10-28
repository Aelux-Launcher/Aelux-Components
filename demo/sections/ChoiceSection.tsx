import { useId, useState } from 'react'
import {
  Checkbox,
  IconGrid,
  IconLayout,
  RadioGroup,
  SegmentedControl,
  Slider,
  Stepper,
  Switch,
} from 'aelux-components'
import type { StepItem } from 'aelux-components'
import type { SectionProps } from './types'
import { ShowcaseBlock } from '../components/ShowcaseBlock'

const UPDATE_OPTIONS = [
  { value: 'auto', label: '自动检查更新', description: '启动时检查一次启动器新版本' },
  { value: 'beta', label: '接收预览版本', description: '提前体验新功能，可能不稳定' },
  { value: 'crash', label: '发送崩溃报告', description: '仅包含匿名诊断信息' },
]

const PERF_OPTIONS = [
  { value: 'balanced', label: '均衡模式', description: '性能与功耗的折中方案' },
  { value: 'performance', label: '性能优先', description: '优先保证动画与响应速度' },
  { value: 'saver', label: '省电优先', description: '降低动效与后台刷新频率' },
]

const JAVA_OPTIONS = [
  { value: 'bundled', label: '使用启动器内置 Java', description: '开箱即用，无需额外配置' },
  { value: 'system', label: '使用系统 Java', description: '自动探测已安装的 JDK' },
  { value: 'custom', label: '自定义路径', description: '需要手动选择 java.exe' },
]

const SEGMENT_OPTIONS = [
  { value: 'grid', label: '网格', icon: <IconGrid size={14} /> },
  { value: 'list', label: '列表', icon: <IconLayout size={14} /> },
]

const INSTALL_STEPS: StepItem[] = [
  { key: 'version', title: '选择版本', description: '1.21 · Fabric' },
  { key: 'memory', title: '分配内存', description: '4096 MB' },
  { key: 'mods', title: '安装整合包', description: '12 个模组待下载' },
  { key: 'done', title: '完成', description: '可以开始游戏了' },
]

const RADIO_CODE = `<RadioGroup
  options={options}
  value={mode}
  onChange={setMode}
  name="perf-mode"
  ariaLabel="性能模式"
/>`

const SEGMENT_CODE = `<SegmentedControl
  options={SEGMENT_OPTIONS}
  value={view}
  onValueChange={setView}
  ariaLabel="实例视图"
/>`

const STEPPER_CODE = `<Stepper steps={INSTALL_STEPS} current={step} clickable onStepChange={setStep} />`

/** 开关与滑块示例页：Checkbox / RadioGroup / Switch / Slider / SegmentedControl / Stepper。 */
export function ChoiceSection(_props: SectionProps) {
  const groupId = useId()
  const [selected, setSelected] = useState<string[]>(['auto', 'crash'])
  const [perf, setPerf] = useState('balanced')
  const [javaSource, setJavaSource] = useState('bundled')
  const [autoCheck, setAutoCheck] = useState(true)
  const [volume, setVolume] = useState(40)
  const [memory, setMemory] = useState(4096)
  const [view, setView] = useState('grid')
  const [installStep, setInstallStep] = useState(1)

  const allSelected = selected.length === UPDATE_OPTIONS.length

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  return (
    <>
      <ShowcaseBlock
        title="Checkbox 复选框"
        description="原生 checkbox + 自定义勾选框，支持 label、description、半选态（indeterminate）与 sm 尺寸。"
        anchor="Checkbox"
        column
      >
        <div className="demo-row">
          <Checkbox label="自动检查更新" defaultChecked />
          <Checkbox label="发送使用统计" description="仅包含匿名数据" />
          <Checkbox label="小尺寸" size="sm" />
          <Checkbox label="半选态" indeterminate />
          <Checkbox label="禁用" disabled defaultChecked />
        </div>
        <div className="demo-row">
          <Checkbox
            label="全选"
            checked={allSelected}
            indeterminate={!allSelected && selected.length > 0}
            onChange={() =>
              setSelected(allSelected ? [] : UPDATE_OPTIONS.map((option) => option.value))
            }
          />
          {UPDATE_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              description={option.description}
              checked={selected.includes(option.value)}
              onChange={() => toggleOption(option.value)}
            />
          ))}
        </div>
        <p className="demo-label">
          已选 {selected.length} / {UPDATE_OPTIONS.length} 项（点击「全选」观察半选态）
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Radio 单选组"
        description="RadioGroup 统一管理 name 与受控值；支持横向 / 纵向排列、自定义 gap、禁用项与整组禁用。"
        code={RADIO_CODE}
        anchor="Radio"
        column
      >
        <RadioGroup
          options={PERF_OPTIONS}
          value={perf}
          onChange={setPerf}
          name={`${groupId}-perf`}
          ariaLabel="性能模式"
        />
        <RadioGroup
          options={PERF_OPTIONS}
          defaultValue="saver"
          direction="vertical"
          gap={14}
          name={`${groupId}-perf-2`}
          ariaLabel="性能模式（纵向）"
        />
        <RadioGroup
          options={JAVA_OPTIONS}
          value={javaSource}
          onChange={setJavaSource}
          name={`${groupId}-java`}
          ariaLabel="Java 来源"
        />
        <RadioGroup
          options={[
            { value: 'auto', label: '自动选择' },
            { value: 'manual', label: '手动指定（暂无权限）', disabled: true },
          ]}
          defaultValue="auto"
          name={`${groupId}-mode-3`}
          ariaLabel="选项禁用"
        />
        <RadioGroup
          options={PERF_OPTIONS}
          defaultValue="balanced"
          disabled
          name={`${groupId}-mode-4`}
          ariaLabel="整组禁用"
        />
        <p className="demo-label">
          当前模式：{PERF_OPTIONS.find((option) => option.value === perf)?.label ?? '（未选择）'} · Java：
          {JAVA_OPTIONS.find((option) => option.value === javaSource)?.label ?? '（未选择）'}
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Switch 开关"
        description="role=switch 的原生 button，Space / Enter 均可切换；onChange 直接返回布尔值，支持描述文字与禁用态。"
        anchor="Switch"
        column
      >
        <div className="demo-row">
          <Switch checked={autoCheck} onChange={setAutoCheck} label="后台检查更新" />
          <Switch
            defaultChecked
            label="启动时自动登录"
            description="使用上次的配置继续"
          />
          <Switch size="sm" defaultChecked label="小尺寸开关" />
          <Switch disabled label="禁用（关闭）" />
          <Switch defaultChecked disabled label="禁用（开启）" />
        </div>
        <p className="demo-label">
          后台检查更新：{autoCheck ? '已开启' : '已关闭'}（可点击或聚焦后按空格）
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Slider 滑动输入"
        description="原生 range 保留键盘方向键操作，轨道与滑块由 CSS 重绘；showValue 在右侧显示当前值。"
        anchor="Slider"
        column
      >
        <div className="demo-row">
          <Slider value={volume} onChange={setVolume} showValue />
          <Slider defaultValue={30} size="sm" showValue />
          <Slider min={0} max={10} step={2} defaultValue={4} showValue />
          <Slider defaultValue={60} disabled showValue />
        </div>
        <Slider
          value={memory}
          onChange={setMemory}
          min={0}
          max={32768}
          step={512}
          showValue
          style={{ width: '100%' }}
          aria-label="分配内存（MB）"
        />
        <p className="demo-label">分配内存：{memory} MB（拖动滑块或聚焦后按方向键）</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="SegmentedControl 分段控制"
        description="role=radiogroup + role=radio，← → / Home / End 键盘切换；适合实例视图、启动策略等少量互斥选项。"
        code={SEGMENT_CODE}
        anchor="SegmentedControl"
        column
      >
        <div className="demo-row">
          <SegmentedControl
            options={SEGMENT_OPTIONS}
            value={view}
            onValueChange={setView}
            ariaLabel="实例视图"
          />
          <SegmentedControl
            options={[
              { value: 'stable', label: '稳定版' },
              { value: 'beta', label: '公测版' },
              { value: 'nightly', label: '每日构建', disabled: true },
            ]}
            defaultValue="stable"
            size="sm"
            ariaLabel="更新通道"
          />
          <SegmentedControl
            options={[
              { value: 'java8', label: 'Java 8' },
              { value: 'java17', label: 'Java 17' },
              { value: 'java21', label: 'Java 21' },
            ]}
            defaultValue="java17"
            disabled
            ariaLabel="禁用状态"
          />
        </div>
        <SegmentedControl
          options={SEGMENT_OPTIONS}
          defaultValue="list"
          block
          ariaLabel="block：实例视图"
        />
        <p className="demo-label">当前视图：{view === 'grid' ? '网格' : '列表'}（可用方向键切换）</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Stepper 步骤条"
        description="横向步骤条，完成步骤显示对勾、当前步骤高亮；clickable 时点击步骤触发 onStepChange，aria-current 标记当前步。"
        code={STEPPER_CODE}
        anchor="Stepper"
        column
      >
        <Stepper steps={INSTALL_STEPS} current={installStep} />
        <Stepper steps={INSTALL_STEPS} current={installStep} clickable onStepChange={setInstallStep} />
        <Stepper
          steps={[
            { key: 'login', title: '登录账号' },
            { key: 'verify', title: '验证身份', disabled: true },
            { key: 'done', title: '完成' },
          ]}
          current={0}
          clickable
          onStepChange={setInstallStep}
          ariaLabel="禁用步骤示例"
        />
        <p className="demo-label">
          当前步骤：第 {installStep + 1} 步 · {INSTALL_STEPS[installStep]?.title}（点击上方步骤条切换）
        </p>
      </ShowcaseBlock>
    </>
  )
}
