import { readFile, writeFile, mkdir, readdir, lstat, open } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const source = fileURLToPath(new URL('../', import.meta.url));
const workflows = {
  work: ['vcharn/SKILL.md'],
  how: ['vcharn/references/investigate.md'],
  why: ['vcharn/references/investigate.md'],
  recall: ['vcharn/references/recall.md'],
  architect: ['vcharn/references/design.md'],
  prototype: ['vcharn/references/design.md'],
  plan: ['vcharn/references/plan.md'],
  learn: ['learn-mode/SKILL.md'],
  verify: ['verify-app/SKILL.md'],
  'verify-setup': ['verify-app/SKILL.md', 'verify-app/references/setup.md'],
  maintain: ['verify-app/SKILL.md', 'verify-app/references/maintain.md'],
  write: ['vcharn/references/writing.md'],
  readme: ['readme-craft/SKILL.md'],
};
const help = `vcharn — portable workflows for AI coding agents (Node.js 18+)

vcharn init [--agent generic|claude|cursor|codex|gemini|copilot|all] [--dry-run]
  Install shared instructions, complete skills, and project memory in --root.
  Existing files are preserved; managed instruction blocks are refreshed.
vcharn skills
  List bundled skills and workflow names.
vcharn prompt <workflow> [task...]
  Print instructions for an agent. Does not call an AI service.
vcharn verify init [--dry-run]
  Create a verification config and feature index. Ask an agent to fill them in.
vcharn verify run [check-name] [--dry-run]
  Execute explicitly configured argv commands; save logs and JSON evidence.
vcharn feature add <slug> [--dry-run] | feature list
  Create or list user journeys under .vcharn/features/.
vcharn checkpoint --file <note.md> [--dry-run]
  Save a portable session handoff in .vcharn/memory/.
vcharn recall [query...]
  Search saved handoffs, feature maps, and MAINTAINER_LOG.md locally.
vcharn plan check <plan.json>
  Validate tasks with id, outcome, verify (argv), and expected result.
vcharn doctor
  Check installation and verification readiness without executing commands.

Options: --root <project> (default: current directory), --json, --help, --version
Unknown options fail. No global configuration is changed. See docs/cli.md.`;
const read = file => readFile(file, 'utf8');
async function exists(file) {
  try { await lstat(file); return true; } catch (e) { if (e.code === 'ENOENT') return false; throw e; }
}
function slug(value) {
  if (!value || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw Error('Use a lowercase slug, for example account-settings.');
  return value;
}
function checkConfig(config) {
  if (config.version !== 1 || !Array.isArray(config.checks)) throw Error('verification.json requires version: 1 and a checks array.');
  const names = new Set();
  for (const c of config.checks) {
    slug(c.name);
    if (names.has(c.name)) throw Error(`Duplicate verification check: ${c.name}`);
    names.add(c.name);
    if (!Array.isArray(c.argv) || !c.argv.length || c.argv.some(a => typeof a !== 'string') || !c.argv[0]) throw Error(`${c.name}: argv must be a nonempty array of strings.`);
    if (!['test', 'runtime'].includes(c.kind)) throw Error(`${c.name}: kind must be test or runtime.`);
    if (typeof c.expected !== 'string' || !c.expected.trim()) throw Error(`${c.name}: describe the expected observable result.`);
    if (!Number.isInteger(c.timeoutMs) || c.timeoutMs < 1 || c.timeoutMs > 3600000) throw Error(`${c.name}: timeoutMs must be 1..3600000.`);
  }
  return config;
}

export async function main(args) {
  let json = args.includes('--json');
  try {
    const positional = [];
    let root = process.cwd(), agent = 'generic', dry = false, input;
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (['--root', '--agent', '--file'].includes(a)) {
        const val = args[++i];
        if (!val || val.startsWith('--')) throw Error(`${a} requires a value.`);
        if (a === '--root') root = path.resolve(val);
        if (a === '--agent') agent = val;
        if (a === '--file') input = val;
      } else if (a === '--json') json = true;
      else if (a === '--dry-run') dry = true;
      else if (a === '--help' || a === '-h') { console.log(help); return; }
      else if (a === '--version') { console.log('0.1.0'); return; }
      else if (a.startsWith('-')) throw Error(`Unknown option ${a}. Run vcharn --help.`);
      else positional.push(a);
    }
    const [cmd, sub, ...rest] = positional;
    const emit = value => console.log(json ? JSON.stringify(value, null, 2) : typeof value === 'string' ? value : JSON.stringify(value, null, 2));
    const dir = path.join(root, '.vcharn');
    // Do not follow an existing symlink out of the target project during writes.
    async function safe(file) {
      const relative = path.relative(root, file);
      if (relative.startsWith('..') || path.isAbsolute(relative)) throw Error('Destination must be inside the project.');
      let current = root;
      for (const part of relative.split(path.sep)) {
        current = path.join(current, part);
        if (await exists(current) && (await lstat(current)).isSymbolicLink()) throw Error(`Refusing to write through symlink: ${current}`);
      }
    }
    async function put(file, content) {
      await safe(file);
      const present = await exists(file);
      if (!present && !dry) { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, content, { flag: 'wx' }); }
      return { path: path.relative(root, file), action: present ? 'preserved' : dry ? 'would-create' : 'created' };
    }
    async function tree(from, to, results) {
      for (const entry of await readdir(from, { withFileTypes: true })) {
        if (entry.isDirectory()) await tree(path.join(from, entry.name), path.join(to, entry.name), results);
        else results.push(await put(path.join(to, entry.name), await read(path.join(from, entry.name))));
      }
    }
    async function config() { return checkConfig(JSON.parse(await read(path.join(dir, 'verification.json')))); }
    if (!cmd || cmd === 'help') { console.log(help); return; }
    if (cmd === 'skills') { emit({ skills: await readdir(path.join(source, 'dotfiles/skills')), workflows: Object.keys(workflows) }); return; }
    if (cmd === 'prompt') {
      if (!workflows[sub]) throw Error(`Unknown workflow ${sub || '(missing)'}. Use vcharn skills.`);
      const files = [...new Set(['vcharn/SKILL.md', ...workflows[sub]])];
      const instructions = [];
      for (const f of files) instructions.push({ file: f, content: await read(path.join(source, 'dotfiles/skills', f)) });
      emit(json ? { workflow: sub, task: rest.join(' '), instructions } : `Workflow: ${sub}\nProject: ${root}\n\n${instructions.map(i => i.content).join('\n\n')}\n\nTask: ${rest.join(' ') || '(supply your task)'}\n`);
      return;
    }
    if (cmd === 'init') {
      const adapters = { generic: 'AGENTS.md', codex: 'AGENTS.md', claude: 'CLAUDE.md', cursor: '.cursor/rules/vcharn.mdc', gemini: 'GEMINI.md', copilot: '.github/copilot-instructions.md' };
      if (agent !== 'all' && !adapters[agent]) throw Error(`Unknown agent ${agent}. Choose ${Object.keys(adapters).join(', ')} or all.`);
      const results = [];
      results.push(await put(path.join(dir, 'AGENTS.md'), await read(path.join(source, 'dotfiles/AGENTS.md'))));
      await tree(path.join(source, 'dotfiles/skills'), path.join(dir, 'skills'), results);
      results.push(await put(path.join(dir, 'memory/README.md'), '# Session memory\n\nSave handoffs with `vcharn checkpoint --file note.md`. Record intent, decisions, evidence, unfinished work, and the next step. Exclude secrets and personal transcripts.\n'));
      const files = [...new Set(['AGENTS.md', ...(agent === 'all' ? Object.values(adapters) : [adapters[agent]])])];
      for (const file of files) {
        const target = path.join(root, file);
        await safe(target);
        const old = await exists(target) ? await read(target) : '';
        const start = '<!-- vcharn:start -->', end = '<!-- vcharn:end -->';
        const block = `${start}\nRead and follow \`.vcharn/AGENTS.md\` from the project root. Load only the relevant skills from \`.vcharn/skills/\`.\n${end}`;
        if ((old.includes(start) || old.includes(end)) && (!old.includes(start) || !old.includes(end) || old.indexOf(end) < old.indexOf(start))) throw Error(`${file}: malformed vcharn block; repair it before initializing.`);
        let content = old.includes(start) ? old.slice(0, old.indexOf(start)) + block + old.slice(old.indexOf(end) + end.length) : `${old}${old && !old.endsWith('\n') ? '\n' : ''}\n${block}\n`;
        if (file.endsWith('.mdc') && !old) content = `---\ndescription: vcharn engineering workflows\nalwaysApply: true\n---\n${content}`;
        if (!dry && content !== old) { await mkdir(path.dirname(target), { recursive: true }); await writeFile(target, content); }
        results.push({ path: file, action: content === old ? 'unchanged' : dry ? 'would-update' : 'updated' });
      }
      const ignore = path.join(root, '.gitignore');
      await safe(ignore);
      const previous = await exists(ignore) ? await read(ignore) : '';
      if (!previous.split('\n').includes('/.vcharn/evidence/')) {
        if (!dry) await writeFile(ignore, previous + (previous && !previous.endsWith('\n') ? '\n' : '') + '/.vcharn/evidence/\n');
        results.push({ path: '.gitignore', action: dry ? 'would-update' : 'updated' });
      }
      emit({ agent, dryRun: dry, files: results }); return;
    }
    if (cmd === 'verify' && sub === 'init') {
      emit({ files: [await put(path.join(dir, 'verification.json'), JSON.stringify({ version: 1, checks: [] }, null, 2) + '\n'), await put(path.join(dir, 'features/README.md'), '# Feature map\n\nLink each journey here with its user entry point, prerequisites, control command, expected result, evidence, and known limitations. Populate from observed behavior; an empty map is not verification coverage.\n')] }); return;
    }
    if (cmd === 'verify' && sub === 'run') {
      const c = await config();
      const checks = rest.length ? c.checks.filter(c => c.name === rest[0]) : c.checks;
      if (!checks.length) throw Error('No matching checks. Use vcharn prompt verify-setup to configure real test and runtime commands.');
      if (dry) { emit({ dryRun: true, checks }); return; }
      const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
      const evidence = path.join(dir, 'evidence', id);
      await safe(evidence); await mkdir(evidence, { recursive: true });
      const results = [];
      for (const check of checks) {
        const logfile = path.join(evidence, `${check.name}.log`);
        const handle = await open(logfile, 'wx');
        const started = Date.now();
        let timedOut = false, failure;
        const result = await new Promise(resolve => {
          // No shell interpolation: argv is the exact command being executed.
          const child = spawn(check.argv[0], check.argv.slice(1), { cwd: root, shell: false, stdio: ['ignore', handle.fd, handle.fd], detached: process.platform !== 'win32' });
          const timer = setTimeout(() => {
            timedOut = true;
            try { if (process.platform !== 'win32') process.kill(-child.pid, 'SIGKILL'); else child.kill('SIGKILL'); } catch { /* process already exited */ }
          }, check.timeoutMs);
          child.once('error', error => { failure = error.message; });
          child.once('close', (code, signal) => { clearTimeout(timer); resolve({ code, signal }); });
        });
        await handle.close();
        results.push({ ...check, ...result, passed: result.code === 0 && !timedOut && !failure, timedOut, error: failure, durationMs: Date.now() - started, log: path.relative(root, logfile) });
      }
      const report = { id, createdAt: new Date().toISOString(), passed: results.every(r => r.passed), runtimeExecuted: results.some(r => r.kind === 'runtime'), checks: results, note: 'Exit codes record command outcomes. Inspect assertions and artifacts before claiming the user journey is verified.' };
      await writeFile(path.join(evidence, 'report.json'), JSON.stringify(report, null, 2) + '\n');
      emit({ ...report, report: path.relative(root, path.join(evidence, 'report.json')) });
      if (!report.passed) process.exitCode = 1;
      return;
    }
    if (cmd === 'feature' && sub === 'add') {
      const name = slug(rest[0]);
      emit(await put(path.join(dir, 'features', `${name}.md`), `# ${name}\n\n## User outcome\n\n## Entry point and prerequisites\n\n## Control commands\n\n## Expected observations and evidence\n\n## Failure paths and recovery\n\n## Source files and last verified revision\n\n## Limitations\n`)); return;
    }
    if (cmd === 'feature' && sub === 'list') {
      emit(await exists(path.join(dir, 'features')) ? await readdir(path.join(dir, 'features')) : []); return;
    }
    if (cmd === 'checkpoint') {
      if (!input) throw Error('Provide --file <note.md> with the handoff to save.');
      const note = await read(path.resolve(root, input));
      if (!note.trim()) throw Error('Handoff must not be empty.');
      emit(await put(path.join(dir, 'memory', `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}.md`), note)); return;
    }
    if (cmd === 'recall') {
      const query = positional.slice(1).join(' ').toLowerCase();
      const files = [];
      async function collect(folder) {
        if (!await exists(folder) || (await lstat(folder)).isSymbolicLink()) return;
        for (const entry of await readdir(folder, { withFileTypes: true })) {
          const file = path.join(folder, entry.name);
          if (entry.isDirectory()) await collect(file);
          else if (entry.isFile() && file.endsWith('.md')) files.push(file);
        }
      }
      await collect(path.join(dir, 'memory')); await collect(path.join(dir, 'features'));
      const ledger = path.join(root, 'MAINTAINER_LOG.md');
      if (await exists(ledger) && !(await lstat(ledger)).isSymbolicLink()) files.push(ledger);
      const matches = [];
      for (const file of files.sort()) {
        const lines = (await read(file)).split('\n');
        lines.forEach((text, i) => { if (text.trim() && (!query || text.toLowerCase().includes(query))) matches.push({ file: path.relative(root, file), line: i + 1, text }); });
      }
      emit({ query, matches }); return;
    }
    if (cmd === 'plan' && sub === 'check') {
      if (!rest[0]) throw Error('Provide a plan.json path. See docs/cli.md for the schema.');
      const plan = JSON.parse(await read(path.resolve(root, rest[0])));
      if (!Array.isArray(plan.tasks) || !plan.tasks.length) throw Error('Plan requires a nonempty tasks array.');
      const ids = new Set();
      for (const t of plan.tasks) {
        slug(t.id);
        if (ids.has(t.id)) throw Error(`Duplicate task id: ${t.id}`);
        ids.add(t.id);
        if (![t.outcome, t.expected].every(v => typeof v === 'string' && v.trim()) || !Array.isArray(t.verify) || !t.verify.length || t.verify.some(v => typeof v !== 'string') || !t.verify[0]) throw Error(`${t.id}: provide outcome, expected, and verify as a nonempty argv array.`);
      }
      emit({ valid: true, tasks: plan.tasks.length, note: 'Structure validated; no commands executed and no proof of correctness implied.' }); return;
    }
    if (cmd === 'doctor') {
      const checks = [];
      for (const file of ['AGENTS.md', '.vcharn/AGENTS.md', '.vcharn/skills/vcharn/SKILL.md', '.vcharn/skills/learn-mode/SKILL.md', '.vcharn/skills/verify-app/SKILL.md', '.vcharn/features/README.md']) checks.push({ name: file, passed: await exists(path.join(root, file)) });
      try {
        const c = await config();
        checks.push({ name: 'configured-checks', passed: c.checks.length > 0 });
        checks.push({ name: 'runtime-check', passed: c.checks.some(c => c.kind === 'runtime') });
      } catch (e) { checks.push({ name: 'verification-config', passed: false, detail: e.message }); }
      const ready = checks.every(c => c.passed);
      emit({ ready, checks, next: ready ? 'Inspect feature coverage and run vcharn verify run.' : 'Run vcharn init, vcharn verify init, then use the verify-setup workflow. No application commands were executed.' });
      if (!ready) process.exitCode = 1;
      return;
    }
    throw Error(`Unknown command: ${positional.join(' ')}. Run vcharn --help.`);
  } catch (error) {
    console.error(json ? JSON.stringify({ error: error.message }) : `vcharn: ${error.message}`);
    process.exitCode = 1;
  }
}
