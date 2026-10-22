# ModelsSuiteFirstReveal — targeted visual-polish master

22 October 2026. **Revised master exported and verified.**

## Actual visual changes

- Rebuilt the logo boundary from the unchanged authentic PNG at four times the previous tracing resolution. Smoothed the contour, used a narrower eight-segment bevel and shared vertex normals, enabled 2× canvas sampling, and softened the metallic rim. Both the 3–6 s reveal and 26–30 s finale use the repaired mesh.
- Added a restrained perspective settle to the Auto Best panel. Routing paths now converge on the selected button, the cursor lands on Auto Best, and press/selection feedback is synchronized. Increased small model-description text and corrected a clipped descender.
- Added a small continuous camera drift and counter-moving artwork parallax to the creative transformation. The waveform transition uses smooth acceleration/deceleration at its existing 19.8–20.8 s window. Increased the concept label and improved secondary-text contrast. The illustrative-content wording remains intact.
- Raised the closing website and CTA and modestly reduced/repositioned the final logo/tagline to protect them from app overlays. Gave the closing headline enough line height for full letter descenders. No wording, scene boundary, product claim, branding palette or audio timing changed.

## Delivered encoding and verification

| Property | Result |
| --- | --- |
| File | ModelsSuiteFirstReveal-POLISHED.mp4 |
| Dimensions / frame rate | 1080 × 1920 / 30 FPS |
| Duration / frames | Exactly 30.000 s / 900 frames |
| Video | H.264, yuv420p, slow preset; 10 Mbps target, 12 Mbps cap |
| Measured average video bitrate | 7.145 Mbps |
| File size | 27,987,043 bytes |
| Audio | Exactly one 48 kHz stereo AAC track; 320 kbps target |
| Encoded audio loudness / true peak | -16.07 LUFS / -2.95 dBTP |
| Decode / download checksum / synchronization | PASS |

The exact approved 48 kHz / 24-bit stereo WAV was verified by checksum before transport, on the cloud runner, and after export. No remix, EQ, gain, ducking, limiting, resampling, speech-speed or timing adjustment was applied. All composition audio was muted; only the approved finished stereo mix was integrated once. The entire AAC packet payload is also byte-for-byte identical to the previous approved master; decoded audio samples match exactly.

The closing narration remains complete. Audio and video both start at zero and present exactly 30 seconds. Five waveform comparisons include the closing 28.3–29.9 s window. The original seven scene boundaries remain 0, 3, 6, 11, 15, 22 and 26 seconds.

## Social-placement check

The closing logo, promise, website and account invitation were checked in the delivered frames against a conservative critical-content box of x=180–900, y=269–1248. The CTA occupies x=240–840, y=1150–1238 once settled, leaving more than 35% clear below it. Website text is centered at y=1070 and remains visible through the final frame. There is no burned-in guide in the film.

This check focuses on the closing conversion content and relevant small text, while preserving the approved seven-scene layout. Some peripheral scene headings and illustrative interface elements extend beyond conservative paid-ad guides. App overlays depend on captions, placement, device and add-ons, so this is not a claim of universal clearance in every publishing configuration. TikTok's official [in-feed guidance](https://ads.tiktok.com/resources/help/article/tiktok-auction-in-feed-ads) explains these variations. Meta's authored [Reels creative guide, page 4](https://d3m889aznlr23d.cloudfront.net/img/events/458925814/assets/e042d2be.reels_ads_guide1.pdf) recommends keeping the bottom 35% clear of key elements. The current Meta help page required login during this check.

## Proof, cloud execution and preservation

One two-second silent logo proof was rendered, inspected and shown before the full master. Proof run: [39810798996](https://github.com/ayaneijaz45-hue/Demo-video-/actions/runs/39810798996). One full revised master render was performed: [39811413979](https://github.com/ayaneijaz45-hue/Demo-video-/actions/runs/39811413979), source commit `f17403f0544283f7a9123ef89816ff03f8a1dd5f`. Both used the existing manual GitHub Actions workflows on standard GitHub-hosted Ubuntu CPU runners. No local composition render, paid service, new dependency or asset generation was used.

The original final master, original 60-second production, source artwork, authentic logo PNG and approved WAV remain preserved. Private source audio and rights records remain outside public Git. Temporary encrypted-mix transport and its key/download secrets were removed after verification. Music credit and license link remain embedded in the MP4 and are copied in MUSIC-ATTRIBUTION.txt; the soundtrack edits and credit remain the same as the approved master.

## Checksums

- Approved WAV SHA-256: `10d65ad9480b41bde4032a1913ac8ce3f50520112a1d51b1d8dced30ce4ec919`
- Revised MP4 SHA-256: `b6acb1f3f1f05af0d2ab88d1c5f5f2d89e0f6a5b8228b8036e3cf0f2386ca0d8`

Technical details: export-verification.json and cloud-verification/readiness.json. Browser playback and selected delivered-frame review are recorded in export-verification.json. This pass preserved the approved soundtrack; it does not claim a new independent audio-mastering review.
