import { spawnSync } from 'node:child_process'

function run(command, args, cwd = process.cwd()) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ONNXRUNTIME_NODE_INSTALL_CUDA: 'skip' },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const engine = '.frameflow-engine'
run('git', ['clone', '--depth', '1', 'https://github.com/walterlow/freecut.git', engine])
run('npm', ['ci'], engine)
run('npm', ['run', 'dev', '--', '--host', '0.0.0.0'], engine)
