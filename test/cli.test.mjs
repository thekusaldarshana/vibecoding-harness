import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, symlink, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cli = fileURLToPath(new URL('../bin/vcharn.mjs', import.meta.url));
async function project(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'vcharn-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}
function run(root, ...args) {
  const r = spawnSync(process.execPath, [cli, ...args, '--root', root, '--json'], { encoding: 'utf8' });
  return { status: r.status, data: JSON.parse(r.stdout || r.stderr) };
}
async function config(root, checks) {
  await mkdir(path.join(root, '.vcharn'), { recursive: true });
  await writeFile(path.join(root, '.vcharn/verification.json'), JSON.stringify({ version: 1, checks }));
}
const check = (name, code, extra = {}) => ({ name, argv: [process.execPath, '-e', code], kind: 'runtime', expected: 'Assertion holds', timeoutMs: 5000, ...extra });

test('init dry run, preservation, adapters, and idempotent managed blocks', async t => {
  const root = await project(t);
  await writeFile(path.join(root, 'AGENTS.md'), '# Existing rules\nKeep me.\n');
  assert.equal(run(root, 'init', '--agent', 'all', '--dry-run').status, 0);
  assert.deepEqual((await readdir(root)).sort(), ['AGENTS.md']);
  assert.equal(run(root, 'init', '--agent', 'all').status, 0);
  const first = await readFile(path.join(root, 'AGENTS.md'), 'utf8');
  assert.ok(first.startsWith('# Existing rules\nKeep me.\n'));
  assert.equal(run(root, 'init', '--agent', 'all').status, 0);
  assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), first);
  for (const f of ['CLAUDE.md', 'GEMINI.md', '.github/copilot-instructions.md', '.cursor/rules/vcharn.mdc', '.vcharn/skills/readme-craft/scripts/check-readme.mjs', '.vcharn/skills/verify-app/references/setup.md']) assert.ok(await readFile(path.join(root, f), 'utf8'));
  const custom = path.join(root, '.vcharn/skills/learn-mode/SKILL.md');
  await writeFile(custom, 'Customized lesson');
  run(root, 'init');
  assert.equal(await readFile(custom, 'utf8'), 'Customized lesson');
});

test('init refuses instruction and skill symlinks', async t => {
  const root = await project(t), other = await project(t);
  await writeFile(path.join(other, 'rules.md'), 'Protected');
  await symlink(path.join(other, 'rules.md'), path.join(root, 'AGENTS.md'));
  assert.equal(run(root, 'init').status, 1);
  assert.equal(await readFile(path.join(other, 'rules.md'), 'utf8'), 'Protected');
  const another = await project(t);
  await symlink(other, path.join(another, '.vcharn'));
  assert.equal(run(another, 'init').status, 1);
});

test('verification records failures, spawn errors, timeout, and real evidence', async t => {
  const root = await project(t);
  await config(root, [check('pass', 'console.log("observed")'), check('fail', 'process.exit(7)'), check('missing', '', { argv: ['vcharn-command-does-not-exist'] }), check('timeout', 'setInterval(() => {}, 1000)', { timeoutMs: 100 })]);
  const result = run(root, 'verify', 'run');
  assert.equal(result.status, 1);
  assert.deepEqual(result.data.checks.map(c => c.passed), [true, false, false, false]);
  assert.equal(result.data.checks[1].code, 7);
  assert.equal(result.data.checks[3].timedOut, true);
  assert.match(await readFile(path.join(root, result.data.checks[0].log), 'utf8'), /observed/);
  assert.equal(JSON.parse(await readFile(path.join(root, result.data.report), 'utf8')).passed, false);
  const selected = run(root, 'verify', 'run', 'pass');
  assert.equal(selected.status, 0);
  assert.equal(selected.data.checks.length, 1);
});

test('dry run never executes commands; literal argv does not expand shell code', async t => {
  const root = await project(t);
  await config(root, [check('write', 'require("fs").writeFileSync("executed", "yes")')]);
  assert.equal(run(root, 'verify', 'run', '--dry-run').status, 0);
  assert.deepEqual((await readdir(root)).sort(), ['.vcharn']);
  await config(root, [check('literal', '', { argv: [process.execPath, '-e', 'console.log(process.argv[1])', '$(touch executed); `touch executed`'] })]);
  assert.equal(run(root, 'verify', 'run').status, 0);
  assert.ok(!(await readdir(root)).includes('executed'));
});

test('empty and malformed config do not pass; doctor requires runtime readiness', async t => {
  const root = await project(t);
  run(root, 'init'); run(root, 'verify', 'init');
  assert.equal(run(root, 'verify', 'run').status, 1);
  assert.equal(run(root, 'doctor').data.ready, false);
  await config(root, [check('test', '', { kind: 'test' })]);
  assert.equal(run(root, 'doctor').status, 1);
  await config(root, [check('runtime', '')]);
  assert.equal(run(root, 'doctor').status, 0);
  await config(root, [check('invalid', '', { timeoutMs: -1 })]);
  assert.equal(run(root, 'verify', 'run').status, 1);
});

test('portable memory, feature paths, prompt routing, and plan validation', async t => {
  const root = await project(t);
  run(root, 'verify', 'init');
  assert.equal(run(root, 'feature', 'add', '../../escape').status, 1);
  assert.equal(run(root, 'feature', 'add', 'settings').status, 0);
  await writeFile(path.join(root, 'handoff.md'), '# Intent\nInvestigate virtualization jitter.\n');
  assert.equal(run(root, 'checkpoint', '--file', 'handoff.md').status, 0);
  const recalled = run(root, 'recall', 'virtualization');
  assert.equal(recalled.data.matches.length, 1);
  assert.equal(recalled.data.matches[0].line, 2);
  const prompt = run(root, 'prompt', 'how', 'virtualization');
  assert.equal(prompt.data.task, 'virtualization');
  assert.ok(prompt.data.instructions.some(i => i.file.endsWith('investigate.md')));
  await writeFile(path.join(root, 'plan.json'), JSON.stringify({ tasks: [{ id: 'exercise-cli', outcome: 'CLI works', verify: ['vcharn', '--help'], expected: 'Usage printed' }] }));
  assert.equal(run(root, 'plan', 'check', 'plan.json').status, 0);
  await writeFile(path.join(root, 'plan.json'), '{"tasks":[{"id":"missing-proof"}]}');
  assert.equal(run(root, 'plan', 'check', 'plan.json').status, 1);
  assert.equal(run(root, '--unknown').status, 1);
});
