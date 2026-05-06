/* eslint-disable */
module.exports = async function () {
  const procs = globalThis.__E2E_PROCS__ ?? [];
  for (const p of procs) {
    if (!p.killed) p.kill('SIGTERM');
  }
  await new Promise((r) => setTimeout(r, 500));
  for (const p of procs) {
    if (!p.killed) p.kill('SIGKILL');
  }
};
