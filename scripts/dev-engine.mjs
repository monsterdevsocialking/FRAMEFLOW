import { spawnSync } from 'node:child_process'

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, ONNXRUNTIME_NODE_INSTALL_CUDA: 'skip' },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run('git', ['clone', '--depth', '1', 'https://github.com/walterlow/freecut.git', '.frameflow-engine'])
run('npm', ['ci'], { cwd: '.frameflow-engine' })
run('npm', ['run', 'dev', '--', '--host', '0.0.0.0'], { cwd: '.frameflow-engine' })
