import { useEffect, useMemo, useRef, useState } from 'react'
import {
  profile, socials, stats, research, education, experience,
  papers, news, techStack, navItems, type Paper,
} from './data'
import { asciiPortrait } from './asciiPortrait'

/* ============================== Small atoms ============================== */

function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-3 w-3 rounded-full bg-[#ff5f57]" title="close" />
      <span className="h-3 w-3 rounded-full bg-[#febc2e]" title="minimize" />
      <span className="h-3 w-3 rounded-full bg-[#28c840]" title="maximize" />
    </div>
  )
}

function Cursor() {
  return <span className="ml-0.5 inline-block h-[1.05em] w-[0.55ch] translate-y-[2px] bg-term-green animate-blink" />
}

function Prompt({ cmd }: { cmd?: string }) {
  return (
    <span className="select-none font-mono text-term-green">
      <span className="text-term-cyan">{profile.username}</span>
      <span className="text-term-muted">@</span>
      <span className="text-term-amber">hunyuan</span>
      <span className="text-term-muted">:</span>
      <span className="text-term-pink">~</span>
      <span className="text-term-text">$ </span>
      {cmd && <span className="text-term-text">{cmd}</span>}
    </span>
  )
}

function SectionTitle({ cmd, label }: { cmd: string; label: string }) {
  return (
    <div className="mb-7 flex items-baseline gap-3">
      <Prompt cmd={cmd} />
      <div className="h-px flex-1 bg-gradient-to-r from-term-border to-transparent" />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-term-muted">{label}</span>
    </div>
  )
}

const ME = 'Xianghui Yang'

function Authors({ authors }: { authors: string }) {
  const list = authors.split(',').map((s) => s.trim()).filter(Boolean)
  // "HY3D Team" represents Xianghui Yang: when present, drop his name and
  // highlight the team instead.
  const hasTeam = list.some((a) => a === 'HY3D Team')
  const shown = hasTeam ? list.filter((a) => !a.startsWith(ME)) : list
  return (
    <span className="font-light leading-relaxed text-term-muted">
      {shown.map((a, i) => {
        const isMine = a === 'HY3D Team' || a.startsWith(ME)
        return (
          <span key={i}>
            {i > 0 && ', '}
            <span className={isMine ? 'font-normal text-term-text underline decoration-term-green/50 underline-offset-4' : ''}>
              {a}
            </span>
          </span>
        )
      })}
    </span>
  )
}

/* ============================== Hooks ============================== */

function useTypingEffect(text: string, speed = 26, delay = 500) {
  const [out, setOut] = useState('')
  useEffect(() => {
    let i = 0
    setOut('')
    const t0 = window.setTimeout(() => {
      const id = window.setInterval(() => {
        i++
        setOut(text.slice(0, i))
        if (i >= text.length) window.clearInterval(id)
      }, speed)
    }, delay)
    return () => window.clearTimeout(t0)
  }, [text, speed, delay])
  return out
}

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids.join(',')])
  return active
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ============================== Matrix rain (easter egg) ============================== */

function MatrixRain({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!active) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const chars = 'アイウエオカキクケコサシスセソタチツテト01∇∂△∮λ∑'.split('')
    const fontSize = 14
    const cols = Math.floor(canvas.width / fontSize)
    const drops = Array(cols).fill(1)
    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,11,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#10b981'
      ctx.font = `${fontSize}px JetBrains Mono, monospace`
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    const id = window.setInterval(draw, 55)
    return () => { window.clearInterval(id); window.removeEventListener('resize', resize) }
  }, [active])
  if (!active) return null
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-40 opacity-70" />
}

/* ============================== Command box (easter egg) ============================== */

function CommandBox({ open, onClose, onMatrix }: { open: boolean; onClose: () => void; onMatrix: () => void }) {
  const [cmd, setCmd] = useState('')
  const [log, setLog] = useState<{ cmd: string; out: string }[]>([
    { cmd: '', out: "Welcome. Type `help` for a list of commands." },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus(), 40) }, [open])
  useEffect(() => { bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight) }, [log])

  const run = (raw: string) => {
    const c = raw.trim()
    const lc = c.toLowerCase()
    let out = ''
    switch (lc) {
      case '': return
      case 'help':
        out = 'help · whoami · ls · cat about.md · papers · research · hunyuan · coffee · neofetch · date · uname · sudo · matrix · clear · exit · 42'
        break
      case 'whoami': out = `${profile.name} (${profile.alias}) — ${profile.title} @ ${profile.affiliation}`; break
      case 'ls': out = 'about.md   research/   papers.bib   cv.pdf   hunyuan3d/   coffee.lock   .vimrc'; break
      case 'cat about.md':
      case 'cat about': out = profile.tagline; break
      case 'papers': out = `${papers.length} publications · ${papers.filter(p => p.highlight).length} selected. Scroll to #papers ↓`; break
      case 'research': out = research.map(r => `• ${r.title}`).join('\n'); break
      case 'hunyuan': window.open('http://3d-models.hunyuan.tencent.com/', '_blank', 'noopener'); out = 'opening Hunyuan3D → http://3d-models.hunyuan.tencent.com/'; break
      case 'coffee': out = '☕ brewing… V60, 1:15, 92°C. Geometry tastes better with caffeine.'; break
      case 'neofetch':
        out = [
          `${profile.username}@hunyuan`,
          '-----------------',
          `OS:      Linux x86_64`,
          `Role:    ${profile.title}`,
          `Org:     ${profile.affiliation}`,
          `Papers:  ${papers.length}`,
          `Cites:   800+`,
          `Stack:   PyTorch · CUDA · Diffusers`,
          `Uptime:  shipping Hunyuan3D`,
        ].join('\n')
        break
      case 'date': out = new Date().toString(); break
      case 'uname': out = 'Darwin hunyuan-mbp 24.5.0 arm64 — but I deploy on Linux.'; break
      case 'sudo':
      case 'sudo su': out = `${profile.handle} is not in the sudoers file. This incident will be reported.`; break
      case 'matrix': onMatrix(); out = 'wake up, Neo… (toggling matrix rain)'; break
      case '42': out = 'the answer to life, the universe, and everything.'; break
      case 'clear': setLog([]); setCmd(''); return
      case 'exit':
      case 'quit': onClose(); return
      default: out = `zsh: command not found: ${c} — try \`help\``
    }
    setLog((l) => [...l, { cmd: c, out }])
    setHistory((h) => [...h, c]); setHIdx(-1)
    setCmd('')
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-term-border bg-term-surface font-mono text-sm shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-term-border bg-term-bg/60 px-4 py-2.5">
          <TrafficLights />
          <span className="ml-2 text-[11px] text-term-muted">— zsh — {profile.username}@hunyuan — 80×24</span>
          <span className="ml-auto text-[10px] text-term-muted">esc to close</span>
        </div>
        <div ref={bodyRef} className="max-h-[52vh] space-y-2 overflow-y-auto p-4">
          {log.map((e, i) => (
            <div key={i}>
              {e.cmd !== '' && (
                <div className="flex items-center gap-1"><Prompt /><span className="text-term-text">{e.cmd}</span></div>
              )}
              {e.out && <pre className="mt-1 whitespace-pre-wrap text-term-muted">{e.out}</pre>}
            </div>
          ))}
          <div className="flex items-center gap-1">
            <Prompt />
            <input
              ref={inputRef}
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') run(cmd)
                else if (e.key === 'Escape') onClose()
                else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  if (!history.length) return
                  const ni = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1)
                  setHIdx(ni); setCmd(history[ni])
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  if (hIdx < 0) return
                  const ni = hIdx + 1
                  if (ni >= history.length) { setHIdx(-1); setCmd('') } else { setHIdx(ni); setCmd(history[ni]) }
                }
              }}
              className="flex-1 bg-transparent text-term-text caret-term-green outline-none"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================== Paper row ============================== */

const typeBadge: Record<Paper['type'], { label: string; cls: string }> = {
  conference: { label: 'CONF', cls: 'text-term-purple border-term-purple/25 bg-term-purple/10' },
  journal: { label: 'JOURNAL', cls: 'text-term-amber border-term-amber/25 bg-term-amber/10' },
  preprint: { label: 'PREPRINT', cls: 'text-term-cyan border-term-cyan/25 bg-term-cyan/10' },
}

// "Selected" = the Hunyuan3D / HY3D technical-report series (Hunyuan3D-1.0 → HY3D-Bench).
function isTechReport(p: Paper) {
  return p.type === 'preprint' && /hunyuan|hy3d/i.test(p.title)
}

function PaperRow({ p, idx, total }: { p: Paper; idx: number; total: number }) {
  const [showBib, setShowBib] = useState(false)
  const isReport = isTechReport(p)
  const venueLabel = isReport ? 'Tech Report' : p.venue
  const badge = isReport
    ? { label: 'TECH REPORT', cls: 'text-term-amber border-term-amber/25 bg-term-amber/10' }
    : typeBadge[p.type]
  const first = (p.authors.split(',')[0] || ME).trim().replace(/\*/g, '')
  const nameParts = first.split(' ')
  const lastName = nameParts[nameParts.length - 1] || first
  const key = lastName.toLowerCase() + p.year
  const bib = `@${isReport ? 'techreport' : p.type === 'journal' ? 'article' : p.type === 'conference' ? 'inproceedings' : 'misc'}{${key},
  title   = {${p.title}},
  author  = {${p.authors.replace(/\*/g, '')}},
  ${p.type === 'conference' ? 'booktitle' : isReport ? 'institution' : 'journal '} = {${isReport ? 'Tencent Hunyuan' : p.venue}},
  year    = {${p.year}}
}`
  return (
    <div className="group grid grid-cols-[58px_1fr] gap-4 border-b border-term-border/70 py-4 transition-colors hover:bg-white/[0.015] sm:grid-cols-[58px_1fr_auto]">
      <div className="pt-0.5 font-mono text-xs text-term-muted">
        <div className="font-medium text-term-amber tabular-nums">{p.year}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wider">{venueLabel.replace(/\s?\d{4}$/, '')}</div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
          <span className="pt-px font-mono text-[10px] leading-[1.7] text-term-muted tabular-nums">[{String(idx + 1).padStart(2, '0')}]</span>
          <a href={p.links[0]?.href || '#'} target="_blank" rel="noopener" className="fancy-link text-[15px] font-medium leading-snug text-term-text hover:text-term-green">
            {p.title}
          </a>
          <span className={`rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${badge.cls}`}>
            {badge.label}
          </span>
          {p.tags.map((t) => (
            <span key={t} className="rounded-sm border border-term-green/20 bg-term-green/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-term-green">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-1 text-sm"><Authors authors={p.authors} /></div>
        {showBib && (
          <pre className="mt-3 overflow-x-auto rounded-md border border-term-border bg-term-bg/60 p-3 font-mono text-[11px] text-term-muted">{bib}</pre>
        )}
      </div>

      <div className="flex flex-col items-start gap-1 pt-1 sm:items-end">
        <div className="flex flex-wrap gap-2 font-mono text-[11px]">
          {p.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener" className="border-b border-term-border text-term-muted transition-colors hover:border-term-green/50 hover:text-term-green">
              {l.label}
            </a>
          ))}
          <button onClick={() => setShowBib((s) => !s)} className="border-b border-term-border text-term-muted transition-colors hover:border-term-green/50 hover:text-term-green">
            {showBib ? 'hide' : 'bibtex'}
          </button>
        </div>
        <span className="mt-1 hidden font-mono text-[9px] text-term-muted/60 tabular-nums sm:block">
          {String(idx + 1).padStart(2, '0')} / {total}
        </span>
      </div>
    </div>
  )
}

/* ============================== App ============================== */

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function App() {
  const typed = useTypingEffect(profile.tagline)
  const now = useClock()
  const active = useScrollSpy(navItems.map((n) => n.id))
  useReveal()

  const [termOpen, setTermOpen] = useState(false)
  const [matrix, setMatrix] = useState(false)
  const [progress, setProgress] = useState(0)
  const [filter, setFilter] = useState<'all' | 'selected'>('all')
  const [portraitAscii, setPortraitAscii] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const konami = useRef<string[]>([])

  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(null), 2600) }

  // scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // global keys: ` or ⌘K → terminal · m → matrix · konami
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      if (e.key === '`' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault(); setTermOpen((o) => !o); return
      }
      if (e.key === 'Escape' && !termOpen) {
        setMatrix(false)
      }
      if (!typing && e.key.toLowerCase() === 'm' && !termOpen) {
        setMatrix((v) => { flash(v ? 'matrix: off' : 'matrix: on — press ESC / m to exit'); return !v })
      }
      konami.current = [...konami.current.slice(-9), e.key]
      if (konami.current.join(',') === KONAMI.join(',')) {
        setMatrix(true); flash('🎮 KONAMI UNLOCKED — press ESC or click to exit'); konami.current = []
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [termOpen])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const shown = useMemo(() => {
    const list = filter === 'all' ? papers : papers.filter((p) => p.highlight)
    // stable sort by year (newest first); same-year items keep their data.ts order
    return [...list].sort((a, b) => b.year - a.year)
  }, [filter])

  return (
    <div className="grid-bg relative min-h-screen">
      <div className="noise" />
      <MatrixRain active={matrix} />
      {matrix && (
        <button
          onClick={() => setMatrix(false)}
          className="fixed right-4 top-4 z-[45] flex items-center gap-2 rounded-full border border-term-green/40 bg-term-bg/80 px-3 py-1.5 font-mono text-[11px] text-term-green shadow-lg shadow-black/50 backdrop-blur transition-colors hover:bg-term-green/10"
          title="exit matrix"
        >
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-term-green" />
          matrix mode · press <kbd className="rounded border border-term-green/40 px-1">ESC</kbd> or click to exit
        </button>
      )}

      {/* scroll progress */}
      <div className="fixed left-0 top-0 z-[60] h-0.5 w-full bg-transparent">
        <div className="h-full bg-gradient-to-r from-term-green via-term-cyan to-term-purple transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-term-border/60 bg-term-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-11 max-w-[1180px] items-center gap-4 px-5 font-mono text-xs sm:px-6">
          <TrafficLights />
          <span className="hidden text-term-muted sm:inline">— {profile.username}@hunyuan: ~</span>
          <span className="mx-1 hidden h-4 w-px bg-term-border sm:block" />
          <nav className="flex items-center gap-4 text-term-muted">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className={`transition-colors hover:text-term-text ${active === n.id ? 'text-term-green' : ''}`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4 text-term-muted">
            <span className="hidden md:inline">
              <span className="text-term-green">●</span> {profile.status}
            </span>
            <span className="tabular-nums text-term-text/80">{now.toLocaleTimeString('en-GB', { hour12: false })}</span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1180px] px-5 py-12 sm:px-6 md:py-16">

        {/* ============ HERO / ABOUT ============ */}
        <section id="about" className="mb-24 grid grid-cols-1 gap-10 animate-fade-in lg:grid-cols-[300px_1fr] lg:gap-14">
          {/* left column */}
          <aside className="space-y-5">
            <div className="relative overflow-hidden rounded-xl border border-term-border bg-term-surface/60 p-3">
              <div className="absolute right-3 top-2 z-10 font-mono text-[9px] text-term-muted">
                portrait.{portraitAscii ? 'ascii' : 'jpg'}
              </div>
              {portraitAscii ? (
                <pre
                  className="grid aspect-square w-full place-items-center overflow-hidden whitespace-pre rounded-lg bg-term-bg/40 font-mono leading-[1.04] text-term-green/90 select-none"
                  style={{ fontSize: 'clamp(5px, 1.05vw, 7px)' }}
                  aria-label={`ASCII portrait of ${profile.name}`}
                >
                  {asciiPortrait}
                </pre>
              ) : (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="aspect-square w-full rounded-lg object-cover grayscale-[15%] transition-all duration-500 hover:grayscale-0"
                  loading="eager"
                />
              )}
              <div className="mt-3 flex items-center justify-between border-t border-term-border pt-3 font-mono text-[10px] text-term-muted">
                <button
                  onClick={() => setPortraitAscii((v) => !v)}
                  className="transition-colors hover:text-term-green"
                  title="toggle ascii / photo"
                >
                  <span className="text-term-green">$</span> render --{portraitAscii ? 'img' : 'ascii'}
                </button>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 animate-blink rounded-full bg-term-green" /> available</span>
              </div>
            </div>

            {/* status panel */}
            <div className="divide-y divide-term-border rounded-xl border border-term-border bg-term-surface/60 font-mono text-[11px]">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center justify-between px-3 py-2">
                  <span className="text-term-muted">{s.label}</span>
                  <span className="text-right text-term-text">{s.value}</span>
                </div>
              ))}
            </div>

            {/* links */}
            <div className="rounded-xl border border-term-border bg-term-surface/60 p-3 font-mono text-[11px]">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-term-muted">// links</div>
              <div className="space-y-0.5">
                {socials.map((s) => (
                  <a key={s.key} href={s.href} target="_blank" rel="noopener" className="group -mx-1 flex items-center justify-between rounded px-1 py-1.5 transition-colors hover:bg-term-bg">
                    <span className="flex items-center gap-2">
                      <span className="text-term-green transition-transform group-hover:translate-x-0.5">→</span>
                      <span className="text-term-muted">{s.label.toLowerCase()}</span>
                    </span>
                    <span className="truncate pl-2 text-term-text transition-colors group-hover:text-term-green">{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* right column */}
          <div className="min-w-0">
            <div className="mb-4 font-mono text-xs"><Prompt cmd="cat /etc/profile" /></div>
            <div className="mb-2 flex flex-wrap items-center gap-3 font-mono text-[10px] text-term-muted">
              <span className="rounded border border-term-border px-1.5 py-0.5">v2026.06</span>
              <span>3D Generation · Foundation Models · Computer Vision</span>
            </div>
            <h1 className="mb-1 text-5xl font-semibold leading-[1.05] tracking-tight text-term-text md:text-6xl">
              {profile.name}
              <span className="ml-3 align-middle text-2xl font-light text-term-muted md:text-3xl">({profile.alias})</span>
            </h1>
            <div className="mb-7 mt-2 font-mono text-base text-term-cyan">
              {profile.title}<span className="text-term-muted"> · </span><span className="text-term-amber">{profile.affiliation}</span>
            </div>

            {/* typing tagline */}
            <div className="mb-8 min-h-[1.8em] font-mono text-lg leading-relaxed text-term-text/90">
              <span className="text-term-muted">&gt; </span>{typed}<Cursor />
            </div>

            <div className="grid items-start gap-6 md:grid-cols-[1fr_auto]">
              <p className="max-w-[640px] text-[15px] font-light leading-[1.75] text-term-text/85">
                I am a Senior Research Scientist at <span className="text-term-text">Tencent</span>, where I lead research on 3D content
                generation. I am the <span className="text-term-text">first author and core contributor</span> of the{' '}
                <a href="http://3d-models.hunyuan.tencent.com/" target="_blank" rel="noopener" className="fancy-link text-term-green">Hunyuan3D</a>{' '}
                series — Tencent's flagship 3D generation system with <span className="text-term-text">900+ citations</span>. I earned my
                Ph.D. from <span className="text-term-text">The University of Sydney</span> and my B.Sc. in Physics from{' '}
                <span className="text-term-text">Nanjing University</span>. I care about building 3D systems that are both{' '}
                <em className="not-italic text-term-text">geometrically principled</em> and{' '}
                <em className="not-italic text-term-text">production-ready</em>.
              </p>
              <div className="flex flex-col gap-2 font-mono text-xs">
                <button onClick={() => scrollTo('publications')} className="rounded-md bg-term-green/90 px-4 py-2.5 text-center font-medium text-term-bg transition-colors hover:bg-term-green">
                  ./read_papers.sh
                </button>
                <a href={profile.cv} target="_blank" rel="noopener" className="rounded-md border border-term-border px-4 py-2.5 text-center text-term-text transition-colors hover:border-term-green hover:text-term-green">
                  curl cv.pdf →
                </a>
              </div>
            </div>

            {/* news ticker */}
            <div className="mt-10 space-y-2.5 border-l-2 border-term-green/60 pl-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-term-muted">// recent news</div>
              {news.map((n, i) => (
                <div key={i} className="flex items-start gap-4 text-sm">
                  <span className="w-16 shrink-0 pt-0.5 font-mono text-[11px] text-term-amber tabular-nums">{n.date}</span>
                  <span className="font-light leading-relaxed text-term-text/85">{n.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CV: EDUCATION + EXPERIENCE + STACK ============ */}
        <section id="cv" className="mb-24 grid items-start gap-10 reveal lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12">
          {/* main column: education + experience stacked (grows downward) */}
          <div className="space-y-12">
            <div>
              <SectionTitle cmd="git log --education" label="education" />
              <div className="relative space-y-6 border-l border-term-border pl-5">
                {education.map((e) => (
                  <div key={e.degree} className="relative">
                    <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-term-green bg-term-bg" />
                    <div className="font-mono text-[11px] text-term-amber tabular-nums">{e.year}</div>
                    <div className="mt-0.5 text-[15px] font-medium text-term-text">{e.degree}</div>
                    <div className="text-sm text-term-muted">{e.school}</div>
                    {e.advisor && <div className="mt-1 text-[12px] font-light italic leading-relaxed text-term-muted/70">{e.advisor}</div>}
                    <div className="mt-0.5 text-[12px] font-light text-term-muted/60">{e.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionTitle cmd="git log --experience" label="experience" />
              <div className="relative space-y-6 border-l border-term-border pl-5">
                {experience.map((e) => (
                  <div key={e.role} className="relative">
                    <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-term-cyan bg-term-bg" />
                    <div className="font-mono text-[11px] text-term-amber tabular-nums">{e.year}</div>
                    <div className="mt-0.5 text-[15px] font-medium text-term-text">{e.role}</div>
                    <div className="text-sm text-term-muted">{e.org}</div>
                    <div className="mt-1 text-[12px] font-light leading-relaxed text-term-muted/70">{e.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* sidebar: tech stack + motto, sticky so it never leaves a tall gap */}
          <aside className="lg:sticky lg:top-20">
            <SectionTitle cmd="cat ~/.config/stack" label="tech stack" />
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((t) => (
                <span key={t} className="cursor-default rounded border border-term-border px-2 py-1 font-mono text-[11px] text-term-muted transition-colors hover:border-term-green/40 hover:text-term-green">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-term-border bg-term-surface/40 p-4">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-term-muted">$ echo $MOTTO</div>
              <p className="text-sm font-light italic leading-relaxed text-term-text/85">
                "Make the 3D world as easy to create as typing a sentence."
              </p>
            </div>
          </aside>
        </section>

        {/* ============ RESEARCH ============ */}
        <section id="research" className="mb-24 reveal">
          <SectionTitle cmd="./list --topics" label="research interests" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {research.map((r, i) => (
              <div key={r.title} className="group relative overflow-hidden rounded-xl border border-term-border bg-term-surface/40 p-5 transition-all hover:-translate-y-0.5 hover:border-term-green/50 hover:bg-term-surface/80">
                <div className="absolute left-4 top-3 font-mono text-[10px] text-term-muted/50">0{i + 1}</div>
                <div className="mb-2 mt-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-medium text-term-text">{r.title}</h3>
                  <span className="rounded border border-term-cyan/20 bg-term-cyan/10 px-1.5 py-0.5 font-mono text-[10px] text-term-cyan">{r.tag}</span>
                </div>
                <p className="text-sm font-light leading-relaxed text-term-muted">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ PUBLICATIONS ============ */}
        <section id="publications" className="mb-24 reveal">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <SectionTitle cmd="ls -lh ~/papers/*.bib" label="publications" />
          </div>
          <div className="mb-5 flex items-center gap-1 overflow-hidden rounded-md border border-term-border font-mono text-[11px]">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 transition-colors ${filter === 'all' ? 'bg-term-green/10 text-term-green' : 'text-term-muted hover:text-term-text'}`}>
              all ({papers.length})
            </button>
            <button onClick={() => setFilter('selected')} className={`px-3 py-1.5 transition-colors ${filter === 'selected' ? 'bg-term-green/10 text-term-green' : 'text-term-muted hover:text-term-text'}`}>
              selected ({papers.filter((p) => p.highlight).length})
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-term-border bg-term-surface/30">
            <div className="grid grid-cols-[58px_1fr] gap-4 border-b border-term-border bg-term-bg/50 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-term-muted sm:grid-cols-[58px_1fr_auto]">
              <span>year</span><span>title · authors</span><span className="hidden sm:block">links</span>
            </div>
            <div className="px-4">
              {shown.map((p, i) => <PaperRow key={p.title} p={p} idx={i} total={shown.length} />)}
            </div>
            <div className="flex items-center justify-between border-t border-term-border bg-term-bg/50 px-4 py-2.5 font-mono text-[10px] text-term-muted">
              <span>* denotes equal contribution</span>
              <span>{shown.length} entries · sorted by recency</span>
            </div>
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="mb-12 reveal">
          <SectionTitle cmd="./contact.sh" label="get in touch" />
          <div className="grid items-center gap-6 rounded-xl border border-term-border bg-term-surface/40 p-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-3 font-mono text-xs"><Prompt cmd="echo $EMAIL" /></div>
              <a href={`mailto:${profile.email}`} className="fancy-link font-mono text-2xl text-term-text md:text-3xl">
                yangxhui6<span className="text-term-green">@</span>gmail.com
              </a>
              <p className="mt-3 max-w-lg text-sm font-light leading-relaxed text-term-muted">
                Always happy to chat about 3D generation, mesh & texture synthesis, or research collaborations.
                Drop a line — I read every email.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${profile.email}`} className="rounded-md bg-term-green/90 px-5 py-3 font-mono text-sm text-term-bg transition-colors hover:bg-term-green">
                $ mail -s "hi"
              </a>
              <a href={profile.cv} target="_blank" rel="noopener" className="rounded-md border border-term-border px-5 py-3 font-mono text-sm text-term-text transition-colors hover:border-term-green hover:text-term-green">
                $ scp cv.pdf
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* footer status bar */}
      <footer className="border-t border-term-border bg-term-bg/80 backdrop-blur">
        <div className="mx-auto flex h-10 max-w-[1180px] items-center gap-4 overflow-x-auto whitespace-nowrap px-5 font-mono text-[11px] text-term-muted sm:px-6">
          <span className="text-term-green">● NORMAL</span>
          <span>utf-8</span><span>lf</span><span>tsx</span>
          <span className="hidden md:inline">© {now.getFullYear()} {profile.name} · built with react + vite + tailwind · no cookies, no tracking</span>
          <span className="ml-auto flex items-center gap-4">
            <button onClick={() => setTermOpen(true)} className="transition-colors hover:text-term-green">
              press <kbd className="rounded border border-term-border bg-term-surface px-1.5 py-0.5 text-[10px] text-term-text">`</kbd> for terminal
            </button>
            <span className="hidden text-term-muted/60 lg:inline">konami? ↑↑↓↓←→←→ba</span>
          </span>
        </div>
      </footer>

      <CommandBox open={termOpen} onClose={() => setTermOpen(false)} onMatrix={() => setMatrix((v) => !v)} />

      {toast && (
        <div className="fixed bottom-16 left-1/2 z-[90] -translate-x-1/2 animate-fade-up">
          <div className="rounded-full border border-term-green/40 bg-term-surface/95 px-4 py-2 font-mono text-xs text-term-green shadow-lg shadow-black/50 backdrop-blur">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
