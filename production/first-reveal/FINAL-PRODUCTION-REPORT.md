# Models Suite: The First Reveal — final production report

Date: 22 October 2026. Status: **FINAL MP4 EXPORTED AND VERIFIED**.

The exact user-approved audio review v1 was integrated with the existing `ModelsSuiteFirstReveal` composition. The seven-scene visual design, 3D logo, camera choreography, transformations, typography and original assets were preserved. No soundtrack remix, asset generation, speech-speed change or paid service was used for this export.

## Delivered master

| Property | Verified result |
| --- | --- |
| Filename | `ModelsSuiteFirstReveal-MASTER.mp4` |
| Resolution | 1080 × 1920, vertical |
| Presentation duration | Exactly 30.000 seconds |
| Video | H.264, yuv420p, CRF 17; 30 FPS; 900 frames |
| Audio | One stereo AAC track, 48 kHz, 320 kb/s encoding target |
| Stream count | Exactly one video and one audio stream |
| Stream starts | Both at 0.000 seconds |
| MP4 layout | Fast-start metadata for progressive playback |
| File size | 9,260,152 bytes |
| Encoded audio integrated loudness | -16.07 LUFS |
| Encoded audio true peak | -2.95 dBTP |
| Full decode / downloaded-file integrity | PASS |

The original approved WAV remains exactly 30 seconds, stereo, 48 kHz / 24-bit PCM, with its -16.06 LUFS / -2.96 dBTP measurements unchanged. AAC is the required lossy delivery encoding; no EQ, gain automation, normalization, limiting or further mixing was applied during final integration.

**Approved WAV SHA-256**

`10d65ad9480b41bde4032a1913ac8ce3f50520112a1d51b1d8dced30ce4ec919`

**Final MP4 SHA-256**

`332a713cd02b3befd5d38a19372530fd77d76f37c65c17d95abe88a200541eba`

The approved checksum was checked locally, after authenticated decryption on the runner, immediately before integration, and again against the delivered WAV. The downloaded MP4 checksum matches the runner's result.

## Cloud execution

- Workflow: `.github/workflows/first-reveal-audio.yml`, manual `master` dispatch with the required confirmation.
- [Successful GitHub Actions run](https://github.com/ayaneijaz45-hue/Demo-video-/actions/runs/39786555172).
- Render source commit: `5b30fe67a02e5b5092b227df7a833c5174b18af8`.
- Job: `119851200789`, completed in 4 minutes 22 seconds.
- Environment: standard GitHub-hosted Ubuntu 24.04 CPU runner; software GL; one Chromium worker. No paid GPU, external cloud renderer or local video render.
- TypeScript and pinned Remotion compatibility checks passed. The complete MP4 decoded without reported errors on the cloud runner.

The first attempt, [run 39786144320](https://github.com/ayaneijaz45-hue/Demo-video-/actions/runs/39786144320), stopped at private asset import because the read-only job token could not download a draft-release asset. No video frames were rendered. The temporary download route was corrected while keeping read-only workflow permissions. Only one complete visual master render was performed.

## One soundtrack, unchanged timing

All three composition audio props were null and the visual export used `--muted`. A stream inspection confirmed the visual intermediate contained one video stream and no audio. FFmpeg then copied that H.264 stream and encoded only the exact approved WAV to stereo AAC. Source narration, music and effect tracks were not layered again.

After downloading the master, its AAC was decoded and compared with the approved waveform in five windows: 0.3–1.5, 3.5–4.7, 12–13.5, 20.9–22.1 and 28.3–29.9 seconds. Every window showed **zero samples of detected timing shift**. Correlation ranged from 0.9998696 to 0.9999902, with RMS differences below 0.024 dB, consistent with AAC encoding rather than a changed mix.

The closing website window correlated at 0.9999813 with zero detected lag. Its complete approved tail is present. The spoken website ends before the 30-second boundary; no final words were trimmed. Raw AAC decoding includes codec padding after the presentation interval; the MP4 audio/video presentation remains exactly 30 seconds, and all 1,440,000 approved presentation samples were available for comparison.

## Visual and synchronization review

Twelve frames extracted from the delivered MP4 were inspected across all seven scenes. Browser playback reached 0:30 / 0:30 with the final logo, promise, website and account invitation visible. Selected frames show the approved 3D extrusion/reflections, UI routing, winner selection, artwork/motion/waveform transformation and light wallet intact. The website is fully readable during the closing spoken URL and remains visible on the final frame.

| Moment | Preserved synchronization |
| --- | --- |
| Hook and convergence | Existing tab detail at 0.43 s and convergence gesture from 1.5 s |
| First 3D brand | Signature begins at 3.06 s alongside the reveal |
| Auto Best / comparison | Existing UI cues at 8.9 s and 13.3 s |
| Creation | Image bloom at 16.25 s, video phrase around 18.2 s, and waveform/morph from 19.8 s |
| Wallet | Material change at 21.75 s into the 22 s light scene; equation accent at 23.3 s |
| Finale | Final signature at 26 s; website visible from about 27.2 s through the end |

The already-approved 1.23-second wallet narration lead and closing sound bridge are retained exactly. They were not retimed to force every spoken phrase entirely inside one scene. The local verification JSON records numerical comparisons; the contact sheet records visual checkpoints. Playback review was visual, with encoded sound integrity assessed against the user-approved WAV; no new independent professional listening certification is claimed.

## Attribution and privacy

Music remains the approved 40–70 second excerpt of **Rising**, credited to Johannes Weber, Sina Nitzsche and Fachhochschule Dortmund under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), with the [publisher source](https://www.orca.nrw/oer/oer-erstellen/oer-tracks/). The caption text documents the excerpt, EQ, fades, ducking and mixing performed for the approved review. Attribution and the license/source links are embedded in the MP4 comment metadata and supplied in `MUSIC-ATTRIBUTION.txt`. Include that text in Instagram, TikTok and YouTube descriptions when publishing.

Only an AES-256-GCM encrypted copy of the approved mix was temporarily staged in a draft release. Its key and short-lived download route were held in Actions secrets. The exact WAV checksum was verified after decryption. No original stems, temporary Runway URLs or private rights records were committed or transferred for rendering. The temporary draft/asset, two temporary Actions secrets, and local temporary key/download route were removed after successful delivery. Private originals and rights evidence remain saved locally.

## Preservation and handoff

Against the approved `5e38c6e` source, `src/`, `public/` and dependency files are unchanged. The original 60-second composition and its workflows remain preserved. The final render used the existing composition and assets; local QA only decoded the finished file and extracted verification frames.

The delivery folder contains the MP4, a byte-identical copy of the approved WAV, this report, attribution text, source/licensing report, final metadata, verification JSON, cloud reports, visual contact sheet and editable project archive. The archive excludes new licensed/private media and private rights records; the approved WAV is delivered separately. Historical visual proofs and audio reviews remain saved in their earlier output folders.

Temporary transport configuration is now cleared. A future cloud rerender would require a fresh private mix transfer and checksum verification; the old temporary download route is not retained. No further render or deployment is scheduled.
