# Phase 5 — professional audio integration readiness

**Historical preparation report.** The sources have since arrived and audio review v1 is complete. See [AUDIO-REVIEW-STATUS.md](AUDIO-REVIEW-STATUS.md) for actual processing, timing choices and measured results. User listening approval and final video export remain pending.

The approved `ModelsSuiteFirstReveal` visuals are preserved. This phase prepares audio intake, editing, mixing and a future manual cloud master. It does not generate replacement audio, change animations, or export any media.

## Exact asset delivery

Supply these files in a ZIP with the paths below at its root. The staging directory is `production/first-reveal/audio-assets/`; source audio and private rights records there are ignored by Git and are never copied into `public/` or the public source archive.

| ZIP path | Requirement |
| --- | --- |
| `narration/runway-original.mp3` | Required. Original Runway download, independently measured at 29.649 s; preserve the original file. No music embedded. The original remains backed up in Descript. |
| `music/cinematic.wav` | Required. One commercially licensed cinematic electronic track, preferably lossless 48 kHz / 24-bit stereo. At least one uninterrupted 30-second section; a longer source is welcome. Record its chosen in-point after listening. No automatic loops or time stretching. |
| `sfx/ui-detail.wav` | Required. A clean, dry, short tactile UI accent. Reused sparingly; no keyboard chatter. |
| `sfx/airy-resolve.wav` | Required. Smooth broadband movement with a soft magnetic stop; usable up to about 1.45 s. No piercing whistle or hard hiss. |
| `sfx/soft-impact.wav` | Required. Rounded short material impact; no distorted sub drop, metallic coin or casino cue. |
| `sfx/material-bloom.wav` | Required. Soft glass/material opening, about 0.55 s, with a controlled tail. |
| `sfx/morph-texture.wav` | Required. Sparse, clean transformation texture, about 1 s. No vibrating drone, synthetic speech or harsh granular noise. |
| `sfx/logo-signature.wav` | Required. Approved distinctive warm brand resolve with a restrained glass accent and short tail, about 1.2–1.3 s. It must work quietly at the first reveal and more fully at the finale. No replacement music synthesis is requested. |
| `rights/rights.json` | Required. Fill `RIGHTS.template.json`: source and license/terms/order evidence reference for narration, music and all six effects; permission for commercial promotional and paid-advertising use. No rights are presumed. Keep private invoices outside public Git. |
| `mix/approved-stereo.wav` | Optional at intake; required only for the eventual master. Exactly 30.000 s, stereo, 48 kHz PCM WAV, preferably 24-bit; all tracks aligned to timeline zero. May be a professionally mastered Descript mix, or a later reviewed/mastered cloud draft. |

Six SFX files are a deliberately small reusable library, not fourteen separate purchases. If the licensed music or effects arrive in another original format, retain those originals and prepare lossless working copies after intake; do not repeatedly transcode lossy files. Do not purchase or activate anything without approval. A supplied mastered mix never plays alongside the separate stems.

## Audio direction

Use one coherent material identity: warm tactile weight, transparent air, tiny dry interface detail and an understated glass signature. Music supplies momentum and phrasing; SFX mark decisions and transformations, not every movement. Preserve space between accents and a stable center for the voice. Reject the previous score entirely: no vibrating bed, repetitive buzz, abrasive high-frequency ring, distorted bass or constantly pumping effects.

| Visual section | Audio intention |
| --- | --- |
| 0–3 s, hook | Immediate musical intent and one small UI tick; one accelerating convergence gesture. Avoid five competing taps. |
| 3–6 s, brand | Brief warm signature and an open musical space for the name. |
| 6–11 s, intelligence | Precise restrained pulse. One Auto Best click; optional routing air only if speech leaves room. |
| 11–15 s, battle | Small comparison/winner detail. Let the voice and music carry the explanation. |
| 15–22 s, transformation | Musical expansion, material bloom and one image-to-waveform gesture. This is the broadest dynamic passage, with dialogue still dominant. |
| 22–26 s, wallet | Reduce density; clean tactile equation accent. No coin/payment-success sound. |
| 26–30 s, finale | Reprise the same logo signature at 26 s, settle by 27.3 s, then music and voice only. A natural musical resolve and short tail close the film. |

The 35-event Phase 4 sheet is archived intact. The active sheet now has **14 cue positions, 11 core and three optional/off** (A04/A06/A10). `cue-consolidation.csv` accounts for all 35 original entries. No new SFX is placed at 29.6 s. Do not force music beats onto every cut or enable optional cues merely to fill silence.

## Narration and synchronization requirements

The user reports an independently measured narration duration of **29.649 seconds**. That leaves **0.351 seconds** in a 30-second timeline when the full file starts at zero: 10.53 frames at 30 FPS, not a spare whole second. This project has not received or inspected the file. Actual speech, MP3 encoder padding, head/tail silence, peaks and phrase boundaries remain unverified here.

Start at timeline 0, playback rate 1.0. Do not round audio placement to video frames, fade out the last words, cut consonants, trim silence blindly, or add a leading delay. The source remains untouched. Complete a copy of `NARRATION-TIMING.template.json` by listening and marking actual phrase starts/ends, then compare them with the approved windows: 0–3 / 3–6 / 6–11 / 11–15 / 15–22 / 22–26 / 26–30 seconds. No word timestamps are invented in this handoff.

Audio editing follows these visuals. If an important phrase conflicts with its scene, report the precise timestamp and propose the smallest adjustment for approval; do not silently retime animations or speed up speech. The reported duration alone cannot establish synchronization.

Choose the music in-point and real musical phrases after auditioning the track. Confirm downbeats and swells around the hook, brand, creative section and finale. Conform the cue windows to actual speech gaps while preserving each visual event's intent. All SFX sources begin at their own onset; trim/fade working copies deliberately, retaining original files.

## Mixing settings and review

These are preparation targets, not measurements or a finished mix. `audio-integration.json` contains the active editable cue, gain and review settings.

| Layer / stage | Starting direction |
| --- | --- |
| Narration | Center, natural speed, initial 0 dB source gain. Audition before any processing. If needed, gentle high-pass roughly 70–90 Hz, small corrective cuts for muddiness, selective de-essing around the actual sibilant band, and about 2:1 compression with 2–4 dB gain reduction. Do not automatically apply this chain to an already processed Runway/Descript voice. |
| Music | Initial -20 dB source gain, 0.5 s entrance and 1.5 s exit (28.5–30 s). This is only an audition start because source loudness differs. Cloud draft uses voice-triggered ducking: threshold 0.03 linear (about -30.5 dBFS), ratio 3:1, 15 ms attack, 250 ms release. Adjust by ear; retain natural rises in speech gaps. |
| SFX | Cue starts around -16 to -28 dB source gain, with five-millisecond entrances and up to 70 ms exits. Keep most detail below the voice. Shape low end and high-frequency transients in the working files if needed; no heavy automatic distortion or stereo tricks. |
| Stereo | Center the voice, keep musical width natural, use restrained effect placement and check mono/phone playback. No hard-panned narration. |
| Cloud audio draft | Float mixing without automatic amix normalization, 48 kHz stereo / 24-bit WAV. A sample-peak limiter at about -1.5 dBFS with automatic makeup disabled is draft protection only; it does not establish true-peak compliance or mastering quality. |
| Approved stereo mix | Target -16 LUFS integrated (acceptance window ±1 LU), true peak no higher than -1.5 dBTP, no clipping or audible pumping. Musical dynamics and intelligibility matter more than forcing a loudness number. Exact 30-second duration with a controlled ending. |
| Delivery AAC | Future AAC 320 kb/s, 48 kHz stereo. Remeasure the encoded file, allowing at most -1.0 dBTP; listen again for transients, sibilance and final-word truncation. The workflow measures and rejects out-of-window values; it does not automatically normalize an approved mastered mix. |

The cloud draft applies source gains, fades, voice-driven music ducking and a protection limiter. Dialogue EQ, de-essing, corrective compression and final loudness mastering are deliberately left for inspection and actual listening, including Descript when available. No processing result can be approved before the real files exist. Any approved mix gets a SHA-256 fingerprint; a changed mix must be reviewed again.

## Prepared GitHub workflow

New manual workflow: `.github/workflows/first-reveal-audio.yml`. It uses the existing public repository, `ubuntu-24.04`, Node 24 and the existing pinned dependencies. No push triggers, paid runners, cloud GPUs, production deployments or automatic video exports are introduced. No new npm dependencies are needed. Existing visual-proof and 60-second workflows remain unchanged.

Three explicit modes:

1. **preflight (default):** validates manifest/cues and reports missing files/reviews. Generates JSON only. A successful check means the preparation is valid; `assetsReady` can still be false. It never generates audio or video.
2. **mix-review (later):** with approved source rights, inspected narration and conformed cue timing, creates an audio-only draft WAV and loudness report on GitHub. It never renders video. Listen, adjust, and professionally master or approve a mix before proceeding.
3. **master (later):** additionally requires the exact `MASTER_APPROVED` dispatch text, final-export review flag, the 30-second approved stereo PCM mix and its matching SHA-256. It renders the unchanged composition once with every composition audio prop null and muted, then muxes only the approved mix. H.264 1080 × 1920 / 30 FPS / 900 frames, AAC and encoded loudness checks run before the master is uploaded. No double music or narration layers are possible through this path. A final human playback review remains necessary.

To transport licensed media without publishing source files in Git, the workflow supports a future HTTPS ZIP download URL in repository secret `FIRST_REVEAL_AUDIO_BUNDLE_URL`, pinned by `cloudBundleSha256` in the manifest. The URL is not printed. The importer checks ZIP paths, allowed filenames, checksum and size before staging. No storage service, credentials, secret or download has been configured in Phase 5. Once supplied, assets can be staged locally; the cloud delivery method and rights will be reviewed before configuring the secret. Do not upload licensed source files as public GitHub releases unless redistribution rights explicitly permit it. Source audio and rights files are excluded from workflow artifacts; draft mix/master artifact downloads must also be covered by the supplied license.

The new workflow is prepared but not dispatched in this phase. Media-processing modes are blocked without assets and explicit reviews. Full AAC mastering remains untested. The previous proof workflow's intentionally blocked master branch is historical; use this new workflow for future audio work.

## Verification scope and stopping point

Phase 5 checks configuration, cue coverage, script syntax, path confinement, local media-processing refusal, TypeScript/package compatibility and preservation of visuals. It does not create dummy audio or run the mixer against invented assets. No media was generated, no animations changed and no final export was attempted. The original 60-second production is preserved.

Checks completed: all three focused audio preparation tests passed; importer Python syntax and workflow YAML parsed successfully; the 35 original events map completely to the 14-position plan; TypeScript and Remotion 4.0.537 compatibility passed. A diff against `cfa1279` confirms no changes to `src/`, `public/`, dependency files or existing workflows. Preflight reports valid configuration with `assetsReady=false`, as expected. The new cloud workflow has not been dispatched, and the mixer, bundle download and master paths remain unexecuted with real assets.

The remaining handoff is the original narration MP3, one licensed music source, six approved SFX files and rights evidence. An optional mastered 30-second WAV can bypass cloud draft mixing. Actual timing, audio processing, cloud media execution and final delivery validation await those files and the next authorized phase.

Official implementation references: [Remotion render CLI](https://www.remotion.dev/docs/cli/render), [FFmpeg audio filters](https://www.ffmpeg.org/ffmpeg-filters.html), and [GitHub Ubuntu 24.04 runner image](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md). These document the tools; they do not certify this unexecuted audio master.
