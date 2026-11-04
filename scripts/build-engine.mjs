import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const work = resolve(root, '.frameflow-engine')
const upstreamCommit = '5ceeeb388eef5423640b7db157706274bf1b8165'
const repo = 'https://github.com/walterlow/freecut.git'

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    env: { ...process.env, ONNXRUNTIME_NODE_INSTALL_CUDA: 'skip', ...(options.env ?? {}) },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')} (exit ${result.status ?? 'unknown'})`)
  }
}

if (existsSync(work)) rmSync(work, { recursive: true, force: true })
mkdirSync(work, { recursive: true })
run('git', ['init'], { cwd: work })
run('git', ['remote', 'add', 'origin', repo], { cwd: work })
run('git', ['fetch', '--depth', '1', 'origin', upstreamCommit], { cwd: work })
run('git', ['checkout', '--detach', 'FETCH_HEAD'], { cwd: work })

// White-label the upstream app while keeping the original engine and license notice.
const htmlPath = resolve(work, 'index.html')
let html = readFileSync(htmlPath, 'utf8')
html = html
  .replaceAll('FreeCut', 'FRAMEFLOW')
  .replace('lang="en"', 'lang="pt"')
writeFileSync(htmlPath, html)

const logoPath = resolve(work, 'src/components/brand/freecut-logo.tsx')
let logo = readFileSync(logoPath, 'utf8')
logo = logo.replace('>FreeCut</span>', '>FRAMEFLOW</span>')
writeFileSync(logoPath, logo)

const languagePath = resolve(work, 'src/i18n/index.ts')
let language = readFileSync(languagePath, 'utf8')
language = language.replaceAll("'freecut-language'", "'frameflow-language'")
writeFileSync(languagePath, language)

// Open the actual project workspace first; users can create or open a project there.
const homeRoute = resolve(work, 'src/routes/index.tsx')
writeFileSync(homeRoute, `import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <Navigate to="/projects" replace />,
})
`)


function replaceBetween(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker)
  const end = source.indexOf(endMarker, start + startMarker.length)
  if (start < 0 || end < 0) throw new Error(`Could not apply FRAMEFLOW UX patch: ${label}`)
  return source.slice(0, start) + replacement + source.slice(end)
}

// Simplify the projects home: keep only the two actions people need to start.
const projectsPage = resolve(work, 'src/routes/projects/index.lazy.tsx')
let projectsUi = readFileSync(projectsPage, 'utf8')
projectsUi = replaceBetween(
  projectsUi,
  ' <div className="flex items-center gap-3">',
  '            {/* Hidden file input',
  `            <div className="flex items-center gap-2">
              <Button variant="outline" size="lg" className="gap-2 px-4" onClick={handleImportClick}>
                <Upload className="w-4 h-4" />
                Importar projeto
              </Button>
              <Link to="/projects/new">
                <Button size="lg" className="gap-2 px-5">
                  <Plus className="w-4 h-4" />
                  Criar projeto
                </Button>
              </Link>
            </div>`,
  'projects header actions',
)
projectsUi = projectsUi.replace(
  '          <div className="max-w-[1920px] mx-auto px-6 py-8">\\n            <ProjectList',
  '          <div className="max-w-[1920px] mx-auto px-6 py-8">\\n            <div className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">Os meus projetos</h1><p className="mt-1 text-sm text-muted-foreground">Cria um vídeo novo ou continua um projeto guardado.</p></div>\\n            <ProjectList',
)
for (const line of [
  "import { Separator } from '@/components/ui/separator'\\n",
  "import { Plus, Upload, FolderOpen, File, Github, BookOpen } from 'lucide-react'\\n",
  "import { DiscordIcon } from '@/components/brand/discord-icon'\\n",
  "import { DISCORD_INVITE_URL } from '@/config/community'\\n",
  "import { WorkspaceIndicator } from '@/features/workspace-gate'\\n",
  "import { LanguageSwitcher } from '@/shared/ui/language-switcher'\\n",
]) projectsUi = projectsUi.replace(line, '')
writeFileSync(projectsPage, projectsUi)

// Reduce editor toolbar noise while retaining save, export, settings and shortcuts.
const toolbarPath = resolve(work, 'src/features/editor/components/toolbar.tsx')
let toolbar = readFileSync(toolbarPath, 'utf8')
toolbar = replaceBetween(
  toolbar,
  '        {/* Socials */}',
  '        {/* Utility */}',
  '        {/* FRAMEFLOW keeps external community links out of the editing workflow. */}\\n\\n',
  'editor social links',
)
toolbar = toolbar.replace(
  '      <LocalInferenceStatusPill />\\n',
  '',
)
for (const line of [
  "  BookOpen,\\n",
  "  Github,\\n",
  "import { DiscordIcon } from '@/components/brand/discord-icon'\\n",
  "import { DISCORD_INVITE_URL } from '@/config/community'\\n",
  "import { LocalInferenceStatusPill } from './local-inference-status-pill'\\n",
  "import { LanguageSwitcher } from '@/shared/ui/language-switcher'\\n",
]) toolbar = toolbar.replace(line, '')
writeFileSync(toolbarPath, toolbar)

 
// Keep the four everyday tools visible; move specialist panels into one
// clearly labelled "More tools" menu without removing their functionality.
const mediaSidebarPath = resolve(work, 'src/features/editor/components/media-sidebar.tsx')
let mediaSidebar = readFileSync(mediaSidebarPath, 'utf8')
mediaSidebar = mediaSidebar.replace(
  "  WandSparkles,\\n",
  "  WandSparkles,\\n  MoreHorizontal,\\n",
)
mediaSidebar = mediaSidebar.replace(
  "{categories.map(({ id, icon: Icon, label }) => (",
  "{categories.filter(({ id }) => ['media', 'text', 'effects', 'transitions'].includes(id)).map(({ id, icon: Icon, label }) => (",
)
const categoryEnd = `          ))}
        </div>
      </div>

      {/* Content Panel`
const categoryReplacement = `          ))}
          <details className="relative">
            <summary
              aria-label="Mais ferramentas"
              title="Mais ferramentas"
              className="w-9 h-9 list-none cursor-pointer rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <MoreHorizontal className="w-4 h-4" />
            </summary>
            <div className="absolute left-10 bottom-0 z-50 min-w-44 rounded-lg border border-border bg-popover p-1 shadow-xl">
              {categories.filter(({ id }) => !['media', 'text', 'effects', 'transitions'].includes(id)).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveTab(id)
                    if (!leftSidebarOpen) toggleLeftSidebar()
                  }}
                  className={'w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent ' + (activeTab === id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground')}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* Content Panel`
if (!mediaSidebar.includes(categoryEnd)) throw new Error("Could not locate media category rail end")
mediaSidebar = mediaSidebar.replace(categoryEnd, categoryReplacement)
writeFileSync(mediaSidebarPath, mediaSidebar)


// Preserve the upstream MIT notice in the deployed static application.
const licenseTarget = resolve(work, 'public/third-party-licenses')
mkdirSync(licenseTarget, { recursive: true })
cpSync(resolve(work, 'LICENSE'), resolve(licenseTarget, 'FREECUT-MIT-LICENSE.txt'))

run('npm', ['ci'], { cwd: work })
run('npm', ['run', 'build'], { cwd: work })

const upstreamDist = resolve(work, 'dist')
if (!existsSync(upstreamDist)) throw new Error('FreeCut build completed without producing dist/')
const targetDist = resolve(root, 'dist')
if (existsSync(targetDist)) rmSync(targetDist, { recursive: true, force: true })
cpSync(upstreamDist, targetDist, { recursive: true })
console.log('FRAMEFLOW production bundle built from the pinned FreeCut editing engine.')
