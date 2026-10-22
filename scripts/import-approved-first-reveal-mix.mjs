// Transport only the exact approved mix. No source stems or rights records are uploaded.
import { createDecipheriv, createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";
import { assetPath } from "./first-reveal-audio.mjs";

assert.equal(process.env.GITHUB_ACTIONS, "true");
assert.equal(process.env.RUNNER_ENVIRONMENT, "github-hosted");
assert.equal(process.env.GITHUB_REPOSITORY, "ayaneijaz45-hue/Demo-video-");
const c = JSON.parse(readFileSync("production/first-reveal/audio-integration.json", "utf8"));
const transfer = c.cloudApprovedMixTransfer;
assert.ok(transfer && Number.isSafeInteger(transfer.assetId), "Configure a temporary approved-mix transfer first");
assert.equal(transfer.format, "FRM1-AES-256-GCM");
assert.match(process.env.FIRST_REVEAL_APPROVED_MIX_KEY || "", /^[a-f0-9]{64}$/, "Missing temporary mix decryption key");
const response = await fetch(`https://api.github.com/repos/ayaneijaz45-hue/Demo-video-/releases/assets/${transfer.assetId}`, {
  headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/octet-stream", "X-GitHub-Api-Version": "2022-11-28" },
  signal: AbortSignal.timeout(60000),
});
assert.equal(response.status, 200, "Approved-mix transfer download failed");
const packet = Buffer.from(await response.arrayBuffer());
assert.ok(packet.length > 32 && packet.length < 20 * 1024 * 1024);
assert.equal(createHash("sha256").update(packet).digest("hex"), transfer.encryptedSha256, "Encrypted transfer checksum mismatch");
assert.equal(packet.subarray(0, 4).toString(), "FRM1");
const decipher = createDecipheriv("aes-256-gcm", Buffer.from(process.env.FIRST_REVEAL_APPROVED_MIX_KEY, "hex"), packet.subarray(4, 16));
decipher.setAAD(Buffer.from("ayaneijaz45-hue/Demo-video-/ModelsSuiteFirstReveal"));
decipher.setAuthTag(packet.subarray(-16));
const wav = Buffer.concat([decipher.update(packet.subarray(16, -16)), decipher.final()]);
assert.equal(createHash("sha256").update(wav).digest("hex"), c.approvedMix.sha256, "Decrypted WAV differs from the user-approved review");
const path = assetPath(resolve("production/first-reveal/audio-assets"), c.approvedMix.path);
mkdirSync(dirname(path), { recursive: true });
writeFileSync(path, wav);
console.log("Exact approved stereo WAV imported; authenticated decryption and SHA-256 checks passed.");
