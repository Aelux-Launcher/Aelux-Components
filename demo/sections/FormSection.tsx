import { useId, useState } from 'react'
import {
  Checkbox,
  FormItem,
  IconSearch,
  IconUser,
  Input,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
} from 'aelux-components'
import type { SelectOption } from 'aelux-components'
import type { SectionProps } from './types'
import { ShowcaseBlock } from '../components/ShowcaseBlock'

const APP_OPTIONS: SelectOption[] = [
  { value: 'launcher', label: 'Aelux Launcher' },
  { value: 'settings', label: '系统设置' },
  { value: 'files', label: '文件管理器' },
  { value: 'store', label: '应用商店（即将上线）', disabled: true },
]

const CHANNEL_OPTIONS: SelectOption[] = [
  { value: 'stable', label: '稳定版' },
  { value: 'beta', label: '公测版' },
  { value: 'nightly', label: '每日构建' },
]

const RADIO_OPTIONS = [
  { value: 'balanced', label: '均衡模式', description: '性能与功耗的折中方案' },
  { value: 'performance', label: '性能优先', description: '优先保证动画与响应速度' },
  { value: 'saver', label: '省电优先', description: '降低动效与后台刷新频率' },
]

const CHECK_OPTIONS = [
  { value: 'analytics', label: '使用统计', description: '匿名上报功能使用频次' },
  { value: 'crash', label: '崩溃报告', description: '出问题时上传诊断日志' },
  { value: 'beta', label: '体验计划', description: '接收预览版本更新' },
]

const INPUT_CODE = `<Input placeholder="请输入名称" value={name} onChange={(e) => setName(e.target.value)} allowClear />
<Input status="error" placeholder="错误状态" />
<Input prefix={<IconSearch size={14} />} suffix="@aelux.dev" />`

const FORM_CODE = `<FormItem label="应用名称" htmlFor="app-name" required error={nameError}>
  <Input id="app-name" value={name} onChange={...} status={nameError ? 'error' : 'default'} />
</FormItem>`

/** 表单组件示例页：Input / Textarea / Select / Checkbox / RadioGroup / Switch / Slider / FormItem。 */
export function FormSection(_props: SectionProps) {
  const formId = useId()
  const [name, setName] = useState('Aelux Launcher')
  const [note, setNote] = useState('')
  const [app, setApp] = useState('launcher')
  const [channel, setChannel] = useState('stable')
  const [mode, setMode] = useState('balanced')
  const [receiving, setReceiving] = useState(true)
  const [volume, setVolume] = useState(40)
  const [agreed, setAgreed] = useState(false)
  const [checked, setChecked] = useState<string[]>(['analytics'])

  const trimmedName = name.trim()
  const nameError =
    trimmedName.length === 0
      ? '应用名称不能为空'
      : trimmedName.length < 2
        ? '应用名称至少需要 2 个字符'
        : undefined

  const allChecked = checked.length === CHECK_OPTIONS.length

  const toggleOption = (value: string) => {
    setChecked((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const currentApp = APP_OPTIONS.find((option) => option.value === app)?.label ?? '（未选择）'
  const currentMode = RADIO_OPTIONS.find((option) => option.value === mode)?.label ?? '（未选择）'

  return (
    <>
      <ShowcaseBlock
        title="Input 输入框"
        description="三种尺寸、四种校验状态、前后缀与清除按钮；焦点环与状态色统一由 --aelux-* token 驱动。"
        code={INPUT_CODE}
        column
      >
        <div className="demo-row">
          <Input
            placeholder="受控输入 + 清除"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            allowClear
            onClear={() => setName('')}
          />
          <Input size="sm" placeholder="sm · 28px" />
          <Input size="md" placeholder="md · 34px" />
          <Input size="lg" placeholder="lg · 40px" />
        </div>
        <div className="demo-row">
          <Input status="error" placeholder="错误状态" />
          <Input status="warning" placeholder="警告状态" />
          <Input status="success" placeholder="成功状态" />
          <Input prefix={<IconSearch size={14} />} placeholder="带前缀图标" />
          <Input suffix="@aelux.dev" placeholder="带后缀" />
          <Input disabled placeholder="禁用状态" />
        </div>
        <Input block prefix={<IconUser size={14} />} placeholder="block 输入框铺满整行" />
        <p className="demo-label">受控值：{name || '（空）'}</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Textarea 多行输入"
        description="与 Input 共用状态体系；showCount 配合 maxLength、autoSize 随内容撑高，均为可选增强。"
        column
      >
        <div className="demo-row">
          <Textarea placeholder="默认多行输入" />
          <Textarea size="sm" placeholder="sm 尺寸" />
          <Textarea status="error" defaultValue="这个字段不能为空" />
          <Textarea status="warning" defaultValue="长度接近上限" />
          <Textarea disabled defaultValue="禁用状态" />
        </div>
        <Textarea
          block
          value={note}
          maxLength={120}
          showCount
          placeholder="受控 + 字数统计（最多 120 字）"
          onChange={(event) => setNote(event.currentTarget.value)}
        />
        <Textarea block autoSize rows={2} placeholder="autoSize：输入多行时自动撑高，无需滚动条" />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Select 下拉选择"
        description="基于原生 select，保留键盘与可访问性；自定义 SVG 箭头随尺寸缩放，placeholder 在空值时显示。"
        column
      >
        <div className="demo-row">
          <Select options={APP_OPTIONS} value={app} onValueChange={setApp} placeholder="选择目标应用" />
          <Select options={APP_OPTIONS} defaultValue="settings" />
          <Select options={APP_OPTIONS} size="sm" defaultValue="launcher" />
          <Select options={APP_OPTIONS} size="lg" defaultValue="files" />
        </div>
        <div className="demo-row">
          <Select options={APP_OPTIONS} status="error" placeholder="错误状态" />
          <Select options={APP_OPTIONS} disabled defaultValue="launcher" />
          <Select options={APP_OPTIONS} placeholder="block 下拉框铺满整行" block />
        </div>
        <p className="demo-label">当前应用：{currentApp}</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Checkbox 复选框"
        description="原生 checkbox + 自定义勾选框，支持 label、description、半选态（indeterminate）与 sm 尺寸。"
        column
      >
        <div className="demo-row">
          <Checkbox label="自动更新" defaultChecked />
          <Checkbox label="发送使用统计" description="仅包含匿名数据" />
          <Checkbox label="小尺寸" size="sm" />
          <Checkbox label="半选态" indeterminate />
          <Checkbox label="禁用" disabled defaultChecked />
        </div>
        <div className="demo-row">
          <Checkbox
            label="全选"
            checked={allChecked}
            indeterminate={!allChecked && checked.length > 0}
            onChange={() => setChecked(allChecked ? [] : CHECK_OPTIONS.map((option) => option.value))}
          />
          {CHECK_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              description={option.description}
              checked={checked.includes(option.value)}
              onChange={() => toggleOption(option.value)}
            />
          ))}
        </div>
        <p className="demo-label">
          已选 {checked.length} / {CHECK_OPTIONS.length} 项（点击“全选”观察半选态）
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="RadioGroup 单选组"
        description="由 RadioGroup 统一管理 name 与受控值；支持横向 / 纵向排列、自定义 gap 与整组禁用。"
        column
      >
        <RadioGroup
          options={RADIO_OPTIONS}
          value={mode}
          onChange={setMode}
          name={`${formId}-mode`}
          ariaLabel="性能模式"
        />
        <RadioGroup
          options={RADIO_OPTIONS}
          defaultValue="saver"
          direction="vertical"
          gap={14}
          name={`${formId}-mode-2`}
          ariaLabel="性能模式（纵向）"
        />
        <RadioGroup
          options={[
            { value: 'auto', label: '自动选择' },
            { value: 'manual', label: '手动指定（暂无权限）', disabled: true },
          ]}
          defaultValue="auto"
          name={`${formId}-mode-3`}
          ariaLabel="选项禁用"
        />
        <RadioGroup
          options={RADIO_OPTIONS}
          defaultValue="balanced"
          disabled
          name={`${formId}-mode-4`}
          ariaLabel="整组禁用"
        />
        <p className="demo-label">当前模式：{currentMode}</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Switch 开关"
        description="role=switch 的原生 button，Space / Enter 均可切换；onChange 直接返回布尔值，支持描述文字与禁用态。"
        column
      >
        <div className="demo-row">
          <Switch checked={receiving} onChange={setReceiving} label="后台接收更新" />
          <Switch
            defaultChecked
            label="启动时自动检查"
            description="每次启动检查一次新版本"
          />
          <Switch size="sm" defaultChecked label="小尺寸开关" />
          <Switch disabled label="禁用（关闭）" />
          <Switch defaultChecked disabled label="禁用（开启）" />
        </div>
        <p className="demo-label">后台接收更新：{receiving ? '已开启' : '已关闭'}（可点击或聚焦后按空格）</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Slider 滑动输入"
        description="原生 range 保留键盘方向键操作，轨道与滑块由 CSS 重绘；showValue 在右侧显示当前值。"
        column
      >
        <div className="demo-row">
          <Slider value={volume} onChange={setVolume} showValue />
          <Slider defaultValue={30} size="sm" showValue />
          <Slider min={0} max={10} step={2} defaultValue={4} showValue />
          <Slider defaultValue={60} disabled showValue />
        </div>
        <Slider
          value={volume}
          onChange={setVolume}
          min={0}
          max={100}
          step={5}
          showValue
          style={{ width: '100%' }}
        />
        <p className="demo-label">音量：{volume}%</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="FormItem 表单布局"
        description="label / required / hint / error 与 htmlFor 关联控件；错误信息以 role=alert 播报，inline 让标签与控件同行。"
        code={FORM_CODE}
        column
      >
        <div className="demo-surface demo-stack">
          <div className="demo-grid">
            <FormItem
              label="应用名称"
              htmlFor={`${formId}-name`}
              required
              hint="显示在启动器标题栏，2–20 个字符"
              error={nameError}
            >
              <Input
                id={`${formId}-name`}
                block
                value={name}
                status={nameError ? 'error' : 'default'}
                placeholder="例如：Aelux Launcher"
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </FormItem>
            <FormItem label="默认应用" htmlFor={`${formId}-app`} hint="启动后默认打开的应用">
              <Select
                id={`${formId}-app`}
                block
                options={APP_OPTIONS}
                value={app}
                onValueChange={setApp}
              />
            </FormItem>
            <FormItem label="更新通道" htmlFor={`${formId}-channel`} hint="切换后重启生效">
              <Select
                id={`${formId}-channel`}
                block
                options={CHANNEL_OPTIONS}
                value={channel}
                onValueChange={setChannel}
              />
            </FormItem>
          </div>
          <FormItem label="性能模式" inline>
            <RadioGroup
              options={RADIO_OPTIONS}
              value={mode}
              onChange={setMode}
              name={`${formId}-perf`}
              ariaLabel="性能模式"
            />
          </FormItem>
          <FormItem label="开机自启" inline>
            <Switch
              checked={receiving}
              onChange={setReceiving}
              label="启动系统时在后台接收更新"
              description="关闭后仅在手动检查时更新"
            />
          </FormItem>
          <FormItem
            label="用户协议"
            required
            error={agreed ? undefined : '请先阅读并同意用户协议'}
          >
            <Checkbox
              label="我已阅读并同意《用户协议》与《隐私政策》"
              checked={agreed}
              onChange={(event) => setAgreed(event.currentTarget.checked)}
            />
          </FormItem>
        </div>
      </ShowcaseBlock>
    </>
  )
}
