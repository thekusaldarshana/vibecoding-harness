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

test('home init scaffolds data; install renders rulebook, links, and never replaces real files', async t => {
  const data = await project(t), home = await project(t);
  const runHome = (...args) => {
    const r = spawnSync(process.execPath, [cli, 'home', ...args, '--data', data, '--json'], { encoding: 'utf8', env: { ...process.env, VCHARN_HOME_DIR: home } });
    return { status: r.status, data: JSON.parse(r.stdout || r.stderr) };
  };
  assert.equal(runHome('install').status, 1);
  assert.equal(runHome('init', '--dry-run').status, 0);
  assert.deepEqual(await readdir(data), []);
  assert.equal(runHome('init').status, 0);
  await writeFile(path.join(data, 'vcharn-home.json'), JSON.stringify({ version: 1, vars: { YOUR_NAME: 'Ada', YOUR_LANGUAGES: 'Rust, Go' } }));
  await writeFile(path.join(data, 'rules.md'), '# Personal\nUse metric units.\n');
  assert.equal(runHome('install', '--dry-run').status, 0);
  assert.deepEqual(await readdir(home), ['.vcharn']);
  assert.deepEqual(await readdir(path.join(home, '.vcharn')), ['home.json']);
  assert.equal(runHome('install').status, 0);
  const rulebook = await readFile(path.join(home, '.claude/CLAUDE.md'), 'utf8');
  assert.ok(rulebook.includes('# Personal\nUse metric units.'));
  assert.ok(rulebook.includes('Ada') && rulebook.includes('(currently: Rust, Go)') && !rulebook.includes('{{'));
  assert.equal(await readFile(path.join(home, '.codex/AGENTS.md'), 'utf8'), rulebook);
  assert.ok(await readFile(path.join(home, '.agents/skills/vcharn/SKILL.md'), 'utf8'));
  assert.ok(await readFile(path.join(home, 'dev-knowledge/index.md'), 'utf8'));
  assert.ok(runHome('install').data.files.slice(1).every(f => f.action === 'unchanged'));
  await rm(path.join(home, '.claude/skills/learn-mode'));
  await mkdir(path.join(home, '.claude/skills/learn-mode'));
  await writeFile(path.join(home, '.claude/skills/learn-mode/SKILL.md'), 'Mine');
  const conflict = runHome('install');
  assert.equal(conflict.status, 1);
  assert.ok(conflict.data.files.some(f => f.action === 'skipped-real-file'));
  assert.equal(await readFile(path.join(home, '.claude/skills/learn-mode/SKILL.md'), 'utf8'), 'Mine');
});

test('home defaults to ~/.vcharn/data and remembers a chosen data folder', async t => {
  const home = await project(t), chosen = await project(t);
  const runHome = (...args) => {
    const r = spawnSync(process.execPath, [cli, 'home', ...args, '--json'], { encoding: 'utf8', env: { ...process.env, VCHARN_HOME_DIR: home } });
    return { status: r.status, data: JSON.parse(r.stdout || r.stderr) };
  };
  assert.equal(runHome('init').data.data, path.join(home, '.vcharn/data'));
  const starter = JSON.parse(await readFile(path.join(home, '.vcharn/data/vcharn-home.json'), 'utf8'));
  assert.deepEqual(Object.keys(starter.vars).sort(), ['YOUR_LANGUAGES', 'YOUR_NAME']);
  assert.match(runHome('install').data.error, /YOUR_NAME/);
  await writeFile(path.join(home, '.vcharn/data/vcharn-home.json'), JSON.stringify({ version: 1, vars: { YOUR_NAME: 'Ada', YOUR_LANGUAGES: 'Go' }, agents: [{ name: 'gemini', rulebook: '.gemini/GEMINI.md' }] }));
  assert.equal(runHome('install').status, 0);
  assert.ok((await readFile(path.join(home, '.gemini/GEMINI.md'), 'utf8')).includes('(currently: Go)'));
  assert.ok(!(await readdir(home)).includes('.claude'));
  assert.equal(runHome('init', '--data', chosen).status, 0);
  assert.equal(JSON.parse(await readFile(path.join(home, '.vcharn/home.json'), 'utf8')).data, chosen);
  await writeFile(path.join(chosen, 'vcharn-home.json'), JSON.stringify({ version: 1, vars: { YOUR_NAME: 'Ada', YOUR_LANGUAGES: 'Go' } }));
  assert.equal(runHome('install').data.data, chosen);
});

test('home init --from clones a personal data repo into ~/.vcharn/data', async t => {
  const home = await project(t), repo = await project(t);
  const git = (...a) => assert.equal(spawnSync('git', ['-C', repo, ...a], { encoding: 'utf8' }).status, 0);
  git('init', '-q');
  await writeFile(path.join(repo, 'vcharn-home.json'), JSON.stringify({ version: 1, vars: { YOUR_NAME: 'Ada', YOUR_LANGUAGES: 'Rust' } }));
  await mkdir(path.join(repo, 'dev-knowledge'));
  await writeFile(path.join(repo, 'dev-knowledge/index.md'), '# My notes\n');
  git('add', '-A');
  git('-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-qm', 'data');
  const runHome = (...args) => {
    const r = spawnSync(process.execPath, [cli, 'home', ...args, '--json'], { encoding: 'utf8', env: { ...process.env, VCHARN_HOME_DIR: home } });
    return { status: r.status, data: JSON.parse(r.stdout || r.stderr) };
  };
  assert.equal(runHome('init', '--from', repo, '--dry-run').status, 0);
  assert.deepEqual(await readdir(home), []);
  const init = runHome('init', '--from', repo);
  assert.equal(init.status, 0);
  assert.equal(init.data.files[0].action, 'cloned');
  const data = path.join(home, '.vcharn/data');
  assert.equal(await readFile(path.join(data, 'dev-knowledge/index.md'), 'utf8'), '# My notes\n');
  assert.ok(await readFile(path.join(data, '.git/HEAD'), 'utf8'));
  assert.equal(runHome('init', '--from', repo).status, 1);
  assert.equal(runHome('install').status, 0);
  assert.ok((await readFile(path.join(home, '.claude/CLAUDE.md'), 'utf8')).includes('(currently: Rust)'));
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
