import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";
assert.equal(
  process.env.GITHUB_ACTIONS,
  "true",
  "Video rendering is restricted to GitHub Actions.",
);
assert.equal(process.env.RUNNER_ENVIRONMENT, "github-hosted");
assert.equal(process.env.GITHUB_REPOSITORY, "ayaneijaz45-hue/Demo-video-");
const mode = process.env.PRODUCTION_MODE;
assert.ok(["proof", "full-preview"].includes(mode));
assert.equal(
  JSON.parse(readFileSync("production/narration.json", "utf8"))
    .approvedFinalAudioMaster,
  false,
  "This workflow is for previews. Create a separately authorized final-master process when narration is approved.",
);
mkdirSync("out", { recursive: true });
const cli = "node_modules/@remotion/cli/remotion-cli.js";
const run = (args) => {
  const r = spawnSync(process.execPath, [cli, ...args], { stdio: "inherit" });
  assert.equal(r.status, 0, args.join(" "));
};
// Use only filters provided by Remotion's bundled FFmpeg. No system install needed.
const ffmpeg = (args) => run(['ffmpeg', '-y', ...args]);
const started = Date.now();
const common = [
  "--concurrency=2",
  "--codec=h264",
  "--crf=18",
  "--audio-codec=aac",
  "--audio-bitrate=192k",
  "--pixel-format=yuv420p",
];
if (mode === "proof") {
  // Representative transition, two-model comparison, and the most complex creation section.
  run([
    "render",
    "src/index.ts",
    "ModelsSuite",
    "out/review-battle.mp4",
    "--frames=630-749",
    ...common,
  ]);
  run([
    "render",
    "src/index.ts",
    "ModelsSuite",
    "out/review-creation.mp4",
    "--frames=915-1139",
    ...common,
  ]);
  run([
    "render",
    "src/index.ts",
    "ModelsSuite",
    "out/review-transition.mp4",
    "--frames=1170-1259",
    ...common,
  ]);
  for (const f of [95, 270, 495, 735, 960, 1050, 1170, 1335, 1545, 1725])
    run([
      "still",
      "src/index.ts",
      "ModelsSuite",
      `out/frame-${f}.png`,
      `--frame=${f}`,
    ]);
} else {
  run([
    "render",
    "src/index.ts",
    "ModelsSuite",
    "out/raw-preview.mp4",
    ...common,
  ]);
  ffmpeg([
    "-i",
    "out/raw-preview.mp4",
    "-c:v",
    "copy",
    "-af",
    "loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json",
    "-ar",
    "48000",
    "-ac",
    "2",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    "-t",
    "60",
    "out/Models-Suite-60s-visual-preview.mp4",
  ]);
  // Decode at two-second intervals on the runner. The compact build supports scale
  // and single-frame extraction, but intentionally omits fps/tile/ebur128.
  for (let second = 0; second < 60; second += 2) {
    ffmpeg([
      '-ss', String(second), '-i', 'out/Models-Suite-60s-visual-preview.mp4',
      '-vf', 'scale=270:480', '-frames:v', '1',
      `out/review-${String(second).padStart(2,'0')}s.png`,
    ]);
  }
  const probe = spawnSync(
    process.execPath,
    [
      cli,
      'ffprobe',
      "-v",
      "error",
      "-show_streams",
      "-show_format",
      "-of",
      "json",
      "out/Models-Suite-60s-visual-preview.mp4",
    ],
    { encoding: "utf8" },
  );
  assert.equal(probe.status, 0, probe.stderr);
  const metadata = JSON.parse(probe.stdout);
  const v = metadata.streams.find((s) => s.codec_type === "video");
  const a = metadata.streams.find((s) => s.codec_type === "audio");
  assert.equal(v.codec_name, "h264");
  assert.equal(v.width, 1080);
  assert.equal(v.height, 1920);
  assert.equal(v.r_frame_rate, "30/1");
  assert.equal(Number(v.nb_frames), 1800);
  assert.equal(a.codec_name, "aac");
  assert.equal(a.sample_rate, "48000");
  assert.equal(a.channels, 2);
  assert.ok(Math.abs(Number(metadata.format.duration) - 60) < 0.1);
  writeFileSync(
    "out/technical-verification.json",
    JSON.stringify(metadata, null, 2),
  );
}
writeFileSync(
  "out/production-run.json",
  JSON.stringify(
    {
      mode,
      commit: process.env.GITHUB_SHA,
      runId: process.env.GITHUB_RUN_ID,
      elapsedSeconds: (Date.now() - started) / 1000,
      narration: "PENDING — visual preview only",
      width: 1080,
      height: 1920,
      fps: 30,
    },
    null,
    2,
  ),
);
