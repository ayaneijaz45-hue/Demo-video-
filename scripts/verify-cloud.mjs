import assert from "node:assert/strict";
import { cpus, totalmem, platform, arch } from "node:os";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { openBrowser } from "@remotion/renderer";

assert.equal(
  process.env.GITHUB_ACTIONS,
  "true",
  "Run this check only in GitHub Actions",
);
assert.equal(process.env.RUNNER_ENVIRONMENT, "github-hosted");
assert.equal(process.env.GITHUB_REPOSITORY, "ayaneijaz45-hue/Demo-video-");
assert.equal(platform(), "linux");
assert.equal(arch(), "x64");
assert.equal(process.versions.node.split(".")[0], "24");
assert.ok(
  cpus().length >= 4,
  "Expected the public standard runner with at least 4 vCPUs",
);
// Guest-visible RAM can be lower than the advertised 16 GB.
assert.ok(totalmem() >= 14 * 1024 ** 3, "Expected approximately 16 GB RAM");

// Launch and close an empty browser: no compositions, frames, screenshots or video.
const browser = await openBrowser("chrome", { logLevel: "info" });
await browser.close({ silent: true });

const report = {
  repository: process.env.GITHUB_REPOSITORY,
  commit: process.env.GITHUB_SHA,
  runId: process.env.GITHUB_RUN_ID,
  node: process.version,
  os: platform(),
  architecture: arch(),
  runner: process.env.RUNNER_ENVIRONMENT,
  cpuCount: cpus().length,
  memoryGiB: Number((totalmem() / 1024 ** 3).toFixed(2)),
  browserLaunch: "PASS",
  actualVideoRendering: "NOT TESTED",
};
await mkdir("verification", { recursive: true });
await writeFile(
  "verification/environment.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    "Environment and empty browser launch: PASS. No video was generated or rendered. Actual rendering: NOT TESTED.\n",
  );
}
