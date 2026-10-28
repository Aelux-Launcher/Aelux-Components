import { useId, useState } from 'react'
import {
  ColorPicker,
  Combobox,
  DropZone,
  FilePicker,
  FormItem,
  IconPackage,
  IconSearch,
  IconUser,
  Input,
  InputNumber,
  MultiSelect,
  SearchInput,
  Select,
  Textarea,
} from 'aelux-components'
import type {
  ColorPickerPreset,
  ComboboxOption,
  MultiSelectOption,
  SelectOption,
} from 'aelux-components'
import type { SectionProps } from './types'
import { ShowcaseBlock } from '../components/ShowcaseBlock'

const JAVA_OPTIONS: SelectOption[] = [
  { value: '8', label: 'Java 8（LTS）' },
  { value: '17', label: 'Java 17（LTS）' },
  { value: '21', label: 'Java 21（LTS）' },
  { value: '22', label: 'Java 22' },
  { value: '7', label: 'Java 7（不再支持）', disabled: true },
]

const PACK_OPTIONS: ComboboxOption[] = [
  {
    value: 'fabric-1.21',
    label: 'Fabric 1.21',
    description: '轻量模组加载器 · 推荐',
    icon: <IconPackage size={14} />,
  },
  {
    value: 'forge-1.20.1',
    label: 'Forge 1.20.1',
    description: '经典模组生态 · 47.2.0',
    icon: <IconPackage size={14} />,
  },
  {
    value: 'neoforge-1.21',
    label: 'NeoForge 1.21',
    description: 'Forge 社区分支 · 21.0.167',
    icon: <IconPackage size={14} />,
  },
  {
    value: 'quilt-1.20.6',
    label: 'Quilt 1.20.6',
    description: '上游实验性分支',
    icon: <IconPackage size={14} />,
  },
]

const MAX_PACK_SIZE = 200 * 1024 * 1024

const MODULE_OPTIONS: MultiSelectOption[] = [
  { value: 'fabric-api', label: 'Fabric API', description: '大部分 Fabric 模组的前置依赖' },
  { value: 'sodium', label: 'Sodium', description: '渲染优化 · 帧率提升明显' },
  { value: 'lithium', label: 'Lithium', description: '物理与服务端逻辑优化' },
  { value: 'iris', label: 'Iris Shaders', description: '光影支持 · 依赖 Sodium' },
  { value: 'modmenu', label: 'Mod Menu', description: '游戏内模组列表' },
  { value: 'optifine', label: 'OptiFine', description: '与 Fabric 不兼容', disabled: true },
]

const THEME_PRESETS: ColorPickerPreset[] = [
  { value: '#38BDF8', label: '冰蓝（默认）' },
  { value: '#22C55E', label: '森绿' },
  { value: '#F59E0B', label: '琥珀' },
  { value: '#EF4444', label: '警示红' },
  { value: '#8B5CF6', label: '紫罗兰' },
  { value: '#EC4899', label: '品红' },
]

function moduleLabel(value: string): string {
  const option = MODULE_OPTIONS.find((item) => item.value === value)
  return typeof option?.label === 'string' ? option.label : value
}

const INPUT_CODE = `<Input placeholder="实例名称" value={name} onChange={(e) => setName(e.target.value)} allowClear />
<Input status="error" placeholder="错误状态" prefix={<IconSearch size={14} />} />`

const SEARCH_CODE = `<SearchInput
  value={keyword}
  onValueChange={setKeyword}
  onSearch={setSearched}
  allowClear
  shortcut="Ctrl K"
  placeholder="搜索版本、整合包或组件"
/>`

const NUMBER_CODE = `<InputNumber
  value={memory}
  onValueChange={setMemory}
  min={512}
  max={32768}
  step={512}
  precision={0}
  prefix={<IconPackage size={14} />}
  suffix="MB"
/>`

const COMBOBOX_CODE = `<Combobox
  options={packs}
  value={pack}
  onValueChange={setPack}
  allowClear
  placeholder="选择整合包版本"
/>`

const MULTISELECT_CODE = `<MultiSelect
  options={modules}
  value={mods}
  onValueChange={setMods}
  searchable
  maxDisplay={2}
  placeholder="选择要安装的模组"
/>`

const DROPZONE_CODE = `<DropZone
  accept=".zip,.mrpack"
  multiple
  maxSize={200 * 1024 * 1024}
  title="拖入整合包或资源包"
  onFiles={handleFiles}
  onReject={handleReject}
/>`

const COLORPICKER_CODE = `<ColorPicker
  presets={themePresets}
  value={accent}
  onValueChange={setAccent}
  allowCustom
/>`

const FILEPICKER_CODE = `<FilePicker
  label="整合包文件"
  hint="支持 .zip / .mrpack，可多选"
  accept=".zip,.mrpack"
  multiple
  files={packFiles}
  onChange={setPackFiles}
  onRemove={(file) => setFileNote(\`移除了 \${file.name}\`)}
/>`

const FORM_CODE = `<FormItem label="实例名称" htmlFor={formId} required error={nameError}>
  <Input id={formId} block status={nameError ? 'error' : 'default'} value={name} onChange={...} />
</FormItem>`

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** 表单组件示例页：Input / Textarea / SearchInput / InputNumber / Select / Combobox / MultiSelect / FilePicker / DropZone / ColorPicker / FormItem。 */
export function FormSection(_props: SectionProps) {
  const formId = useId()
  const [name, setName] = useState('Aelux Launcher')
  const [note, setNote] = useState('')
  const [keyword, setKeyword] = useState('')
  const [searched, setSearched] = useState('')
  const [memory, setMemory] = useState<number | null>(4096)
  const [port, setPort] = useState<number | null>(25565)
  const [zoom, setZoom] = useState<number | null>(1)
  const [java, setJava] = useState('17')
  const [pack, setPack] = useState('fabric-1.21')
  const [mods, setMods] = useState<string[]>(['fabric-api', 'sodium'])
  const [accent, setAccent] = useState('#38BDF8')
  const [droppedFiles, setDroppedFiles] = useState<File[]>([])
  const [packFiles, setPackFiles] = useState<File[]>([])
  const [fileNote, setFileNote] = useState('')
  const [rejectMessage, setRejectMessage] = useState('')

  const trimmedName = name.trim()
  const nameError =
    trimmedName.length === 0
      ? '实例名称不能为空'
      : trimmedName.length < 2
        ? '实例名称至少需要 2 个字符'
        : undefined

  const handleReject = (files: File[], reason: 'size' | 'type') => {
    const names = files.map((file) => file.name).join('、')
    setRejectMessage(
      reason === 'size' ? `文件超过 200 MB 上限：${names}` : `文件类型不在接受范围内：${names}`,
    )
  }

  const handleFiles = (files: File[]) => {
    setDroppedFiles(files)
    setRejectMessage('')
  }

  return (
    <>
      <ShowcaseBlock
        title="Input 输入框"
        description="三种尺寸、四种校验状态、前后缀与清除按钮；实例名称、版本标签等启动器字段的通用输入控件。"
        code={INPUT_CODE}
        anchor="Input"
        column
      >
        <div className="demo-row">
          <Input
            placeholder="实例名称"
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
          <Input status="error" placeholder="版本号格式错误" />
          <Input status="warning" placeholder="该版本已停止维护" />
          <Input status="success" placeholder="路径校验通过" />
          <Input prefix={<IconSearch size={14} />} placeholder="搜索本地实例" />
          <Input suffix=".minecraft" placeholder="游戏目录" />
          <Input disabled placeholder="禁用状态" />
        </div>
        <Input block prefix={<IconUser size={14} />} placeholder="block：玩家名称，铺满整行" />
        <p className="demo-label">受控值：{name || '（空）'}</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Textarea 多行输入"
        description="与 Input 共用状态体系；showCount 配合 maxLength、autoSize 随内容撑高，适合安装备注与批量配置。"
        anchor="Textarea"
        column
      >
        <div className="demo-row">
          <Textarea placeholder="安装备注（例如：保留旧存档）" />
          <Textarea size="sm" placeholder="sm 尺寸" />
          <Textarea status="error" defaultValue="启动参数中包含已废弃的 JVM 选项" />
          <Textarea status="warning" defaultValue="可用内存接近上限" />
          <Textarea disabled defaultValue="该实例由服务器托管，备注只读" />
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
        title="SearchInput 搜索框"
        description="左侧搜索图标、右侧快捷键提示与清除按钮；回车触发搜索，loading 时图标转为转圈。"
        code={SEARCH_CODE}
        anchor="SearchInput"
        column
      >
        <div className="demo-row">
          <SearchInput
            value={keyword}
            onValueChange={setKeyword}
            onSearch={(value) => setSearched(value)}
            allowClear
            shortcut="Ctrl K"
            placeholder="搜索版本、整合包或组件"
          />
          <SearchInput loading shortcut="Ctrl K" placeholder="正在搜索版本…" />
          <SearchInput size="sm" placeholder="sm · 28px" />
          <SearchInput size="lg" placeholder="lg · 40px" />
          <SearchInput disabled placeholder="禁用状态" />
        </div>
        <SearchInput block allowClear placeholder="block：在版本列表上方搜索（回车触发 onSearch）" />
        <p className="demo-label">
          回车搜索：{searched || '（尚未回车）'} · 当前输入：{keyword || '（空）'}
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="InputNumber 数字输入"
        description="min / max / step / precision 自动收敛；- / + 按钮与 ↑↓ 键步进，空值回调 null。"
        code={NUMBER_CODE}
        anchor="InputNumber"
        column
      >
        <div className="demo-row">
          <InputNumber
            value={memory}
            onValueChange={setMemory}
            min={512}
            max={32768}
            step={512}
            precision={0}
            prefix={<IconPackage size={14} />}
            suffix="MB"
            ariaLabel="分配内存（MB）"
          />
          <InputNumber
            value={port}
            onValueChange={setPort}
            min={1}
            max={65535}
            step={1}
            precision={0}
            placeholder="端口"
            ariaLabel="服务器端口"
          />
          <InputNumber
            value={zoom}
            onValueChange={setZoom}
            min={0.5}
            max={2}
            step={0.1}
            precision={1}
            suffix="×"
            ariaLabel="界面缩放比例"
          />
          <InputNumber defaultValue={null} min={0} max={10} placeholder="空值 → null" ariaLabel="空值示例" />
          <InputNumber disabled defaultValue={8} ariaLabel="禁用状态" />
          <InputNumber size="sm" defaultValue={2} ariaLabel="sm 尺寸" />
          <InputNumber size="lg" defaultValue={24} ariaLabel="lg 尺寸" />
        </div>
        <p className="demo-label">
          分配内存：{memory == null ? 'null' : `${memory} MB`} · 端口：{port ?? 'null'} · 缩放：
          {zoom == null ? 'null' : `${zoom}×`}
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Select 下拉选择"
        description="基于原生 select，保留键盘与可访问性；用「选择 Java」演示版本切换与禁用项。"
        anchor="Select"
        column
      >
        <div className="demo-row">
          <Select options={JAVA_OPTIONS} value={java} onValueChange={setJava} placeholder="选择 Java 版本" />
          <Select options={JAVA_OPTIONS} defaultValue="21" />
          <Select options={JAVA_OPTIONS} size="sm" defaultValue="17" />
          <Select options={JAVA_OPTIONS} size="lg" defaultValue="22" />
        </div>
        <div className="demo-row">
          <Select options={JAVA_OPTIONS} status="error" placeholder="缺少可用 Java" />
          <Select options={JAVA_OPTIONS} disabled defaultValue="8" />
          <Select options={JAVA_OPTIONS} placeholder="block：启动器默认 Java" block />
        </div>
        <p className="demo-label">
          当前 Java：{JAVA_OPTIONS.find((option) => option.value === java)?.label ?? '（未选择）'}
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Combobox 可搜索下拉"
        description="输入即过滤选项，↑↓ / Enter / Escape 全键盘操作，选中打勾；allowClear 一键清空。"
        code={COMBOBOX_CODE}
        anchor="Combobox"
        column
      >
        <div className="demo-row">
          <Combobox
            options={PACK_OPTIONS}
            value={pack}
            onValueChange={setPack}
            allowClear
            placeholder="选择整合包版本"
            ariaLabel="选择整合包版本"
          />
          <Combobox options={PACK_OPTIONS} defaultValue="forge-1.20.1" size="sm" ariaLabel="sm 尺寸" />
          <Combobox options={PACK_OPTIONS} size="lg" placeholder="lg 尺寸" ariaLabel="lg 尺寸" />
          <Combobox options={PACK_OPTIONS} loading placeholder="正在拉取版本列表" ariaLabel="加载状态" />
          <Combobox options={PACK_OPTIONS} disabled defaultValue="quilt-1.20.6" ariaLabel="禁用状态" />
        </div>
        <Combobox
          options={PACK_OPTIONS}
          block
          allowClear
          placeholder="block：搜索并选择整合包（如 fabric）"
          ariaLabel="block 整合包选择"
        />
        <p className="demo-label">
          当前整合包：
          {PACK_OPTIONS.find((option) => option.value === pack)?.label ?? '（未选择）'}
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="MultiSelect 多选下拉"
        description="点开浮层勾选，已选项以 Tag 展示（超过 maxDisplay 折叠为 +N）；searchable 支持输入过滤，↑↓ / Enter / Space / Escape 全键盘操作，Backspace 删除最近一项。"
        code={MULTISELECT_CODE}
        anchor="MultiSelect"
        column
      >
        <div className="demo-row">
          <MultiSelect
            options={MODULE_OPTIONS}
            value={mods}
            onValueChange={setMods}
            searchable
            maxDisplay={2}
            placeholder="选择要安装的模组"
            ariaLabel="选择模组"
          />
          <MultiSelect
            options={MODULE_OPTIONS}
            defaultValue={['fabric-api', 'lithium']}
            size="sm"
            searchable
            placeholder="sm 尺寸"
            ariaLabel="sm 多选"
          />
          <MultiSelect
            options={MODULE_OPTIONS}
            defaultValue={['sodium']}
            size="lg"
            searchable
            placeholder="lg 尺寸"
            ariaLabel="lg 多选"
          />
          <MultiSelect
            options={MODULE_OPTIONS}
            defaultValue={['iris']}
            searchable={false}
            placeholder="不可搜索，点击展开"
            ariaLabel="不可搜索多选"
          />
          <MultiSelect
            options={MODULE_OPTIONS}
            defaultValue={['fabric-api', 'sodium']}
            disabled
            ariaLabel="禁用状态"
          />
        </div>
        <MultiSelect
          options={MODULE_OPTIONS}
          block
          searchable
          maxDisplay={3}
          value={mods}
          onValueChange={setMods}
          placeholder="block：搜索并勾选要预装的模组"
          ariaLabel="block 多选"
        />
        <p className="demo-label">
          已选 {mods.length} 项：
          {mods.length === 0 ? '（空）' : mods.map(moduleLabel).join('、')}
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="FilePicker 文件选择"
        description="点击选择或直接拖入文件，选中项以列表展示文件名与大小，可逐个移除；受控 files + onChange / onRemove，accept 在弹窗选择与拖入时都会过滤。"
        code={FILEPICKER_CODE}
        anchor="FilePicker"
        column
      >
        <div className="demo-row" style={{ alignItems: 'flex-start' }}>
          <FilePicker
            label="整合包文件"
            hint="支持 .zip / .mrpack，可多选"
            accept=".zip,.mrpack"
            multiple
            files={packFiles}
            onChange={setPackFiles}
            onRemove={(file) => setFileNote(`移除了 ${file.name}`)}
            ariaLabel="选择整合包文件"
          />
          <FilePicker
            label="Java 可执行文件"
            hint="单选，接受 .exe / .jar"
            accept=".exe,.jar"
            size="sm"
            ariaLabel="选择 Java 可执行文件"
          />
          <FilePicker
            label="资源包"
            hint="已禁用：安装完成后才能添加"
            accept=".zip"
            disabled
            size="lg"
            ariaLabel="资源包（已禁用）"
          />
        </div>
        <FilePicker
          block
          label="拖入整合包以导入服务器"
          hint="支持拖拽 .zip / .mrpack，可多选"
          accept=".zip,.mrpack"
          multiple
          ariaLabel="拖入整合包"
        />
        <p className="demo-label">
          {packFiles.length === 0
            ? '尚未选择整合包文件'
            : `已选择 ${packFiles.length} 个文件：${packFiles.map((file) => file.name).join('、')}`}
          {fileNote ? ` · ${fileNote}` : ''}
        </p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="DropZone 拖拽导入"
        description="点击 / 回车打开文件选择，拖入高亮；按 accept 与 maxSize 过滤，分别以 type / size 回调拒绝原因。"
        code={DROPZONE_CODE}
        anchor="DropZone"
        column
      >
        <DropZone
          accept=".zip,.mrpack"
          multiple
          maxSize={MAX_PACK_SIZE}
          title="拖入整合包或资源包"
          description="支持 .zip 与 .mrpack，单个文件不超过 200 MB"
          onFiles={handleFiles}
          onReject={handleReject}
        />
        <DropZone
          accept=".jar"
          multiple
          disabled
          title="拖入模组文件（已禁用）"
          description="安装完成后才能继续添加模组"
        />
        {droppedFiles.length > 0 ? (
          <p className="demo-label">
            已导入 {droppedFiles.length} 个文件：
            {droppedFiles.map((file) => `${file.name}（${formatBytes(file.size)}）`).join('、')}
          </p>
        ) : null}
        {rejectMessage ? <p className="demo-label">已拒绝：{rejectMessage}</p> : null}
      </ShowcaseBlock>

      <ShowcaseBlock
        title="ColorPicker 颜色选择"
        description="预设色板以 radiogroup 语义提供（方向键切换、选中描边 + 对勾）；allowCustom 时可输入 #RRGGBB，非法色值不提交并在回车 / 失焦时提示错误。"
        code={COLORPICKER_CODE}
        anchor="ColorPicker"
        column
      >
        <div className="demo-row">
          <ColorPicker
            presets={THEME_PRESETS}
            value={accent}
            onValueChange={setAccent}
            ariaLabel="启动器强调色"
          />
          <ColorPicker presets={THEME_PRESETS} defaultValue="#22C55E" size="sm" ariaLabel="sm 尺寸色板" />
          <ColorPicker
            presets={['#38BDF8', '#F59E0B', '#EF4444']}
            defaultValue="#F59E0B"
            allowCustom={false}
            ariaLabel="仅预设色板"
          />
          <ColorPicker presets={THEME_PRESETS} defaultValue="#8B5CF6" disabled ariaLabel="禁用色板" />
        </div>
        <p className="demo-label">当前强调色：{accent}（主题与按钮高亮会同步应用）</p>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="FormItem 表单布局"
        description="label / required / hint / error 与 htmlFor 关联控件，把搜索、数字、下拉与组合框串成实例配置表单。"
        code={FORM_CODE}
        anchor="FormItem"
        column
      >
        <div className="demo-surface demo-stack">
          <div className="demo-grid">
            <FormItem
              label="实例名称"
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
                placeholder="例如：Aelux 1.21 生存"
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </FormItem>
            <FormItem label="分配内存" htmlFor={`${formId}-memory`} hint="建议不超过物理内存的一半">
              <InputNumber
                id={`${formId}-memory`}
                block
                value={memory}
                onValueChange={setMemory}
                min={512}
                max={32768}
                step={512}
                precision={0}
                suffix="MB"
                ariaLabel="分配内存（MB）"
              />
            </FormItem>
            <FormItem label="Java 版本" htmlFor={`${formId}-java`} hint="切换后需要重启实例">
              <Select
                id={`${formId}-java`}
                block
                options={JAVA_OPTIONS}
                value={java}
                onValueChange={setJava}
              />
            </FormItem>
            <FormItem label="整合包" htmlFor={`${formId}-pack`} hint="可直接输入关键字过滤">
              <Combobox
                id={`${formId}-pack`}
                block
                options={PACK_OPTIONS}
                value={pack}
                onValueChange={setPack}
                allowClear
                placeholder="搜索整合包"
                ariaLabel="整合包"
              />
            </FormItem>
          </div>
          <FormItem label="附加快捷搜索" inline>
            <SearchInput
              allowClear
              shortcut="Ctrl K"
              placeholder="搜索已安装的模组"
              onSearch={(value) => setSearched(value)}
            />
          </FormItem>
          <FormItem label="安装备注" inline>
            <Input block placeholder="例如：先备份存档再更新" />
          </FormItem>
        </div>
      </ShowcaseBlock>
    </>
  )
}
