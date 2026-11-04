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
