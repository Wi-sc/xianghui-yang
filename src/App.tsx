import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  profile, socials, stats, research, education, experience,
  papers, news, techStack, navItems, type Paper,
} from './data'
import { asciiPortrait } from './asciiPortrait'
import { exec, complete, displayCwd, bibOf, isTechReport, WELCOME, type Effect } from './shell'

/* ============================================================================
   WINDOW CONTROLS
   ==========================================================================
   Previously these were three coloured circles that did nothing — an interface
   that imitates a control without being one. Now each dot does exactly what
   its colour promises, on the window it is attached to: close, minimize, zoom.
   Glyphs appear on hover, as they do in the OS they are quoting.
   ========================================================================== */

interface WindowControlsProps {
  onClose: () => void
  onMinimize: () => void
  onZoom: () => void
  zoomed?: boolean
  labels: { close: string; minimize: string; zoom: string }
}

function WindowControls({ onClose, onMinimize, onZoom, zoomed, labels }: WindowControlsProps) {
  const dots = [
    { k: 'close', bg: '#ff5f57', glyph: '✕', fn: onClose, label: labels.close },
    { k: 'min', bg: '#febc2e', glyph: '—', fn: onMinimize, label: labels.minimize },
    { k: 'zoom', bg: '#28c840', glyph: zoomed ? '⤡' : '⤢', fn: onZoom, label: labels.zoom },
  ]
  return (
    <div className="group/win flex shrink-0 items-center gap-[7px]">
      {dots.map((d) => (
        <button
          key={d.k}
          onClick={d.fn}
          title={d.label}
          aria-label={d.label}
          style={{ backgroundColor: d.bg }}
          className="relative h-[11px] w-[11px] rounded-full transition-transform duration-150 hover:brightness-110 active:scale-90"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center text-[7px] font-bold leading-none text-black/60 opacity-0 transition-opacity duration-150 group-hover/win:opacity-100"
          >
            {d.glyph}
          </span>
        </button>
      ))}
    </div>
  )
}

/* ============================== ATOMS ============================== */

/** A physical-looking keycap. Shared by the footer hints so a key always looks
 *  like a key, at one size, with one bevel. */
function Keycap({ children }: { children: ReactNode }) {
  return (
    <kbd className="grid h-[17px] min-w-[17px] place-items-center rounded-[3px] border border-ink-700 bg-ink-850 px-1 font-mono text-3xs leading-none tracking-normal text-ink-300">
      {children}
    </kbd>
  )
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-[3px] inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-blink bg-accent"
    />
  )
}

function Prompt({ cmd, cwd }: { cmd?: string; cwd?: string[] }) {
  return (
    <span className="select-none whitespace-nowrap font-mono">
      <span className="text-accent">{profile.username}</span>
      <span className="text-ink-500">@hunyuan</span>
      <span className="text-ink-500">:{cwd ? displayCwd(cwd) : '~'}</span>
      <span className="text-ink-400">$</span>
      {cmd && <span className="ml-[0.6ch] text-ink-200">{cmd}</span>}
    </span>
  )
}

function SectionHeading({ cmd, id }: { cmd: string; id?: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 id={id} className="shrink-0 font-mono text-xs sm:text-sm">
        <Prompt cmd={cmd} />
      </h2>
      <span className="h-px flex-1 bg-gradient-to-r from-ink-700 via-ink-700/40 to-transparent" />
    </div>
  )
}

const ME = 'Xianghui Yang'

function Authors({ authors }: { authors: string }) {
  const list = authors.split(',').map((s) => s.trim()).filter(Boolean)
  const hasTeam = list.some((a) => a === 'HY3D Team')
  const shown = hasTeam ? list.filter((a) => !a.startsWith(ME)) : list
  return (
    <p className="text-sm font-light leading-relaxed text-ink-400">
      {shown.map((a, i) => {
        const mine = a === 'HY3D Team' || a.startsWith(ME)
        return (
          <span key={i}>
            {i > 0 && <span className="text-ink-500">, </span>}
            <span className={mine ? 'font-medium text-ink-100' : undefined}>{a}</span>
          </span>
        )
      })}
    </p>
  )
}

/* ============================== HOOKS ============================== */

function useTypingEffect(text: string, speed = 30, delay = 420) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text); setDone(true); return
    }
    let i = 0
    let interval = 0
    setOut(''); setDone(false)
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i++
        setOut(text.slice(0, i))
        if (i >= text.length) { window.clearInterval(interval); setDone(true) }
      }, speed)
    }, delay)
    return () => { window.clearTimeout(timeout); window.clearInterval(interval) }
  }, [text, speed, delay])
  return { out, done }
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join(',')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    const pick = () => {
      const line = window.innerHeight * 0.32
      let best = els[0]
      let bestDist = Infinity
      for (const el of els) {
        const { top, bottom } = el.getBoundingClientRect()
        if (bottom < 0 || top > window.innerHeight) continue
        const d = Math.abs(top - line)
        if (d < bestDist) { bestDist = d; best = el }
      }
      const doc = document.documentElement
      if (doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 4) best = els[els.length - 1]
      if (best) setActive(best.id)
    }
    pick()
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    return () => { window.removeEventListener('scroll', pick); window.removeEventListener('resize', pick) }
  }, [key])
  return active
}

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible')); return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/** Real fullscreen, so the green dot is not a lie either. */
function useFullscreen() {
  const [isFull, setIsFull] = useState(false)
  useEffect(() => {
    const on = () => setIsFull(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])
  const toggle = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])
  return { isFull, toggle }
}

/* ============================== MATRIX RAIN ============================== */

function MatrixRain({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const fontSize = 14
    let drops: number[] = []
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drops = Array(Math.ceil(window.innerWidth / fontSize)).fill(0).map(() => Math.random() * -60)
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = 'アイウエオカキクケコサシスセソタチツテト01∇∂△∮λ∑'.split('')
    let raf = 0
    let last = 0
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (t - last < 52) return
      last = t
      ctx.fillStyle = 'rgba(8,8,10,0.09)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize
        ctx.fillStyle = 'rgba(209,250,229,0.9)'
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * fontSize, y)
        ctx.fillStyle = 'rgba(16,185,129,0.55)'
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * fontSize, y - fontSize)
        if (y > window.innerHeight && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [active])

  if (!active) return null
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 opacity-80" />
}

/* ============================================================================
   TERMINAL
   ==========================================================================
   Backed by src/shell.ts: a virtual filesystem with real `ls`, `cd`, `cat`,
   `tree`, `open`, `grep`, flags, quoting and Tab-completion. Bare nouns like
   `papers` are no longer commands — they answer with the correct shell form,
   which teaches the grammar instead of contradicting it.
   ========================================================================== */

interface Entry { cwd?: string[]; cmd: string; out: string }

function Terminal({
  open, onClose, onMatrix,
}: { open: boolean; onClose: () => void; onMatrix: () => void }) {
  const [cmd, setCmd] = useState('')
  const [cwd, setCwd] = useState<string[]>([])
  const [log, setLog] = useState<Entry[]>([{ cmd: '', out: WELCOME }])
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const [zoomed, setZoomed] = useState(false)
  const [minimized, setMinimized] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prev
      restoreRef.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!minimized) bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [log, minimized])

  const apply = (effects: Effect[]) => {
    for (const e of effects) {
      switch (e.type) {
        case 'clear': setLog([]); break
        case 'exit': onClose(); break
        case 'matrix': onMatrix(); break
        case 'cd': setCwd(e.cwd); break
        case 'open': window.open(e.url, '_blank', 'noopener'); break
      }
    }
  }

  const submit = () => {
    const raw = cmd
    if (!raw.trim()) { setLog((l) => [...l, { cwd, cmd: '', out: '' }]); setCmd(''); return }
    const { out, effects } = exec(raw, cwd)
    const cleared = effects.some((e) => e.type === 'clear')
    if (!cleared) setLog((l) => [...l, { cwd, cmd: raw, out }])
    apply(effects)
    setHistory((h) => [...h, raw])
    setHIdx(-1)
    setCmd('')
  }

  const onTab = () => {
    const { line, candidates } = complete(cmd, cwd)
    setCmd(line)
    if (candidates.length > 1) {
      setLog((l) => [...l, { cwd, cmd, out: candidates.join('   ') }])
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/80 px-4 pt-[10vh] backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive terminal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full overflow-hidden rounded-xl border border-ink-700 bg-ink-850 font-mono shadow-modal transition-[max-width] duration-300 ease-out ${
          zoomed ? 'max-w-4xl' : 'max-w-xl'
        }`}
      >
        {/* Title bar — the controls here are wired to this window. */}
        <div
          className="flex items-center gap-3 border-b border-ink-700 bg-ink-900/80 px-4 py-2.5"
          onDoubleClick={() => setZoomed((z) => !z)}
        >
          <WindowControls
            onClose={onClose}
            onMinimize={() => setMinimized((m) => !m)}
            onZoom={() => setZoomed((z) => !z)}
            zoomed={zoomed}
            labels={{
              close: 'Close terminal (esc)',
              minimize: minimized ? 'Expand terminal' : 'Collapse terminal',
              zoom: zoomed ? 'Restore size' : 'Enlarge terminal',
            }}
          />
          <button
            onClick={() => setMinimized((m) => !m)}
            className="truncate text-2xs text-ink-400 transition-colors hover:text-ink-200"
            title={minimized ? 'Expand' : 'Collapse'}
          >
            zsh — {profile.username}@hunyuan — {displayCwd(cwd)}
          </button>
          <kbd className="ml-auto shrink-0 rounded border border-ink-700 px-1.5 py-0.5 text-3xs tracking-normal text-ink-400">
            esc
          </kbd>
        </div>

        {!minimized && (
          <>
            <div
              ref={bodyRef}
              onClick={() => inputRef.current?.focus()}
              className={`space-y-2.5 overflow-y-auto p-4 text-sm transition-[max-height] duration-300 ${
                zoomed ? 'max-h-[68vh]' : 'max-h-[48vh]'
              }`}
            >
              {log.map((e, i) => (
                <div key={i}>
                  {e.cmd !== '' && (
                    <div className="flex flex-wrap items-baseline gap-x-1.5 text-xs">
                      <Prompt cwd={e.cwd} />
                      <span className="text-ink-100">{e.cmd}</span>
                    </div>
                  )}
                  {e.out && (
                    <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed tracking-normal text-ink-400">
                      {e.out}
                    </pre>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap items-baseline gap-x-1.5 text-xs">
                <Prompt cwd={cwd} />
                <input
                  ref={inputRef}
                  value={cmd}
                  onChange={(e) => setCmd(e.target.value)}
                  aria-label="Terminal input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); submit() }
                    else if (e.key === 'Tab') { e.preventDefault(); onTab() }
                    else if (e.key === 'Escape') onClose()
                    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLog([]) }
                    else if (e.key === 'c' && e.ctrlKey) {
                      e.preventDefault()
                      setLog((l) => [...l, { cwd, cmd: `${cmd}^C`, out: '' }])
                      setCmd('')
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      if (!history.length) return
                      const ni = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1)
                      setHIdx(ni); setCmd(history[ni])
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      if (hIdx < 0) return
                      const ni = hIdx + 1
                      if (ni >= history.length) { setHIdx(-1); setCmd('') }
                      else { setHIdx(ni); setCmd(history[ni]) }
                    }
                  }}
                  className="min-w-[6ch] flex-1 bg-transparent text-ink-100 caret-accent outline-none"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
            </div>

            {/* Legend: states the grammar up front, so nobody has to guess. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-700 bg-ink-900/60 px-4 py-2 text-3xs tracking-normal text-ink-500">
              <span><span className="text-ink-300">tab</span> complete</span>
              <span><span className="text-ink-300">↑↓</span> history</span>
              <span><span className="text-ink-300">^L</span> clear</span>
              <span className="ml-auto">
                try <button onClick={() => { setCmd('tree'); inputRef.current?.focus() }} className="text-accent/80 underline decoration-dotted underline-offset-2 hover:text-accent">tree</button>
                {' · '}
                <button onClick={() => { setCmd('cat about.md'); inputRef.current?.focus() }} className="text-accent/80 underline decoration-dotted underline-offset-2 hover:text-accent">cat about.md</button>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ============================== PUBLICATION ROW ============================== */

function venueOf(p: Paper) {
  return isTechReport(p) ? 'Tech Report' : p.venue.replace(/\s?\d{4}$/, '')
}

function PaperRow({ p }: { p: Paper }) {
  const [showBib, setShowBib] = useState(false)
  const isFirstAuthor = p.tags.includes('first-author') || p.tags.includes('co-first')
  const notes = p.tags.filter((t) => t !== 'first-author' && t !== 'co-first')

  return (
    <article className="group grid grid-cols-1 gap-x-6 gap-y-2 border-t border-ink-700/60 py-5 transition-colors duration-300 first:border-t-0 hover:bg-ink-100/[0.014] sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]">
      <div className="flex items-baseline gap-2 sm:block">
        <time className="block font-mono text-xs font-medium text-signal">{p.year}</time>
        <span className="mt-1 block font-mono text-3xs uppercase text-ink-500">{venueOf(p)}</span>
      </div>

      <div className="min-w-0">
        <h3 className="text-md font-medium leading-snug">
          <a
            href={p.links[0]?.href || '#'}
            target="_blank"
            rel="noopener"
            className="link-underline text-ink-100 transition-colors duration-200 hover:text-accent"
          >
            {p.title}
          </a>
        </h3>

        <div className="mt-1.5"><Authors authors={p.authors} /></div>

        {(isFirstAuthor || notes.length > 0) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-3xs uppercase">
            {isFirstAuthor && (
              <span className="flex items-center gap-1.5 text-accent">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {p.tags.includes('co-first') ? 'co-first author' : 'first author'}
              </span>
            )}
            {notes.map((t) => <span key={t} className="text-ink-500">{t}</span>)}
          </div>
        )}

        {showBib && (
          <pre className="mt-3 overflow-x-auto rounded-md border border-ink-700 bg-ink-950/70 p-3.5 font-mono text-2xs leading-relaxed tracking-normal text-ink-400">
            {bibOf(p)}
          </pre>
        )}
      </div>

      <div className="flex flex-wrap items-start gap-x-3 gap-y-1 font-mono text-2xs sm:justify-end">
        {p.links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener" className="link-quiet">{l.label}</a>
        ))}
        <button onClick={() => setShowBib((s) => !s)} aria-expanded={showBib} className="link-quiet">
          {showBib ? 'hide' : 'bib'}
        </button>
      </div>
    </article>
  )
}

/* ============================================================================
   CAREER TIMELINE
   ==========================================================================
   One component for both experience and education. Two lists that describe the
   same kind of fact — a dated position at an institution — should not be drawn
   in two different visual languages; the reader would have to learn the page
   twice. A single rail also means either list can grow without ever opening a
   hole beside a shorter neighbour.
   ========================================================================== */

interface TimelineItem {
  year: string
  title: string
  org: string
  note?: string
  detail: string
}

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative">
      {/* One continuous rail, inset to align with the dots. */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[3px] top-2 w-px bg-ink-700 sm:left-[7.5rem]"
      />
      {items.map((it) => (
        <li
          key={`${it.year}-${it.title}`}
          className="group relative grid grid-cols-1 gap-x-8 gap-y-1 py-5 pl-6 sm:grid-cols-[7rem_minmax(0,1fr)] sm:pl-0"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-[26px] h-[7px] w-[7px] rounded-full bg-ink-600 ring-4 ring-ink-950 transition-colors duration-300 group-hover:bg-accent sm:left-[calc(7.5rem-3px)]"
          />
          <time className="tnum font-mono text-2xs font-medium text-signal sm:pt-[5px] sm:text-right sm:leading-5">
            {it.year}
          </time>
          <div className="min-w-0 sm:pl-8">
            <h4 className="text-md font-medium leading-snug text-ink-100">{it.title}</h4>
            <p className="mt-0.5 text-sm text-ink-300">{it.org}</p>
            {it.note && (
              <p className="mt-1.5 max-w-measure text-xs font-light italic leading-relaxed text-ink-400">
                {it.note}
              </p>
            )}
            <p className="mt-1.5 max-w-measure text-xs font-light leading-relaxed text-ink-400">{it.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ============================== APP ============================== */

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function App() {
  const { out: typed, done: typedDone } = useTypingEffect(profile.tagline)
  const now = useClock()
  const navIds = useMemo(() => navItems.map((n) => n.id), [])
  const active = useScrollSpy(navIds)
  useReveal()

  const [termOpen, setTermOpen] = useState(false)
  const [matrix, setMatrix] = useState(false)
  const [progress, setProgress] = useState(0)
  const [filter, setFilter] = useState<'all' | 'selected'>('all')
  const [ascii, setAscii] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Header behaves like a real window: full → minimized → closed.
  const [chrome, setChrome] = useState<'full' | 'min' | 'closed'>('full')
  const { isFull, toggle: toggleFullscreen } = useFullscreen()

  // The footer hint is permanent, so it needs no timer and no persistence —
  // only a lit state once the sequence has been performed.
  const [konamiFound, setKonamiFound] = useState(false)

  const konami = useRef<string[]>([])
  const toastTimer = useRef(0)

  const flash = useCallback((m: string) => {
    setToast(m)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing = el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable
      if (e.key === '`' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault(); setTermOpen((o) => !o); return
      }
      if (e.key === 'Escape') { setMatrix(false); return }
      if (!typing && !termOpen && e.key.toLowerCase() === 'm') {
        setMatrix((v) => { flash(v ? 'matrix: off' : 'matrix: on — esc to exit'); return !v })
      }
      konami.current = [...konami.current.slice(-9), e.key]
      if (konami.current.join(',') === KONAMI.join(',')) {
        setMatrix(true)
        setKonamiFound(true)
        flash('konami unlocked — esc to exit')
        konami.current = []
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [termOpen, flash])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const shown = useMemo(() => {
    const list = filter === 'all' ? papers : papers.filter((p) => p.highlight)
    return [...list].sort((a, b) => b.year - a.year)
  }, [filter])

  const selectedCount = useMemo(() => papers.filter((p) => p.highlight).length, [])

  return (
    <div className="grid-bg relative min-h-screen overflow-x-clip">
      <div className="grain" aria-hidden="true" />
      <MatrixRain active={matrix} />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink-950"
      >
        Skip to content
      </a>

      {matrix && (
        <button
          onClick={() => setMatrix(false)}
          className="fixed left-1/2 top-5 z-[45] -translate-x-1/2 rounded-full border border-accent/40 bg-ink-950/85 px-4 py-2 font-mono text-2xs text-accent shadow-lift backdrop-blur transition-colors hover:bg-accent/10"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-blink rounded-full bg-accent align-middle" />
          matrix mode — click or press esc
        </button>
      )}

      <div className="fixed left-0 top-0 z-[60] h-[2px] w-full" aria-hidden="true">
        <div className="h-full bg-accent/80 transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* ───────────────────────────── HEADER ───────────────────────────── */}
      {chrome === 'closed' ? (
        <button
          onClick={() => setChrome('full')}
          title="Reopen the title bar"
          className="fixed left-4 top-4 z-30 flex items-center gap-2 rounded-full border border-ink-700 bg-ink-850/90 px-3 py-1.5 font-mono text-3xs tracking-normal text-ink-400 shadow-lift backdrop-blur transition-colors hover:text-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
          reopen bar
        </button>
      ) : (
        <header className="sticky top-0 z-30 border-b border-ink-700/70 bg-ink-950/75 backdrop-blur-xl">
          <div
            className={`mx-auto flex max-w-page items-center gap-5 px-5 transition-[height] duration-300 ease-out sm:px-8 ${
              chrome === 'min' ? 'h-9' : 'h-12'
            }`}
          >
            <WindowControls
              onClose={() => setChrome('closed')}
              onMinimize={() => setChrome((c) => (c === 'min' ? 'full' : 'min'))}
              onZoom={toggleFullscreen}
              zoomed={isFull}
              labels={{
                close: 'Hide the title bar',
                minimize: chrome === 'min' ? 'Show navigation' : 'Collapse to a slim bar',
                zoom: isFull ? 'Exit fullscreen' : 'Enter fullscreen',
              }}
            />

            <span className="hidden font-mono text-2xs text-ink-400 lg:inline">
              {profile.username}@hunyuan: ~
            </span>

            {chrome === 'full' && (
              <nav
                aria-label="Sections"
                className="-mx-1 flex min-w-0 items-center gap-1 overflow-x-auto font-mono text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {navItems.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => scrollTo(n.id)}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`relative shrink-0 px-2 py-1.5 transition-colors duration-200 ${
                      active === n.id ? 'text-ink-100' : 'text-ink-400 hover:text-ink-200'
                    }`}
                  >
                    {n.label}
                    <span
                      className={`absolute inset-x-2 -bottom-px h-[1.5px] rounded-full bg-accent transition-transform duration-300 ease-out ${
                        active === n.id ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                ))}
              </nav>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-4 font-mono text-2xs text-ink-400">
              <span className="hidden items-center gap-2 md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_theme(colors.accent.DEFAULT)]" />
                {profile.status}
              </span>
              <time className="tnum hidden text-ink-300 sm:block">
                {now.toLocaleTimeString('en-GB', { hour12: false })}
              </time>
            </div>
          </div>
        </header>
      )}

      <main className="relative mx-auto max-w-page px-5 sm:px-8">

        {/* ───────────────────────────── HERO ───────────────────────────── */}
        <section
          id="about"
          aria-label="About"
          className="grid animate-fade-in grid-cols-1 gap-x-14 gap-y-10 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_268px]"
        >
          <div className="min-w-0 lg:order-1">
            <div className="mb-5 font-mono text-2xs"><Prompt cmd="cat /etc/profile" /></div>

            <h1 className="text-3xl font-semibold text-ink-100 md:text-4xl">{profile.name}</h1>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 font-mono text-sm">
              <span className="text-accent">{profile.title}</span>
              <span className="text-ink-600">/</span>
              <span className="text-ink-300">{profile.affiliation}</span>
              <span className="text-ink-600">/</span>
              <span className="text-ink-500">“{profile.alias}”</span>
            </p>

            <div className="relative mt-8 font-mono text-base leading-relaxed text-ink-200 sm:text-lg">
              <span className="invisible select-none" aria-hidden="true">&gt; {profile.tagline}</span>
              <p className="absolute inset-0">
                <span className="text-ink-500">&gt;&nbsp;</span>
                {typed}
                {!typedDone && <Caret />}
              </p>
            </div>

            <p className="mt-8 max-w-measure text-base font-light text-ink-300">
              I am a Senior Research Scientist at <strong className="font-medium text-ink-100">Tencent</strong>, where I lead
              research on 3D content generation. I am the <strong className="font-medium text-ink-100">first author and core
              contributor</strong> of the{' '}
              <a href="http://3d-models.hunyuan.tencent.com/" target="_blank" rel="noopener" className="link-underline font-normal text-accent">
                Hunyuan3D
              </a>{' '}
              series — Tencent’s flagship 3D generation system with{' '}
              <strong className="font-medium text-ink-100">900+ citations</strong>. I earned my Ph.D. from{' '}
              <span className="text-ink-200">The University of Sydney</span> and my B.Sc. in Physics from{' '}
              <span className="text-ink-200">Nanjing University</span>. I care about building 3D systems that are both
              geometrically principled and production-ready.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs">
              <button
                onClick={() => scrollTo('publications')}
                className="rounded-md bg-accent px-5 py-2.5 font-medium text-ink-950 transition-all duration-200 hover:bg-accent/90 hover:shadow-[0_0_24px_-6px_theme(colors.accent.DEFAULT)]"
              >
                ./read_papers.sh
              </button>
              <a
                href={profile.cv}
                target="_blank"
                rel="noopener"
                className="rounded-md border border-ink-600 px-5 py-2.5 text-ink-200 transition-colors duration-200 hover:border-accent/60 hover:text-accent"
              >
                curl cv.pdf ↗
              </a>
            </div>

            <div className="mt-14">
              <h2 className="label mb-4">recent</h2>
              <ol className="space-y-3 border-l border-ink-700 pl-5">
                {news.map((n, i) => (
                  <li key={i} className="flex flex-col gap-x-5 gap-y-0.5 sm:flex-row">
                    <time className="tnum w-16 shrink-0 font-mono text-2xs text-signal sm:pt-[5px]">{n.date}</time>
                    <p className="text-sm font-light text-ink-300">{n.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="space-y-4 lg:order-2">
            <figure className="panel overflow-hidden p-2.5">
              <div className="relative overflow-hidden rounded-md">
                {ascii ? (
                  <pre
                    className="grid aspect-square w-full select-none place-items-center overflow-hidden whitespace-pre bg-ink-950/60 font-mono leading-[1.05] tracking-normal text-accent/90"
                    style={{ fontSize: 'clamp(4.5px, 0.95vw, 6.5px)' }}
                    aria-label={`ASCII portrait of ${profile.name}`}
                  >
                    {asciiPortrait}
                  </pre>
                ) : (
                  <picture>
                    <source srcSet={profile.avatarWebp} type="image/webp" />
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      width={512}
                      height={512}
                      className="aspect-square w-full object-cover saturate-[0.85] transition-[filter] duration-700 hover:saturate-100"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </picture>
                )}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-ink-100/10" />
              </div>
              <figcaption className="mt-2.5 flex items-center justify-between border-t border-ink-700 pt-2.5 font-mono text-3xs">
                <button
                  onClick={() => setAscii((v) => !v)}
                  aria-pressed={ascii}
                  className="tracking-normal text-ink-400 transition-colors hover:text-accent"
                >
                  <span className="text-accent">$</span> render --{ascii ? 'img' : 'ascii'}
                </button>
                <span className="text-ink-500">portrait.{ascii ? 'txt' : 'png'}</span>
              </figcaption>
            </figure>

            <dl className="panel divide-y divide-ink-700 font-mono text-2xs">
              {stats.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
                  <dt className="text-ink-500">{s.label}</dt>
                  <dd className="tnum truncate text-right text-ink-200">{s.value}</dd>
                </div>
              ))}
            </dl>

            <nav className="panel p-2 font-mono text-2xs" aria-label="Elsewhere">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-baseline justify-between gap-3 rounded px-2 py-2 transition-colors duration-200 hover:bg-ink-800/70"
                >
                  <span className="flex items-baseline gap-2 text-ink-400">
                    <span className="text-accent/70 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    {s.label.toLowerCase()}
                  </span>
                  <span className="truncate text-ink-300 transition-colors duration-200 group-hover:text-accent">{s.handle}</span>
                </a>
              ))}
            </nav>
          </aside>
        </section>

        {/* ───────────────────────────── CV ───────────────────────────── */}
        <section id="cv" aria-labelledby="cv-h" className="reveal border-t border-ink-700/60 py-16 md:py-20">
          <SectionHeading id="cv-h" cmd="git log --oneline" />

          {/* Experience leads: it is the current, load-bearing fact about him.
              Education follows as provenance. Both use the same rail, so the
              reader learns one pattern and either list can grow freely. */}
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <h3 className="label">experience</h3>
              <span className="tnum font-mono text-3xs text-ink-500">
                {experience.length} {experience.length === 1 ? 'role' : 'roles'}
              </span>
            </div>
            <Timeline
              items={experience.map((e) => ({
                year: e.year, title: e.role, org: e.org, detail: e.detail,
              }))}
            />
          </div>

          <div className="mt-14">
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <h3 className="label">education</h3>
              <span className="tnum font-mono text-3xs text-ink-500">
                {education.length} {education.length === 1 ? 'degree' : 'degrees'}
              </span>
            </div>
            <Timeline
              items={education.map((e) => ({
                year: e.year,
                title: e.degree,
                org: e.school,
                note: e.advisor || undefined,
                detail: e.detail,
              }))}
            />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <div>
              <h3 className="label mb-4">toolchain</h3>
              <ul className="flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <li
                    key={t}
                    className="rounded border border-ink-700 bg-ink-850/50 px-2.5 py-1.5 font-mono text-2xs tracking-normal text-ink-300 transition-colors duration-200 hover:border-ink-600 hover:text-ink-100"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="panel p-5">
              <blockquote className="text-base font-light italic leading-relaxed text-ink-200">
                “Make the 3D world as easy to create as typing a sentence.”
              </blockquote>
              <figcaption className="label mt-3">$ echo $MOTTO</figcaption>
            </figure>
          </div>
        </section>

        {/* ───────────────────────── RESEARCH ───────────────────────── */}
        <section id="research" aria-labelledby="research-h" className="reveal border-t border-ink-700/60 py-16 md:py-20">
          <SectionHeading id="research-h" cmd="ls research/" />
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ink-700 bg-ink-700 sm:grid-cols-2 lg:grid-cols-3">
            {research.map((r, i) => (
              <li key={r.title} className="group relative bg-ink-850/60 p-6 transition-colors duration-300 hover:bg-ink-800">
                <span className="tnum font-mono text-3xs text-ink-500">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-md font-medium text-ink-100">{r.title}</h3>
                <p className="mt-2 text-sm font-light text-ink-400">{r.desc}</p>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-accent/70 transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </li>
            ))}
          </ul>
        </section>

        {/* ───────────────────── PUBLICATIONS ───────────────────── */}
        <section id="publications" aria-labelledby="pub-h" className="reveal border-t border-ink-700/60 py-16 md:py-20">
          <SectionHeading id="pub-h" cmd="ls -lh ~/papers" />

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div role="tablist" aria-label="Filter publications" className="inline-flex rounded-md border border-ink-700 bg-ink-850/60 p-1 font-mono text-2xs">
              {([['all', papers.length], ['selected', selectedCount]] as const).map(([k, n]) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={filter === k}
                  onClick={() => setFilter(k as 'all' | 'selected')}
                  className={`rounded px-3.5 py-1.5 transition-colors duration-200 ${
                    filter === k ? 'bg-ink-700 text-ink-100' : 'text-ink-400 hover:text-ink-200'
                  }`}
                >
                  {k} <span className="tnum text-ink-500">{n}</span>
                </button>
              ))}
            </div>
            <p className="font-mono text-3xs text-ink-500">* equal contribution · newest first</p>
          </div>

          <div>{shown.map((p) => <PaperRow key={p.title} p={p} />)}</div>
        </section>

        {/* ───────────────────────── CONTACT ───────────────────────── */}
        <section id="contact" aria-labelledby="contact-h" className="reveal border-t border-ink-700/60 py-16 md:py-20">
          <SectionHeading id="contact-h" cmd="./contact.sh" />
          <div className="panel grid grid-cols-1 items-center gap-x-12 gap-y-8 p-8 md:grid-cols-[minmax(0,1fr)_auto] md:p-10">
            <div className="min-w-0">
              <p className="label mb-3">$ echo $EMAIL</p>
              <a href={`mailto:${profile.email}`} className="link-underline inline-block break-words font-mono text-xl text-ink-100 md:text-2xl">
                yangxhui6<span className="text-accent">@</span>gmail.com
              </a>
              <p className="mt-4 max-w-measure text-sm font-light text-ink-400">
                Always happy to talk about 3D generation, mesh &amp; texture synthesis, or research
                collaborations. Drop a line — I read every email.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <a
                href={`mailto:${profile.email}`}
                className="rounded-md bg-accent px-5 py-3 font-medium text-ink-950 transition-all duration-200 hover:bg-accent/90 hover:shadow-[0_0_24px_-6px_theme(colors.accent.DEFAULT)]"
              >
                mail -s "hi"
              </a>
              <a
                href={profile.cv}
                target="_blank"
                rel="noopener"
                className="rounded-md border border-ink-600 px-5 py-3 text-ink-200 transition-colors duration-200 hover:border-accent/60 hover:text-accent"
              >
                scp cv.pdf
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ───────────────────────────── FOOTER ───────────────────────────── */}
      {/* The status bar is where a terminal keeps its meta-information, so the
          keyboard hints belong here rather than in a floating card that covers
          the page and has to be dismissed. */}
      <footer className="border-t border-ink-700/70 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-page flex-col gap-x-5 gap-y-2.5 px-5 py-4 font-mono text-3xs text-ink-500 sm:flex-row sm:flex-wrap sm:items-center sm:px-8">
          <span className="flex items-center gap-2 tracking-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
            NORMAL
          </span>
          <span className="tracking-normal">utf-8 · lf · tsx</span>
          <span className="tracking-normal sm:ml-auto">
            © {now.getFullYear()} {profile.name} · react + vite + tailwind · no cookies, no tracking
          </span>

          <span aria-hidden="true" className="hidden h-3 w-px bg-ink-700 sm:block" />

          <button
            onClick={() => setTermOpen(true)}
            className="flex items-center gap-1.5 tracking-normal transition-colors hover:text-accent"
          >
            {/* Phrased for the input device: a phone taps, a desktop presses. */}
            <span className="sm:hidden">open terminal</span>
            <span className="hidden items-center gap-1.5 sm:flex">
              press <Keycap>`</Keycap> for terminal
            </span>
          </button>

          {/* Konami field. Before unlock it is a hint — the sequence printed as
              keycaps, inviting you to try it. Once performed, the hint is
              fulfilled and the 10 keycaps would just be clutter, so it
              collapses to a single lit marker. Hidden on touch devices, where
              the sequence cannot be entered at all. */}
          {konamiFound ? (
            <span
              className="hidden items-center gap-1.5 tracking-normal text-accent sm:flex"
              title="Konami code unlocked"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_theme(colors.accent.DEFAULT)]" />
              konami
            </span>
          ) : (
            <span
              className="hidden items-center gap-1.5 tracking-normal transition-colors duration-500 sm:flex"
              title="Try the Konami code"
            >
              <span className="hidden sm:inline">try</span>
              <span className="flex items-center gap-1">
                {['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'].map((k, i) => (
                  <Keycap key={i}>{k}</Keycap>
                ))}
              </span>
            </span>
          )}
        </div>
      </footer>

      <Terminal open={termOpen} onClose={() => setTermOpen(false)} onMatrix={() => setMatrix((v) => !v)} />

      <div aria-live="polite" className="sr-only">{toast}</div>
      {toast && (
        <div className="pointer-events-none fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 animate-fade-up">
          <div className="rounded-full border border-ink-700 bg-ink-850/95 px-4 py-2 font-mono text-2xs text-accent shadow-lift backdrop-blur">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
