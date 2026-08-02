// ============================================================================
//  A small but honest POSIX-flavoured shell.
//
//  The previous terminal accepted `papers`, `research`, `hunyuan` and `coffee`
//  as bare verbs while also accepting `cat about.md`. That is two incompatible
//  grammars in one prompt: it looks like a shell but does not behave like one,
//  which is exactly the kind of dishonesty a terminal-themed page cannot
//  afford. Everything here is driven by a real virtual filesystem, so `ls`,
//  `cd`, `cat`, `tree` and Tab-completion all agree with one another.
//
//  Content is generated from src/data.ts — never duplicated.
// ============================================================================

import {
  profile, socials, papers, research, education,
  experience, techStack, news, type Paper,
} from './data'

/* ============================== Filesystem ============================== */

export interface FileNode { kind: 'file'; name: string; body: string; url?: string }
export interface LinkNode { kind: 'link'; name: string; url: string }
export interface DirNode { kind: 'dir'; name: string; children: FsNode[] }
export type FsNode = FileNode | LinkNode | DirNode

export function isTechReport(p: Paper) {
  return p.type === 'preprint' && /hunyuan|hy3d/i.test(p.title)
}

/** Single source of truth for BibTeX, shared with the publications list. */
export function bibOf(p: Paper) {
  const first = (p.authors.split(',')[0] || 'Xianghui Yang').trim().replace(/\*/g, '')
  const lastName = first.split(' ').slice(-1)[0] || first
  const report = isTechReport(p)
  const entry = report ? 'techreport' : p.type === 'journal' ? 'article' : p.type === 'conference' ? 'inproceedings' : 'misc'
  const field = p.type === 'conference' ? 'booktitle' : report ? 'institution' : 'journal'
  return `@${entry}{${lastName.toLowerCase()}${p.year},
  title     = {${p.title}},
  author    = {${p.authors.replace(/\*/g, '')}},
  ${field.padEnd(9)} = {${report ? 'Tencent Hunyuan' : p.venue}},
  year      = {${p.year}}
}`
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 4).join('-')

const file = (name: string, body: string, url?: string): FileNode => ({ kind: 'file', name, body, url })

const ROOT: DirNode = {
  kind: 'dir',
  name: '~',
  children: [
    file('about.md', [
      `# ${profile.name} (${profile.alias})`,
      '',
      `${profile.title} · ${profile.affiliation}`,
      '',
      profile.tagline,
      '',
      'Senior Research Scientist at Tencent, leading research on 3D content',
      'generation. First author and core contributor of the Hunyuan3D series —',
      "Tencent's flagship 3D generation system, 900+ citations.",
      '',
      'Ph.D., The University of Sydney · B.Sc. in Physics, Nanjing University.',
    ].join('\n')),

    file('contact.md', [
      '# Contact',
      '',
      `email     ${profile.email}`,
      ...socials.filter((s) => s.key !== 'mail').map((s) => `${s.label.toLowerCase().padEnd(10)}${s.href}`),
      '',
      'Always happy to talk about 3D generation, mesh & texture synthesis,',
      'or research collaborations.',
    ].join('\n')),

    file('papers.bib', papers.map(bibOf).join('\n\n')),

    {
      kind: 'dir',
      name: 'publications',
      children: [...papers]
        .sort((a, b) => b.year - a.year)
        .map((p) => file(`${p.year}-${slug(p.title)}.md`, [
          `# ${p.title}`,
          '',
          `venue    ${isTechReport(p) ? 'Tech Report · Tencent Hunyuan' : p.venue}`,
          `year     ${p.year}`,
          `authors  ${p.authors.replace(/\*/g, '')}`,
          ...(p.tags.length ? [`tags     ${p.tags.join(', ')}`] : []),
          '',
          ...p.links.map((l) => `${l.label.padEnd(8)} ${l.href}`),
        ].join('\n'), p.links[0]?.href)),
    },

    {
      kind: 'dir',
      name: 'research',
      children: research.map((r) => file(`${slug(r.title)}.md`, [
        `# ${r.title}   [${r.tag}]`, '', r.desc,
      ].join('\n'))),
    },

    {
      kind: 'dir',
      name: 'projects',
      children: [
        { kind: 'link', name: 'hunyuan3d', url: 'http://3d-models.hunyuan.tencent.com/' },
        { kind: 'link', name: 'github', url: 'https://github.com/Wi-sc' },
        { kind: 'link', name: 'scholar', url: socials.find((s) => s.key === 'scholar')?.href ?? '#' },
      ],
    },

    file('experience.log', experience.map((e) =>
      `${e.year.padEnd(13)} ${e.role} — ${e.org}\n${' '.repeat(14)}${e.detail}`).join('\n\n')),

    file('education.log', education.map((e) =>
      `${e.year.padEnd(13)} ${e.degree}\n${' '.repeat(14)}${e.school}${e.advisor ? `\n${' '.repeat(14)}${e.advisor}` : ''}`).join('\n\n')),

    file('news.log', news.map((n) => `${n.date}  ${n.text}`).join('\n')),

    file('stack.txt', techStack.join(' · ')),

    { kind: 'link', name: 'cv.pdf', url: profile.cv },

    file('.vimrc', [
      'set number relativenumber', 'set expandtab shiftwidth=2 tabstop=2',
      'set ignorecase smartcase', 'set scrolloff=8', 'syntax on',
      '" no plugins. it starts in 12ms and that is the point.',
    ].join('\n')),

    file('coffee.lock', [
      'method   = "V60"', 'ratio    = "1:15"', 'temp     = "92C"',
      'grind    = "medium-fine"', '', '# geometry tastes better with caffeine',
    ].join('\n')),
  ],
}

/* ============================== Path handling ============================== */

const isDir = (n: FsNode): n is DirNode => n.kind === 'dir'

/** Resolve a path against a cwd. Returns segment array, or null if invalid. */
function resolvePath(cwd: string[], raw: string): string[] | null {
  const p = raw.trim()
  const abs = p === '~' || p === '/' || p.startsWith('~/') || p.startsWith('/')
  const start = abs ? [] : [...cwd]
  const parts = p.replace(/^~\/?|^\//, '').split('/').filter((s) => s !== '' && s !== '.')
  const out = start
  for (const part of parts) {
    if (part === '..') { if (out.length) out.pop() }
    else out.push(part)
  }
  return out
}

function nodeAt(segs: string[]): FsNode | null {
  let cur: FsNode = ROOT
  for (const s of segs) {
    if (!isDir(cur)) return null
    const next: FsNode | undefined = cur.children.find((c: FsNode) => c.name === s)
    if (!next) return null
    cur = next
  }
  return cur
}

export const displayCwd = (cwd: string[]) => (cwd.length ? `~/${cwd.join('/')}` : '~')

/* ============================== Environment ============================== */

const ENV: Record<string, string> = {
  USER: profile.username,
  HOME: '/home/' + profile.username,
  SHELL: '/bin/zsh',
  EMAIL: profile.email,
  MOTTO: 'Make the 3D world as easy to create as typing a sentence.',
  ROLE: profile.title,
  ORG: profile.affiliation,
  EDITOR: 'nvim',
}

/* ============================== Effects ============================== */

export type Effect =
  | { type: 'clear' }
  | { type: 'exit' }
  | { type: 'matrix' }
  | { type: 'open'; url: string }
  | { type: 'cd'; cwd: string[] }

export interface Result { out: string; effects: Effect[] }

/* ============================== Helpers ============================== */

function tokenize(input: string): string[] {
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(input))) out.push(m[1] ?? m[2] ?? m[3] ?? '')
  return out
}

const nodeLabel = (n: FsNode) => (n.kind === 'dir' ? `${n.name}/` : n.kind === 'link' ? `${n.name}@` : n.name)

function columns(items: string[], width = 58) {
  if (!items.length) return ''
  const w = Math.max(...items.map((s) => s.length)) + 2
  const per = Math.max(1, Math.floor(width / w))
  const rows: string[] = []
  for (let i = 0; i < items.length; i += per) {
    rows.push(items.slice(i, i + per).map((s) => s.padEnd(w)).join('').trimEnd())
  }
  return rows.join('\n')
}

function longFormat(n: FsNode) {
  const perms = n.kind === 'dir' ? 'drwxr-xr-x' : n.kind === 'link' ? 'lrwxr-xr-x' : '-rw-r--r--'
  const size = n.kind === 'dir' ? n.children.length * 96 : n.kind === 'link' ? 12 : n.body.length
  const name = n.kind === 'link' ? `${n.name} -> ${n.url}` : nodeLabel(n)
  return `${perms}  ${profile.username}  ${String(size).padStart(6)}  ${name}`
}

function treeOf(n: FsNode, prefix = '', out: string[] = []): string[] {
  if (!isDir(n)) return out
  n.children.forEach((c, i) => {
    const last = i === n.children.length - 1
    out.push(`${prefix}${last ? '└── ' : '├── '}${nodeLabel(c)}`)
    if (isDir(c)) treeOf(c, `${prefix}${last ? '    ' : '│   '}`, out)
  })
  return out
}

/* ============================== Commands ============================== */

interface Cmd {
  usage: string
  about: string
  group: 'files' | 'actions' | 'system'
  run: (args: string[], cwd: string[]) => Result
}

const ok = (out: string): Result => ({ out, effects: [] })

const COMMANDS: Record<string, Cmd> = {
  ls: {
    usage: 'ls [-l] [path]', about: 'list directory contents', group: 'files',
    run: (args, cwd) => {
      const long = args.includes('-l') || args.includes('-la') || args.includes('-al')
      const all = args.some((a) => /^-.*a/.test(a))
      const target = args.find((a) => !a.startsWith('-')) ?? '.'
      const segs = resolvePath(cwd, target)
      const node = segs && nodeAt(segs)
      if (!node) return ok(`ls: ${target}: No such file or directory`)
      if (!isDir(node)) return ok(long ? longFormat(node) : nodeLabel(node))
      const kids = node.children.filter((c) => all || !c.name.startsWith('.'))
      if (!kids.length) return ok('')
      return ok(long
        ? `total ${kids.length}\n${kids.map(longFormat).join('\n')}`
        : columns(kids.map(nodeLabel)))
    },
  },

  cd: {
    usage: 'cd [dir]', about: 'change the working directory', group: 'files',
    run: (args, cwd) => {
      const target = args[0] ?? '~'
      const segs = resolvePath(cwd, target)
      if (!segs) return ok(`cd: ${target}: No such file or directory`)
      const node = nodeAt(segs)
      if (!node) return ok(`cd: ${target}: No such file or directory`)
      if (!isDir(node)) return ok(`cd: ${target}: Not a directory`)
      return { out: '', effects: [{ type: 'cd', cwd: segs }] }
    },
  },

  pwd: {
    usage: 'pwd', about: 'print working directory', group: 'files',
    run: (_a, cwd) => ok(`${ENV.HOME}${cwd.length ? '/' + cwd.join('/') : ''}`),
  },

  cat: {
    usage: 'cat <file>', about: 'print a file', group: 'files',
    run: (args, cwd) => {
      if (!args.length) return ok('usage: cat <file>')
      const outs = args.filter((a) => !a.startsWith('-')).map((a) => {
        const segs = resolvePath(cwd, a)
        const node = segs && nodeAt(segs)
        if (!node) return `cat: ${a}: No such file or directory`
        if (isDir(node)) return `cat: ${a}: Is a directory`
        if (node.kind === 'link') return `cat: ${a}: Is a symlink to ${node.url}\n      try \`open ${a}\``
        return node.body
      })
      return ok(outs.join('\n'))
    },
  },

  tree: {
    usage: 'tree [path]', about: 'print the filesystem as a tree', group: 'files',
    run: (args, cwd) => {
      const target = args[0] ?? '.'
      const segs = resolvePath(cwd, target)
      const node = segs && nodeAt(segs)
      if (!node) return ok(`tree: ${target}: No such file or directory`)
      if (!isDir(node)) return ok(nodeLabel(node))
      return ok([displayCwd(segs ?? []), ...treeOf(node)].join('\n'))
    },
  },

  open: {
    usage: 'open <file|url>', about: 'open a link in a new tab', group: 'actions',
    run: (args, cwd) => {
      const target = args[0]
      if (!target) return ok('usage: open <file|url>')
      if (/^https?:\/\//.test(target)) return { out: `opening ${target}`, effects: [{ type: 'open', url: target }] }
      const segs = resolvePath(cwd, target)
      const node = segs && nodeAt(segs)
      if (!node) return ok(`open: ${target}: No such file or directory`)
      const url = node.kind === 'link' ? node.url : node.kind === 'file' ? node.url : undefined
      if (!url) return ok(`open: ${target}: no associated URL — try \`cat ${target}\``)
      return { out: `opening ${url}`, effects: [{ type: 'open', url }] }
    },
  },

  grep: {
    usage: 'grep <pattern>', about: 'search publications', group: 'actions',
    run: (args) => {
      const pattern = args.filter((a) => !a.startsWith('-')).join(' ')
      if (!pattern) return ok('usage: grep <pattern>')
      let re: RegExp
      try { re = new RegExp(pattern, 'i') } catch { return ok(`grep: invalid pattern: ${pattern}`) }
      const hits = papers.filter((p) => re.test(p.title) || re.test(p.authors) || re.test(p.venue))
      if (!hits.length) return ok(`grep: no match for "${pattern}"`)
      return ok(hits.map((p) => `papers.bib:${p.year}: ${p.title}`).join('\n')
        + `\n\n${hits.length} of ${papers.length} entries matched`)
    },
  },

  find: {
    usage: 'find <name>', about: 'locate files by name', group: 'actions',
    run: (args) => {
      const q = args[0]
      if (!q) return ok('usage: find <name>')
      const hits: string[] = []
      const walk = (n: FsNode, path: string) => {
        const full = path ? `${path}/${n.name}` : n.name
        if (n !== ROOT && n.name.toLowerCase().includes(q.toLowerCase())) hits.push(full)
        if (isDir(n)) n.children.forEach((c) => walk(c, n === ROOT ? '~' : full))
      }
      walk(ROOT, '')
      return ok(hits.length ? hits.join('\n') : `find: no match for "${q}"`)
    },
  },

  echo: {
    usage: 'echo <text|$VAR>', about: 'print text, expanding variables', group: 'system',
    run: (args) => ok(args.map((a) => a.replace(/\$(\w+)/g, (_, k: string) => ENV[k] ?? '')).join(' ')),
  },

  env: {
    usage: 'env', about: 'list environment variables', group: 'system',
    run: () => ok(Object.entries(ENV).map(([k, v]) => `${k}=${v}`).join('\n')),
  },

  whoami: {
    usage: 'whoami', about: 'print the current user', group: 'system',
    run: () => ok(`${profile.name} (${profile.alias}) — ${profile.title} @ ${profile.affiliation}`),
  },

  neofetch: {
    usage: 'neofetch', about: 'system summary', group: 'system',
    run: () => ok([
      `${profile.username}@hunyuan`,
      '─────────────────────────',
      'OS       Linux x86_64',
      `Role     ${profile.title}`,
      `Org      ${profile.affiliation}`,
      `Papers   ${papers.length}`,
      'Cites    900+',
      'Stack    PyTorch · CUDA · Diffusers',
      'Uptime   shipping Hunyuan3D',
    ].join('\n')),
  },

  uname: {
    usage: 'uname [-a]', about: 'print system information', group: 'system',
    run: (args) => ok(args.includes('-a')
      ? 'Darwin hunyuan-mbp 24.5.0 arm64 — but I deploy on Linux.'
      : 'Darwin'),
  },

  date: { usage: 'date', about: 'print the current date', group: 'system', run: () => ok(new Date().toString()) },

  matrix: {
    usage: 'matrix', about: 'toggle the matrix rain', group: 'actions',
    run: () => ({ out: 'wake up, Neo…', effects: [{ type: 'matrix' }] }),
  },

  clear: { usage: 'clear', about: 'clear the screen', group: 'system', run: () => ({ out: '', effects: [{ type: 'clear' }] }) },
  exit: { usage: 'exit', about: 'close the terminal', group: 'system', run: () => ({ out: '', effects: [{ type: 'exit' }] }) },
}

/** Commands offered to Tab-completion and `help`, plus quiet aliases. */
const ALIASES: Record<string, string> = { ll: 'ls -l', quit: 'exit', dir: 'ls', more: 'cat', less: 'cat' }

/** Bare nouns a visitor is likely to type. Rather than silently accepting them
 *  as commands (the old behaviour), we teach the correct shell form. */
const SUGGESTIONS: Record<string, string> = {
  papers: 'cat papers.bib', publications: 'ls publications/', paper: 'ls publications/',
  research: 'ls research/', hunyuan: 'open projects/hunyuan3d', hunyuan3d: 'open projects/hunyuan3d',
  about: 'cat about.md', cv: 'open cv.pdf', resume: 'open cv.pdf',
  contact: 'cat contact.md', email: 'echo $EMAIL', mail: 'echo $EMAIL',
  coffee: 'cat coffee.lock', news: 'cat news.log', stack: 'cat stack.txt',
  experience: 'cat experience.log', education: 'cat education.log',
  github: 'open projects/github', scholar: 'open projects/scholar',
  motto: 'echo $MOTTO', vim: 'cat .vimrc', vimrc: 'cat .vimrc',
}

function helpText() {
  const groups: Record<Cmd['group'], string> = { files: 'FILES', actions: 'ACTIONS', system: 'SYSTEM' }
  const lines: string[] = []
  for (const g of ['files', 'actions', 'system'] as const) {
    const cmds = Object.values(COMMANDS).filter((c) => c.group === g)
    lines.push(groups[g])
    for (const c of cmds) lines.push(`  ${c.usage.padEnd(20)} ${c.about}`)
    lines.push('')
  }
  lines.push('Tab completes commands and paths · ↑ ↓ walks history')
  lines.push('Start with:  ls   ·   cat about.md   ·   tree')
  return lines.join('\n')
}

/* ============================== Entry point ============================== */

export function exec(input: string, cwd: string[]): Result {
  const line = input.trim()
  if (!line) return ok('')

  const expanded = ALIASES[line] ?? line
  const tokens = tokenize(expanded)
  const name = (tokens[0] ?? '').toLowerCase()
  const args = tokens.slice(1)

  if (name === 'help' || name === 'man') {
    const topic = args[0]?.toLowerCase()
    if (topic && COMMANDS[topic]) {
      const c = COMMANDS[topic]
      return ok(`${c.usage}\n    ${c.about}`)
    }
    if (topic) return ok(`No manual entry for ${topic}`)
    return ok(helpText())
  }

  if (name === 'sudo') {
    return ok(`${profile.handle} is not in the sudoers file. This incident will be reported.`)
  }

  if (name === '42') return ok('the answer to life, the universe, and everything.')

  const aliased = ALIASES[name]
  const cmd = COMMANDS[name] ?? (aliased ? COMMANDS[tokenize(aliased)[0]] : undefined)
  if (cmd) return cmd.run(args, cwd)

  // Not a command. If it names something real, teach the correct syntax.
  const suggestion = SUGGESTIONS[name]
  if (suggestion) {
    return ok(`zsh: command not found: ${name}\n\nDid you mean:  ${suggestion}`)
  }
  const here = nodeAt(cwd)
  if (here && isDir(here)) {
    const match = here.children.find((c) => c.name.toLowerCase().startsWith(name))
    if (match) {
      const how = isDir(match) ? `ls ${match.name}/` : match.kind === 'link' ? `open ${match.name}` : `cat ${match.name}`
      return ok(`zsh: command not found: ${name}\n\n${match.name} is a ${match.kind} — did you mean:  ${how}`)
    }
  }
  return ok(`zsh: command not found: ${name} — type \`help\``)
}

/* ============================== Completion ============================== */

const COMMAND_NAMES = [...Object.keys(COMMANDS), 'help', 'man', 'sudo'].sort()

/** Returns the completed line plus any ambiguous candidates to display. */
export function complete(input: string, cwd: string[]): { line: string; candidates: string[] } {
  const trailingSpace = /\s$/.test(input)
  const tokens = tokenize(input)
  const completingNew = trailingSpace || tokens.length === 0
  const head = completingNew ? tokens : tokens.slice(0, -1)
  const frag = completingNew ? '' : tokens[tokens.length - 1] ?? ''

  let pool: string[]
  if (head.length === 0) {
    pool = COMMAND_NAMES
  } else {
    // Complete a path relative to the fragment's own directory.
    const slash = frag.lastIndexOf('/')
    const dirPart = slash >= 0 ? frag.slice(0, slash + 1) : ''
    const namePart = slash >= 0 ? frag.slice(slash + 1) : frag
    const segs = resolvePath(cwd, dirPart || '.')
    const node = segs && nodeAt(segs)
    if (!node || !isDir(node)) return { line: input, candidates: [] }
    pool = node.children
      .filter((c) => (namePart.startsWith('.') ? true : !c.name.startsWith('.')))
      .map((c) => dirPart + c.name + (isDir(c) ? '/' : ''))
  }

  const matches = pool.filter((p) => p.toLowerCase().startsWith(frag.toLowerCase()))
  if (!matches.length) return { line: input, candidates: [] }

  // Longest common prefix, so Tab always makes forward progress.
  let lcp = matches[0]
  for (const m of matches) {
    let i = 0
    while (i < lcp.length && i < m.length && lcp[i].toLowerCase() === m[i].toLowerCase()) i++
    lcp = lcp.slice(0, i)
  }
  const only = matches.length === 1
  const completion = only ? matches[0] + (matches[0].endsWith('/') ? '' : ' ') : lcp
  return {
    line: [...head, completion].join(' ') + (only && !completion.endsWith(' ') && !completion.endsWith('/') ? ' ' : ''),
    candidates: only ? [] : matches,
  }
}

export const WELCOME = [
  `${profile.name} — ${profile.affiliation}`,
  '',
  'This is a real (if small) shell: paths, flags and Tab-completion all work.',
  'Type `help` for commands, or start with `ls`.',
].join('\n')
