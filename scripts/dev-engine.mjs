import { spawnSync } from 'node:child_process'
const result = spawnSync('git', ['clone', '--depth', '1', 'https://github.com/walterlow/freecut.git', '.frameflow-engine'], { stdio: 'inherit' })
if (result.status !== 0) process.exit(result.status ?? 1)
console.log('FreeCut source cloned to .frameflow-engine. Run npm install and npm run dev inside that directory.')
