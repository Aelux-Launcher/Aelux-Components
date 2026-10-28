import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IconChevronDown,
  IconChevronRight,
  IconMenu,
  IconMoon,
  IconSearch,
  IconSun,
  cx,
} from 'aelux-components'
import type { NavSection } from './sections/types'
import { navSections } from './sections'
import type { DemoTheme } from './sections/types'

const THEME_KEY = 'aelux-theme'

interface ActiveLocation {
  sectionId: string
  anchor?: string
}

interface NavGroup {
  name: string
  sections: NavSection[]
}

/* ------------------------------------------------------------------ 工具 */

function resolveInitialTheme(): DemoTheme {
  if (typeof window === 'undefined') return 'light'
  const fromUrl = new URLSearchParams(window.location.search).get('theme')
  if (fromUrl === 'dark' || fromUrl === 'light') return fromUrl
  const stored = window.localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function parseHash(): ActiveLocation {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [sectionId, anchor] = raw.split('/')
  const section = navSections.find((item) => item.id === sectionId)
  if (!section) return { sectionId: navSections[0].id }
  const validAnchor = anchor && section.components?.includes(anchor) ? anchor : undefined
  return { sectionId: section.id, anchor: validAnchor }
}

function useHashLocation() {
  const [location, setLocation] = useState<ActiveLocation>(() => parseHash())

  useEffect(() => {
    const handleHashChange = () => setLocation(parseHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (sectionId: string, anchor?: string) => {
    const hash = anchor ? `#${sectionId}/${anchor}` : `#${sectionId}`
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
    setLocation({ sectionId, anchor })
  }

  return { location, navigate }
}

function groupSections(sections: NavSection[]): NavGroup[] {
  const groups: NavGroup[] = []
  for (const section of sections) {
    const existing = groups.find((group) => group.name === section.group)
    if (existing) existing.sections.push(section)
    else groups.push({ name: section.group, sections: [section] })
  }
  return groups
}

/* ------------------------------------------------------------------ 页面 */

export function App() {
  const [theme, setTheme] = useState<DemoTheme>(() => resolveInitialTheme())
  const { location, navigate } = useHashLocation()
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([])
  const [openPages, setOpenPages] = useState<string[]>(() => [parseHash().sectionId])
  const searchRef = useRef<HTMLInputElement>(null)

  const activeSection = navSections.find((section) => section.id === location.sectionId) ?? navSections[0]
  const activeIndex = navSections.findIndex((section) => section.id === activeSection.id)
  const previousSection = activeIndex > 0 ? navSections[activeIndex - 1] : undefined
  const nextSection = activeIndex >= 0 && activeIndex < navSections.length - 1 ? navSections[activeIndex + 1] : undefined

  const groups = useMemo(() => groupSections(navSections), [])

  const filteredGroups = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return groups
    return groups
      .map((group) => ({
        ...group,
        sections: group.sections.filter((section) => {
          const haystack = [section.title, section.description, section.group, ...(section.components ?? [])]
            .join(' ')
            .toLowerCase()
          return haystack.includes(keyword)
        }),
      }))
      .filter((group) => group.sections.length > 0)
  }, [groups, query])

  /* 主题：写入 documentElement + localStorage */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  /* 路由变化：同步滚动位置与展开状态 */
  useEffect(() => {
    setOpenPages((pages) => (pages.includes(location.sectionId) ? pages : [...pages, location.sectionId]))
    setSidebarOpen(false)
    if (location.anchor) {
      const target = document.getElementById(`component-${location.anchor}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [location])

  /* Ctrl/Cmd + K 聚焦搜索 */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('')
        searchRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleGroup = (name: string) => {
    setCollapsedGroups((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    )
  }

  const togglePage = (id: string) => {
    setOpenPages((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const goToAnchor = (anchor: string) => {
    navigate(activeSection.id, anchor)
  }

  const isSearching = query.trim().length > 0

  return (
    <div className="demo-app">
      <header className="site-header">
        <button
          type="button"
          className="menu-btn"
          aria-label="打开导航"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          <IconMenu size={16} />
        </button>

        <button type="button" className="brand" onClick={() => navigate(navSections[0].id)}>
          <img src="/aelux-logo.png" alt="" />
          <span>aelux-components</span>
          <span className="sep">/</span>
          <span className="path">docs</span>
        </button>

        <div className="header-right">
          <span className="tag">
            <span className="dot" />
            通用 UI 组件库
          </span>
          <span className="tag">
            <span className="ver">v0.1.0</span>
          </span>
          <button
            type="button"
            className="theme-btn"
            aria-label={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
          </button>
        </div>
      </header>

      <div className="layout">
        {sidebarOpen ? (
          <button type="button" className="sidebar-backdrop" aria-label="关闭导航" onClick={() => setSidebarOpen(false)} />
        ) : null}

        <aside className={cx('sidebar', sidebarOpen && 'is-open')}>
          <div className="sidebar-search">
            <div className="search-box">
              <IconSearch size={14} />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索组件… (Ctrl K)"
                aria-label="搜索组件"
              />
            </div>
          </div>

          <nav className="nav-tree" aria-label="组件导航">
            {filteredGroups.map((group) => {
              const collapsed = !isSearching && collapsedGroups.includes(group.name)
              return (
                <section className="nav-group" key={group.name}>
                  <button
                    type="button"
                    className={cx('g-title', collapsed && 'is-collapsed')}
                    aria-expanded={!collapsed}
                    onClick={() => toggleGroup(group.name)}
                  >
                    <IconChevronDown size={10} />
                    {group.name}
                  </button>

                  {collapsed ? null : (
                    <div className="g-items">
                      {group.sections.map((section) => {
                        const isActive = section.id === activeSection.id
                        const hasChildren = Boolean(section.components?.length)
                        const open = hasChildren && (isSearching || isActive || openPages.includes(section.id))
                        return (
                          <div key={section.id}>
                            <div className="nav-row">
                              <button
                                type="button"
                                className={cx('nav-link', isActive && 'is-active')}
                                onClick={() => navigate(section.id)}
                              >
                                <span className="nav-ic">{section.icon}</span>
                                <span className="nav-label">{section.title}</span>
                                {section.components?.length ? (
                                  <span className="nav-pin">{section.components.length}</span>
                                ) : null}
                              </button>
                              {hasChildren ? (
                                <button
                                  type="button"
                                  className={cx('nav-caret', open && 'is-open')}
                                  aria-label={open ? '收起组件列表' : '展开组件列表'}
                                  aria-expanded={open}
                                  onClick={() => togglePage(section.id)}
                                >
                                  <IconChevronRight size={12} />
                                </button>
                              ) : null}
                            </div>

                            {open ? (
                              <div className="nav-children">
                                {section.components?.map((name) => (
                                  <button
                                    key={name}
                                    type="button"
                                    className={cx(
                                      'nav-child',
                                      isActive && location.anchor === name && 'is-current',
                                    )}
                                    onClick={() => navigate(section.id, name)}
                                  >
                                    {name}
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>
              )
            })}

            {filteredGroups.length === 0 ? <p className="nav-empty">没有匹配的组件，换个关键词试试。</p> : null}
          </nav>
        </aside>

        <main className="main">
          <div className="doc">
            {activeSection.id !== navSections[0].id ? (
              <>
                <h1>{activeSection.title}</h1>
                {activeSection.components?.length ? (
                  <div className="tag-line">
                    {activeSection.components.map((name) => (
                      <button key={name} type="button" className="badge" onClick={() => goToAnchor(name)}>
                        {name}
                      </button>
                    ))}
                  </div>
                ) : null}
                <p className="lead">{activeSection.description}</p>

                {activeSection.components?.length ? (
                  <div className="toc-box">
                    <b>本页组件</b>
                    <ul>
                      {activeSection.components.map((name) => (
                        <li key={name}>
                          <button type="button" onClick={() => goToAnchor(name)}>
                            {name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : null}

            <activeSection.component theme={theme} onNavigate={navigate} />

            <nav className="prev-next" aria-label="翻页">
              {previousSection ? (
                <button type="button" className="prev-next__item" onClick={() => navigate(previousSection.id)}>
                  <span>上一页</span>
                  <strong>{previousSection.title}</strong>
                </button>
              ) : (
                <span />
              )}
              {nextSection ? (
                <button
                  type="button"
                  className="prev-next__item is-next"
                  onClick={() => navigate(nextSection.id)}
                >
                  <span>下一页</span>
                  <strong>{nextSection.title}</strong>
                </button>
              ) : null}
            </nav>
          </div>

          <footer className="doc-foot">
            <span>Aelux Components · v0.1.0 · MIT License</span>
            <span>React 19 · ESM + d.ts · 为 Aelux Launcher 打造</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
