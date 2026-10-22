// Phase 5 preparation: never renders by default; all media work is cloud-only.
import { readFileSync, writeFileSync, existsSync, mkdirSync, realpathSync, copyFileSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const configPath = "production/first-reveal/audio-integration.json";
export const hashFile = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
export function assetPath(root, name) {
  assert.equal(typeof name, "string");
  assert.ok(name && !isAbsolute(name) && !name.includes("\\") && !name.includes(":"), "Use relative asset paths");
  const p = resolve(root, name);
  const rel = relative(resolve(root), p);
  assert.ok(rel && !rel.startsWith("..") && !isAbsolute(rel), "Asset escapes staging directory");
  if (existsSync(p)) {
    const realRel = relative(realpathSync(root), realpathSync(p));
    assert.ok(realRel && !realRel.startsWith("..") && !isAbsolute(realRel), "Asset symlink escapes staging directory");
  }
  return p;
}
export function validateConfig(c) {
  assert.equal(c.durationSeconds, 30);
  assert.equal(c.fps, 30, "Full 60 FPS master remains untested");
  assert.equal(c.narration.playbackRate, 1);
  assert.equal(c.music.loop, false);
  assert.equal(c.narration.offsetSeconds, 0, "Reinspect the 351 ms margin before changing the offset");
  assert.ok(c.cues.length > 0 && c.cues.length <= 14);
  assert.equal(new Set(c.cues.map((x) => x.id)).size, c.cues.length);
  for (const x of c.cues) {
    assert.ok(c.sfx[x.asset], `Unknown asset ${x.asset}`);
    assert.ok(Number.isFinite(x.startSeconds) && Number.isFinite(x.endSeconds));
    assert.ok(x.startSeconds >= 0 && x.endSeconds <= 30 && x.endSeconds > x.startSeconds);
    assert.ok(Number.isFinite(x.gainDb) && x.gainDb <= 0 && x.gainDb >= -60);
  }
  for (const x of [c.narration, c.music, ...Object.values(c.sfx)]) {
    assert.ok(Number.isFinite(x.gainDb) && x.gainDb <= 12 && x.gainDb >= -60);
  }
}
function run(tool, args, capture = false) {
  const r = spawnSync(tool, args, { encoding: "utf8", stdio: capture ? "pipe" : "inherit", maxBuffer: 20 * 1024 * 1024 });
  if (r.error || r.status !== 0) throw new Error(`${tool} failed: ${r.error?.message || r.stderr || r.status}`);
  return capture ? r.stdout : r;
}
function probe(p) {
  const d = JSON.parse(run("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", p], true));
  const a = d.streams.filter((s) => s.codec_type === "audio");
  assert.equal(a.length, 1, "Expected one audio stream");
  assert.ok(!d.streams.some((s) => s.codec_type === "video"), "Supply audio-only assets");
  const seconds = Number(d.format.duration);
  assert.ok(Number.isFinite(seconds) && seconds > 0, "Invalid audio duration");
  assert.ok([1, 2].includes(a[0].channels), "Use mono or stereo source assets");
  return { seconds, sampleRate: Number(a[0].sample_rate), channels: a[0].channels, codec: a[0].codec_name };
}
function cloudOnly() {
  assert.equal(process.env.GITHUB_ACTIONS, "true", "Media processing is GitHub cloud-only");
  assert.equal(process.env.RUNNER_ENVIRONMENT, "github-hosted");
  assert.equal(process.env.GITHUB_REPOSITORY, "ayaneijaz45-hue/Demo-video-");
}
function checkAssets(c, root, master) {
  const required = master ? [c.approvedMix.path]
    : [c.narration.path, c.music.path, ...Object.values(c.sfx).map((x) => x.path), "rights/rights.json"];
  const issues = required.filter((p) => !existsSync(assetPath(root, p))).map((p) => `Missing: ${p}`);
  if (!c.review.narrationTimingReviewed) issues.push("Narration phrase boundaries and 29.649 s file not inspected in this project");
  if (!c.review.cueTimingReviewed) issues.push("Cues not conformed to the supplied speech/music");
  if (!c.review.rightsApproved) issues.push("Music/SFX promotional and advertising rights not reviewed");
  if (!c.review.visualsApproved) issues.push("Visual approval missing");
  if (!Number.isFinite(c.music.trimStartSeconds) || c.music.trimStartSeconds < 0) issues.push("Music in-point not selected");
  if (master && !c.review.finalExportApproved) issues.push("Final export not approved");
  if (master && !/^[a-f0-9]{64}$/.test(c.approvedMix.sha256 || "")) issues.push("Exact approved stereo mix SHA-256 missing");
  if (!master && existsSync(assetPath(root, "rights/rights.json"))) {
    const rights = JSON.parse(readFileSync(assetPath(root, "rights/rights.json"), "utf8"));
    for (const key of ["narration", "music", ...Object.keys(c.sfx)]) {
      const r = rights.assets?.[key];
      if (!r?.source || !r?.evidence || r.promotionalUseApproved !== true || r.paidAdvertisingUseApproved !== true)
        issues.push(`Incomplete rights evidence: ${key}`);
    }
  }
  return issues;
}
export function buildMixArgs(c, root, output) {
  const cues = c.cues.filter((x) => x.enabled);
  const args = ["-hide_banner", "-y", "-i", assetPath(root, c.narration.path), "-i", assetPath(root, c.music.path)];
  for (const q of cues) args.push("-i", assetPath(root, c.sfx[q.asset].path));
  const f = [
    `[0:a]aresample=48000,aformat=channel_layouts=stereo,asetpts=PTS-STARTPTS,volume=${c.narration.gainDb}dB,apad,atrim=duration=30,asplit=2[voice][detector]`,
    `[1:a]atrim=start=${c.music.trimStartSeconds}:duration=30,asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume=${c.music.gainDb}dB,afade=t=in:st=0:d=0.5,afade=t=out:st=28.5:d=1.5[music]`,
    `[music][detector]sidechaincompress=threshold=0.03:ratio=3:attack=15:release=250:makeup=1[bed]`,
  ];
  cues.forEach((q, i) => {
    const d = q.endSeconds - q.startSeconds;
    f.push(`[${i + 2}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=duration=${d},volume=${q.gainDb + c.sfx[q.asset].gainDb}dB,afade=t=in:st=0:d=0.005,afade=t=out:st=${Math.max(0, d - 0.07)}:d=0.07,adelay=${Math.round(q.startSeconds * 1000)}:all=1[fx${i}]`);
  });
  f.push(`[voice][bed]${cues.map((_, i) => `[fx${i}]`).join("")}amix=inputs=${2 + cues.length}:duration=longest:normalize=0,apad,atrim=duration=30,alimiter=limit=0.841395:level=false:latency=true[mix]`);
  return [...args, "-filter_complex", f.join(";"), "-map", "[mix]", "-ar", "48000", "-ac", "2", "-c:a", "pcm_s24le", output];
}
function measure(p, output) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-i", p, "-map", "0:a:0", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  assert.equal(r.status, 0, r.stderr);
  const blocks = r.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/gs);
  assert.ok(blocks?.length, "Loudness measurement missing");
  const d = JSON.parse(blocks.at(-1));
  writeFileSync(output, JSON.stringify(d, null, 2));
  return { integrated: Number(d.input_i), truePeak: Number(d.input_tp) };
}
export function main(mode = process.argv[2] || "preflight") {
  assert.ok(["preflight", "mix-review", "master"].includes(mode));
  const c = JSON.parse(readFileSync(configPath, "utf8"));
  validateConfig(c);
  const root = resolve("production/first-reveal/audio-assets");
  const out = "out/first-reveal-audio";
  mkdirSync(out, { recursive: true });
  const masterInputs = mode === "master" || (mode === "preflight" && process.env.AUDIO_MODE === "master");
  const issues = checkAssets(c, root, masterInputs);
  const report = { mode, configuration: "VALID", assetsReady: issues.length === 0, missingOrPending: issues, masterMissingOrPending: checkAssets(c, root, true), userSuppliedNarrationDurationSeconds: 29.649, narrationFileInspected: c.narration.fileInspectedHere === true, videoExported: false };
  writeFileSync(`${out}/readiness.json`, JSON.stringify(report, null, 2));
  if (mode === "preflight") { console.log(JSON.stringify(report, null, 2)); return; }
  cloudOnly();
  assert.equal(issues.length, 0, issues.join("\n"));
  if (mode === "mix-review") {
    const narration = probe(assetPath(root, c.narration.path));
    assert.ok(Math.abs(narration.seconds - 29.649) <= 0.08, "Narration differs from 29.649 s; inspect encoder padding and actual decoded speech before proceeding");
    assert.ok(narration.seconds <= 30, "Narration must not be cut or sped up");
    const music = probe(assetPath(root, c.music.path));
    assert.ok(music.seconds >= c.music.trimStartSeconds + 30 - 0.01, "Select a complete 30 s music range; no automatic loop");
    for (const a of Object.values(c.sfx)) probe(assetPath(root, a.path));
    report.narrationMetadata = narration;
    const p = `${out}/FirstReveal-DRAFT-mix-review.wav`;
    if (c.audioReviewEdit) {
      // Reproduce the conformed review, never fall back to the original unsynchronized speech.
      run("ffmpeg", ["-hide_banner", "-y", "-i", assetPath(root, c.narration.path), "-ar", "48000", "-c:a", "pcm_s24le", assetPath(root, "narration/narration-working.wav")]);
      run("python", ["scripts/first-reveal-review.py", "--audio-only-review"]);
      copyFileSync(assetPath(root, "review/ModelsSuiteFirstReveal-AUDIO-REVIEW-v1.wav"), p);
    } else {
      run("ffmpeg", buildMixArgs(c, root, p));
    }
    report.draftMix = { file: p, sha256: hashFile(p), loudness: measure(p, `${out}/draft-loudness.json`) };
    report.status = "DRAFT ONLY — listen and master/approve before final export";
  } else {
    assert.equal(process.env.FINAL_EXPORT_CONFIRMATION, "MASTER_APPROVED", "Explicit manual master dispatch required");
    const mixPath = assetPath(root, c.approvedMix.path);
    assert.equal(hashFile(mixPath), c.approvedMix.sha256, "Mix changed since approval");
    const mix = probe(mixPath);
    assert.ok(Math.abs(mix.seconds - 30) <= 1 / 48000 + 0.00001, "Approved mix must be exactly 30 s");
    assert.equal(mix.channels, 2); assert.equal(mix.sampleRate, 48000);
    assert.ok(mix.codec.startsWith("pcm_"), "Supply a lossless PCM WAV mix");
    const loudness = measure(mixPath, `${out}/approved-mix-loudness.json`);
    assert.ok(loudness.integrated >= -17 && loudness.integrated <= -15 && loudness.truePeak <= -1.5, "Review master loudness/headroom: target -16 LUFS ±1, true peak <= -1.5 dBTP");
    const props = `${out}/silent-visual-props.json`;
    writeFileSync(props, JSON.stringify({ targetFps: 30, narrationFile: null, musicFile: null, sfxFile: null }));
    // Final mastering uses only the approved mix. Never layer stems on top of it.
    run(process.execPath, ["node_modules/@remotion/cli/remotion-cli.js", "render", "src/index.ts", "ModelsSuiteFirstReveal", `${out}/visual-only.mp4`, `--props=${props}`, "--codec=h264", "--video-bitrate=10M", "--max-rate=12M", "--buffer-size=20M", "--x264-preset=slow", "--pixel-format=yuv420p", "--gl=swangle", "--concurrency=1", "--timeout=120000", "--muted"]);
    const visual = JSON.parse(run("ffprobe", ["-v", "error", "-show_streams", "-of", "json", `${out}/visual-only.mp4`], true));
    assert.equal(visual.streams.length, 1, "Visual render must contain exactly one video stream and no soundtrack");
    assert.equal(visual.streams[0].codec_type, "video");
    const candidate = `${out}/FirstReveal-CANDIDATE.mp4`;
    const attribution = "Music: Rising by Johannes Weber, Sina Nitzsche and Fachhochschule Dortmund. CC BY 4.0 https://creativecommons.org/licenses/by/4.0/ Source: https://www.orca.nrw/oer/oer-erstellen/oer-tracks/ Changes: 40-70 second excerpt, EQ, fades, ducking and mixing with narration and sound effects.";
    run("ffmpeg", ["-hide_banner", "-y", "-i", `${out}/visual-only.mp4`, "-i", mixPath, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-ac", "2", "-t", "30", "-metadata", "title=Models Suite - The First Reveal", "-metadata", `comment=${attribution}`, "-movflags", "+faststart", candidate]);
    const encoded = measure(candidate, `${out}/encoded-aac-loudness.json`);
    assert.ok(encoded.integrated >= -17 && encoded.integrated <= -15 && encoded.truePeak <= -1, "AAC peaks/loudness require another audio review");
    const metadata = JSON.parse(run("ffprobe", ["-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", candidate], true));
    const v = metadata.streams.find((s) => s.codec_type === "video");
    const a = metadata.streams.find((s) => s.codec_type === "audio");
    assert.equal(v.codec_name, "h264"); assert.equal(v.width, 1080); assert.equal(v.height, 1920);
    assert.equal(v.nb_read_frames, "900"); assert.equal(v.avg_frame_rate, "30/1");
    assert.equal(a.codec_name, "aac"); assert.equal(a.sample_rate, "48000"); assert.equal(a.channels, 2);
    assert.ok(Math.abs(Number(metadata.format.duration) - 30) <= 0.04);
    assert.equal(metadata.streams.length, 2, "Exactly one video and one audio stream required");
    assert.equal(a.start_time, "0.000000");
    assert.equal(Number(a.duration), 30);
    run("ffmpeg", ["-v", "error", "-i", candidate, "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"]);
    // Copy to the public deliverable name only after technical checks pass.
    copyFileSync(candidate, `${out}/ModelsSuiteFirstReveal-MASTER.mp4`);
    report.videoExported = true; report.status = "TECHNICAL CHECKS PASSED — final human playback review still required";
    report.encodedLoudness = encoded;
    report.approvedMixSha256 = hashFile(mixPath);
    report.masterSha256 = hashFile(`${out}/ModelsSuiteFirstReveal-MASTER.mp4`);
    report.sourceCommit = process.env.GITHUB_SHA;
    report.runId = process.env.GITHUB_RUN_ID;
    report.runner = "GitHub-hosted standard Ubuntu 24.04 CPU / swangle / concurrency 1";
    report.decodeIntegrity = "PASS";
    report.audioLayers = "One approved stereo mix only, encoded once to AAC; all composition audio muted";
    report.musicAttribution = attribution;
    writeFileSync(`${out}/master-media.json`, JSON.stringify(metadata, null, 2));
  }
  writeFileSync(`${out}/readiness.json`, JSON.stringify(report, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
