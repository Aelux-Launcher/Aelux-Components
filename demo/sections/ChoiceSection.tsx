import { useId, useState } from 'react'
import {
  Checkbox,
  Chips,
  IconCheck,
  IconGrid,
  IconLayout,
  IconPackage,
  IconPlay,
  IconSettings,
  IconStar,
  IconUser,
  InheritSwitch,
  RadioGroup,
  SegmentedControl,
  Slider,
  Stepper,
  Switch,
  ToggleCard,
} from 'aelux-components'
import type { ChipItem, InheritSwitchValue, RadioOption, StepItem } from 'aelux-components'
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

const LAUNCH_CARD_OPTIONS: RadioOption[] = [
  {
    value: 'fast',
    label: '快速启动',
    description: '跳过完整性校验，进入游戏更快',
    icon: <IconPlay size={16} />,
    badge: '推荐',
  },
  {
    value: 'safe',
    label: '安全模式',
    description: '禁用全部第三方模组，用于排查问题',
    icon: <IconCheck size={16} />,
  },
  {
    value: 'offline',
    label: '离线启动',
    description: '不联网校验账号，适合网络受限环境',
    icon: <IconUser size={16} />,
  },
  {
    value: 'custom',
    label: '自定义启动',
    description: '使用自定义 JVM 参数启动实例',
    icon: <IconSettings size={16} />,
    badge: '高级',
  },
]

const STORAGE_CARD_OPTIONS: RadioOption[] = [
  {
    value: 'local',
    label: '仅本地',
    description: '配置只保存在本机，不随账号同步',
    icon: <IconPackage size={16} />,
  },
  {
    value: 'cloud',
    label: '云同步',
    description: '配置同步到云端账号，换机后自动恢复',
    icon: <IconStar size={16} />,
    badge: '需登录',
  },
  {
    value: 'policy',
    label: '团队策略',
    description: '由管理员统一配置，个人无法修改',
    icon: <IconSettings size={16} />,
    disabled: true,
  },
]

const CHIP_ITEMS: ChipItem[] = [
  { value: 'vanilla', label: '原版', icon: <IconPackage size={12} /> },
  { value: 'fabric', label: 'Fabric', icon: <IconGrid size={12} /> },
  { value: 'forge', label: 'Forge', icon: <IconLayout size={12} /> },
  { value: 'quilt', label: 'Quilt', icon: <IconStar size={12} /> },
  {
    value: 'optifine',
    label: 'OptiFine（即将支持）',
    icon: <IconSettings size={12} />,
    disabled: true,
  },
]

const VERSION_ITEMS: ChipItem[] = [
  { value: '1.21.1', label: '1.21.1' },
  { value: '1.20.6', label: '1.20.6' },
  { value: '1.19.4', label: '1.19.4' },
  { value: '1.18.2', label: '1.18.2（仅 Forge）', disabled: true },
]

const INSTALL_STEPS: StepItem[] = [
  { key: 'version', title: '选择版本', description: '1.21 · Fabric' },
  { key: 'memory', title: '分配内存', description: '4096 MB' },
  { key: 'mods', title: '安装整合包', description: '12 个模组待下载' },
  { key: 'done', title: '完成', description: '可以开始游戏了' },
]

const INHERIT_TEXT: Record<InheritSwitchValue, string> = {
  inherit: '跟随全局',
  on: '开启',
  off: '关闭',
}

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

const CARD_CHECKBOX_CODE = `<Checkbox
  variant="card"
  label="启用模组"
  description="启动时加载 mods 目录中的模组"
  checked={enableMods}
  onChange={(event) => setEnableMods(event.target.checked)}
/>`

const CARD_RADIO_CODE = `<RadioGroup
  variant="card"
  columns={2}
  options={LAUNCH_CARD_OPTIONS}
  value={launchMode}
  onChange={setLaunchMode}
  ariaLabel="启动模式"
/>`

const INHERIT_CODE = `<InheritSwitch
  value={autoUpdate}
  onChange={setAutoUpdate}
  label="自动检查更新"
  inheritLabel="跟随全局设置"
  globalValue="on"
/>`

const TOGGLE_CARD_CODE = `<ToggleCard
  label="自动备份配置"
  description="每次启动前备份 options.txt 与按键设置"
  icon={<IconCheck size={16} />}
  checked={autoBackup}
  onChange={setAutoBackup}
/>`

const CHIPS_CODE = `<Chips
  items={items}
  value={selected}
  onChange={setSelected}
  closable
  onRemove={(value) => setItems((prev) => prev.filter((item) => item.value !== value))}
  ariaLabel="模组加载器"
/>`

/** 开关与滑块示例页：Checkbox / RadioGroup / Switch / Slider / SegmentedControl / Stepper / Chips。 */
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

  const [enableMods, setEnableMods] = useState(true)
  const [enableShaders, setEnableShaders] = useState(false)
  const [launchMode, setLaunchMode] = useState('fast')
  const [autoUpdate, setAutoUpdate] = useState<InheritSwitchValue>('inherit')
  const [keepRunning, setKeepRunning] = useState<InheritSwitchValue>('on')
  const [closeLauncher, setCloseLauncher] = useState<InheritSwitchValue>('off')
  const [autoBackup, setAutoBackup] = useState(true)
  const [chipItems, setChipItems] = useState<ChipItem[]>(CHIP_ITEMS)
  const [loaders, setLoaders] = useState<string[]>(['vanilla', 'fabric'])
  const [version, setVersion] = useState<string[]>(['1.21.1'])

  const allSelected = selected.length === UPDATE_OPTIONS.length

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const removeChip = (value: string) => {
    setChipItems((prev) => prev.filter((item) => item.value !== value))
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
        title="CheckboxCard 卡片复选框"
        description={'variant="card" 的 Checkbox：整卡可点击，标题 + 说明两行排版；选中时主色描边与主色浅底，适合设置面板里的多选项。'}
        code={CARD_CHECKBOX_CODE}
        anchor="CheckboxCard"
        column
      >
        <div className="demo-grid">
          <Checkbox
            variant="card"
            label="启用模组"
            description="启动时加载 mods 目录中的模组"
            checked={enableMods}
            onChange={(event) => setEnableMods(event.target.checked)}
          />
          <Checkbox
            variant="card"
            label="启用光影包"
            description="加载 shaderpacks 并应用光影"
            checked={enableShaders}
            onChange={(event) => setEnableShaders(event.target.checked)}
          />
          <Checkbox variant="card" label="小尺寸卡片" description="更紧凑的卡片密度" size="sm" defaultChecked />
          <Checkbox
            variant="card"
            label="禁用卡片"
            description="该项由整合包作者锁定"
            defaultChecked
            disabled
          />
        </div>
        <p className="demo-label">
          模组：{enableMods ? '启用' : '关闭'} · 光影：{enableShaders ? '启用' : '关闭'}（点击卡片切换）
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
        title="RadioCard 卡片单选"
        description={'variant="card" 的 RadioGroup：卡片内展示图标、标题、说明与徽标，选中态主色描边；columns 控制列数，便于做启动模式等选择。'}
        code={CARD_RADIO_CODE}
        anchor="RadioCard"
        column
      >
        <RadioGroup
          variant="card"
          columns={2}
          options={LAUNCH_CARD_OPTIONS}
          value={launchMode}
          onChange={setLaunchMode}
          name={`${groupId}-launch`}
          ariaLabel="启动模式"
        />
        <RadioGroup
          variant="card"
          options={STORAGE_CARD_OPTIONS}
          defaultValue="local"
          name={`${groupId}-storage`}
          ariaLabel="配置存储位置"
        />
        <p className="demo-label">
          当前启动模式：
          {LAUNCH_CARD_OPTIONS.find((option) => option.value === launchMode)?.label ?? '（未选择）'}
          （「团队策略」为不可选的禁用项）
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
        title="InheritSwitch 跟随全局"
        description="三态继承开关：点击在「跟随全局 → 开启 → 关闭」之间循环，inherit 时以 aria-checked=&quot;mixed&quot; 暴露混合态，并在右侧显示全局状态。"
        code={INHERIT_CODE}
        anchor="InheritSwitch"
        column
      >
        <div className="demo-stack">
          <InheritSwitch
            value={autoUpdate}
            onChange={setAutoUpdate}
            label="自动检查更新"
            description="启动时检查一次启动器新版本"
            inheritLabel="跟随全局设置"
            globalValue="on"
          />
          <InheritSwitch
            value={keepRunning}
            onChange={setKeepRunning}
            label="关闭窗口后保持运行"
            description="关闭主窗口后最小化到系统托盘"
            globalValue="off"
          />
          <InheritSwitch
            value={closeLauncher}
            onChange={setCloseLauncher}
            label="游戏启动后关闭启动器"
            size="sm"
            globalValue="on"
          />
          <InheritSwitch
            value="inherit"
            onChange={() => undefined}
            label="由管理员策略锁定"
            description="禁用状态下不能切换三态"
            globalValue="on"
            disabled
          />
        </div>
        <p className="demo-label">
          自动检查更新：{INHERIT_TEXT[autoUpdate]} · 关闭窗口后保持运行：{INHERIT_TEXT[keepRunning]} ·
          游戏启动后关闭启动器：{INHERIT_TEXT[closeLauncher]}
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="ToggleCard 整卡开关"
        description="card 式开关：整块卡片可点击，右侧以开关视觉同步状态；role=switch 暴露给辅助技术，选中时主色描边与浅底。"
        code={TOGGLE_CARD_CODE}
        anchor="ToggleCard"
        column
      >
        <div className="demo-stack">
          <ToggleCard
            label="自动备份配置"
            description="每次启动前备份 options.txt 与按键设置"
            icon={<IconCheck size={16} />}
            checked={autoBackup}
            onChange={setAutoBackup}
          />
          <ToggleCard
            label="云同步实例列表"
            description="把实例与整合包信息同步到云端账号"
            icon={<IconPackage size={16} />}
            defaultChecked
          />
        </div>
        <div className="demo-grid">
          <ToggleCard
            size="sm"
            label="小尺寸整卡"
            description="更紧凑的卡片密度"
            icon={<IconSettings size={16} />}
            defaultChecked
          />
          <ToggleCard
            size="sm"
            label="禁用整卡"
            description="由启动器策略锁定"
            icon={<IconStar size={16} />}
            disabled
          />
        </div>
        <p className="demo-label">
          自动备份配置：{autoBackup ? '已开启' : '已关闭'}（点击整张卡片切换）
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
        title="Chips 标签组"
        description="可选可移除的标签组：多选时选项 role=checkbox，单选时 role=radio；Enter / Space 切换，Backspace 移除最近选中的可移除项。"
        code={CHIPS_CODE}
        anchor="Chips"
        column
      >
        <div className="demo-stack">
          <Chips
            items={chipItems}
            value={loaders}
            onChange={setLoaders}
            closable
            onRemove={removeChip}
            ariaLabel="模组加载器"
          />
          <Chips
            items={VERSION_ITEMS}
            value={version}
            onChange={setVersion}
            multiple={false}
            ariaLabel="主版本（单选）"
          />
          <Chips
            items={CHIP_ITEMS.slice(0, 3)}
            defaultValue={['forge']}
            size="sm"
            block
            ariaLabel="小尺寸标签组"
          />
          <Chips items={CHIP_ITEMS.slice(0, 3)} defaultValue={['vanilla']} disabled ariaLabel="禁用标签组" />
        </div>
        <p className="demo-label">
          已选加载器：{loaders.join(' / ') || '（无）'} · 主版本：{version[0] ?? '（无）'}
          （点击 × 移除标签，聚焦后按 Backspace 删除最近选中项）
        </p>
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
