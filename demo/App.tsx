import { useCallback, useEffect, useMemo, useState } from 'react'
import { IconChevronRight, IconMoon, IconSearch, IconSun } from 'aelux-components'
import type { DemoTheme } from './sections/types'
import { navSections } from './sections'

const THEME_STORAGE_KEY = 'aelux-theme'

function resolveInitialTheme(): DemoTheme {
  // ?theme=dark 便于截图 / 分享时固定主题
  const forced = new URLSearchParams(window.location.search).get('theme')
  if (forced === 'light' || forced === 'dark') return forced
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface LocationState {
  sectionId: string
  anchor?: string
}

function parseHash(hash: string): LocationState | null {
  const raw = hash.replace(/^#\/?/, '')
  if (!raw) return null
  const [sectionId, anchor] = raw.split('/')
  const section = navSections.find((item) => item.id === sectionId)
  if (!section) return null
  const validAnchor = anchor && section.components?.includes(anchor) ? anchor : undefined
  return { sectionId: section.id, anchor: validAnchor }
}

function resolveInitialLocation(): LocationState {
  return parseHash(window.location.hash) ?? { sectionId: navSections[0]?.id ?? 'overview' }
}

function Logo() {
  return <img className="demo-logo" src="/aelux-logo.png" alt="" width={30} height={30} aria-hidden="true" />
}

export default function App() {
  const [theme, setTheme] = useState<DemoTheme>(resolveInitialTheme)
  const [location, setLocation] = useState<LocationState>(resolveInitialLocation)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial = resolveInitialLocation()
    return initial.sectionId ? { [initial.sectionId]: true } : {}
  })

  const activeId = location.sectionId
  const activeAnchor = location.anchor

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const active = useMemo(
    () => navSections.find((section) => section.id === activeId) ?? navSections[0],
    [activeId],
  )

  const navigate = useCallback((sectionId: string, anchor?: string) => {
    const section = navSections.find((item) => item.id === sectionId)
    const nextAnchor = anchor && section?.components?.includes(anchor) ? anchor : undefined
    setLocation({ sectionId, anchor: nextAnchor })
    setExpanded((current) => ({ ...current, [sectionId]: true }))
  }, [])

  // 点击二级导航后滚动到对应示例块；普通切页回到顶部
  useEffect(() => {
    if (activeAnchor) {
      const target = document.getElementById(`component-${activeAnchor}`)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    document.querySelector('.demo-content')?.scrollTo({ top: 0, behavior: 'auto' })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeId, activeAnchor])

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeId}${activeAnchor ? `/${activeAnchor}` : ''}`)
  }, [activeId, activeAnchor])

  useEffect(() => {
    const handleHash = () => {
      const next = parseHash(window.location.hash)
      if (next) {
        setLocation(next)
        setExpanded((current) => ({ ...current, [next.sectionId]: true }))
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Ctrl/Cmd + K 聚焦搜索
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.querySelector<HTMLInputElement>('.demo-search input')?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const keyword = query.trim().toLowerCase()
  const filteredSections = keyword
    ? navSections.filter((section) => {
        const haystack = [section.title, section.description, section.group, ...(section.components ?? [])]
          .join(' ')
          .toLowerCase()
        return haystack.includes(keyword)
      })
    : navSections

  const groups = useMemo(() => {
    const map = new Map<string, typeof navSections>()
    for (const section of filteredSections) {
      const list = map.get(section.group) ?? []
      list.push(section)
      map.set(section.group, list)
    }
    return [...map.entries()]
  }, [filteredSections])

  const toggleExpanded = (sectionId: string) => {
    setExpanded((current) => ({ ...current, [sectionId]: !current[sectionId] }))
  }

  const activeIndex = navSections.findIndex((section) => section.id === activeId)
  const prev = activeIndex > 0 ? navSections[activeIndex - 1] : undefined
  const next = activeIndex >= 0 && activeIndex < navSections.length - 1 ? navSections[activeIndex + 1] : undefined

  if (!active) return null
  const ActiveSection = active.component

  return (
    <div className="demo-app">
      <aside className="demo-sidebar">
        <div className="demo-sidebar__brand">
          <Logo />
          <div>
            <p className="demo-brand__name">Aelux Components</p>
            <p className="demo-brand__meta">v0.1.0 · 冰蓝设计系统</p>
          </div>
        </div>

        <div className="demo-sidebar__search">
          <label className="demo-search">
            <IconSearch size={14} />
            <input
              type="search"
              value={query}
              placeholder="搜索组件…（Ctrl K）"
              aria-label="搜索组件"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <nav className="demo-sidebar__nav" aria-label="组件导航">
          {groups.length === 0 ? <p className="demo-nav__empty">没有匹配的组件</p> : null}
          {groups.map(([group, sections]) => (
            <div className="demo-nav__group" key={group}>
              <p className="demo-nav__label">{group}</p>
              <div className="demo-nav__items">
                {sections.map((section) => {
                  const children = keyword
                    ? (section.components ?? []).filter((name) => name.toLowerCase().includes(keyword))
                    : (section.components ?? [])
                  const expandable = children.length > 1
                  const open = Boolean(expanded[section.id]) || Boolean(keyword)
                  return (
                    <div className="demo-nav__entry" key={section.id}>
                      <div className="demo-nav__row">
                        <button
                          type="button"
                          className={`demo-nav__item${section.id === activeId ? ' is-active' : ''}`}
                          aria-current={section.id === activeId && !activeAnchor ? 'page' : undefined}
                          onClick={() => navigate(section.id)}
                        >
                          {section.icon}
                          <span>{section.title}</span>
                          {children.length ? <span className="demo-nav__count">{children.length}</span> : null}
                        </button>
                        {expandable ? (
                          <button
                            type="button"
                            className={`demo-nav__caret${open ? ' is-open' : ''}`}
                            aria-label={`${open ? '收起' : '展开'}${section.title}`}
                            aria-expanded={open}
                            onClick={() => toggleExpanded(section.id)}
                          >
                            <IconChevronRight size={13} />
                          </button>
                        ) : null}
                      </div>
                      {expandable && open ? (
                        <div className="demo-nav__children">
                          {children.map((name) => (
                            <button
                              type="button"
                              key={name}
                              className={`demo-nav__child${section.id === activeId && activeAnchor === name ? ' is-current' : ''}`}
                              onClick={() => navigate(section.id, name)}
                            >
                              <span className="demo-nav__child-dot" aria-hidden="true" />
                              {name}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="demo-sidebar__foot">
          <span>
            React 19 · <code>pnpm dev</code>
          </span>
          <span>ESM + d.ts</span>
        </div>
      </aside>

      <div className="demo-main">
        <header className="demo-topbar">
          <div className="demo-crumb">
            <span>组件库</span>
            <span className="demo-crumb__sep">/</span>
            <span>{active.group}</span>
            <span className="demo-crumb__sep">/</span>
            <strong>{active.title}</strong>
            {activeAnchor ? (
              <>
                <span className="demo-crumb__sep">/</span>
                <strong>{activeAnchor}</strong>
              </>
            ) : null}
          </div>
          <div className="demo-topbar__actions">
            <span className="demo-chip demo-chip--accent">零运行时依赖</span>
            <span className="demo-chip">React 19 · TS 5.9</span>
            <button
              type="button"
              className="demo-icon-btn"
              title={theme === 'light' ? '切换到深色主题' : '切换到浅色主题'}
              aria-label={theme === 'light' ? '切换到深色主题' : '切换到浅色主题'}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <IconMoon size={15} /> : <IconSun size={15} />}
            </button>
          </div>
        </header>

        <main className="demo-content">
          <div className="demo-page" key={active.id}>
            {active.id === 'overview' ? null : (
              <header className="demo-page-head">
                <p className="demo-page-head__eyebrow">{active.group}</p>
                <h1>{active.title}</h1>
                <p className="demo-page-head__desc">{active.description}</p>
                {active.components?.length ? (
                  <div className="demo-page-head__tags">
                    {active.components.map((name) => (
                      <button
                        type="button"
                        className="demo-chip demo-chip--link"
                        key={name}
                        onClick={() => navigate(active.id, name)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </header>
            )}

            <ActiveSection theme={theme} onNavigate={navigate} />

            <footer className="demo-pager">
              {prev ? (
                <button type="button" className="demo-pager__btn" onClick={() => navigate(prev.id)}>
                  <span className="demo-pager__key">上一页</span>
                  <span className="demo-pager__title">{prev.title}</span>
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button type="button" className="demo-pager__btn demo-pager__btn--next" onClick={() => navigate(next.id)}>
                  <span className="demo-pager__key">下一页</span>
                  <span className="demo-pager__title">{next.title}</span>
                </button>
              ) : (
                <span />
              )}
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
