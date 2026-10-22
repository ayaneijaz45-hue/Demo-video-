# Phase 5 — audio review v1, listening approval pending

**Historical review record.** The user subsequently approved this exact WAV and authorized final export. See [FINAL-PRODUCTION-REPORT.md](FINAL-PRODUCTION-REPORT.md) for the completed master and verification. The measurements and edit decisions below describe the approved review unchanged.

The 30-second stereo audio review is complete and saved privately for the user. No final video has been rendered. The approved seven-scene composition, original 60-second film, image assets and existing visual workflows are unchanged.

## Actual source intake

All six user-provided temporary Runway links downloaded successfully. Original MP3s, 48 kHz / 24-bit PCM WAV working copies and provenance/rights records are retained in the ignored `audio-assets/` directory. The temporary URLs and private handoff were never added to public Git. All eight original audio source hashes remain unchanged.

The Runway narration MP3 reports 29.648980 seconds. Its gapless decoded working copy contains exactly 29.600 seconds; the difference is encoder padding, not removed speech. The music working copy contains 210.636375 seconds. The six effects decode to 0.68025–1.480 seconds. No new voice, score or effects were synthesized or purchased.

## Synchronization and edit decisions

ASR word estimates were checked alongside measured quiet regions to choose phrase edit points. A second transcription of the conformed voice recovered the same 49 recognized words, with no missing or added recognized content. Automated spelling and timestamps remain estimates, not a substitute for listening.

The edit uses the existing voice at original pitch and speed throughout. Quiet pauses are shortened or expanded; the connected-workspace phrase moves into the intelligence chapter. Image, video and voice phrases are separated at their existing pauses to follow the creation transformations. Tiny declick fades protect edit boundaries. Original media remains untouched.

| Content | Approximate intended audible range / relationship |
| --- | --- |
| Too many AI tabs | Opening hook, about 0–1.5 s |
| Meet Models Suite | Brand chapter, about 3.1–4.7 s |
| Leading AI / Auto Best | Intelligence chapter, about 6.1–9.9 s |
| One connected workspace | About 10.1–11.6 s, carrying slightly into comparison |
| Model Battle | About 11.7–13.6 s |
| Create images / videos / voice | About 15.6–16.5 / 18.2–18.8 / 19.7–20.5 s |
| Credit / rupee equation | About 20.77–23.41 s; anticipates the 22 s wallet visual by about 1.23 s |
| Closing brand and tagline | About 23.4–27.3 s; a sound bridge from wallet into the 26 s finale |
| Website invitation | Full phrase retained, finishing about 29.79 s, with a short remaining hold |

The wallet lead and closing sound bridge are explicit review choices needed to retain all the spoken content against the fixed visuals. This is not a claim that every phrase fits exclusively inside one visual chapter. User approval must include these relationships before final video export. No speech acceleration, replacement wording or visual redesign was used.

The active 14-position cue sheet and manifest are synchronized. Eleven cues use all six supplied effects; three optional positions remain off. Source tails are protected where possible, with Bloom, Morph and the equation windows extended slightly. No extra sound punctuates the website or final words. The actual placed cue data is retained in the private verification report.

## Mixing and checks

Music uses one continuous **40.000–70.000 second** excerpt of Rising. Its stronger pulse arrives near the 15-second creation section. The edit keeps its native stereo, pitch and tempo, uses controlled entrance/end fades and up to 6 dB of voice-driven ducking. Narration stays centered, with mild level compression (1.3:1 above the detector threshold, capped at 1.7 dB gain reduction). No unnecessary dialogue EQ is applied.

Actual source analysis found excessive sub energy in Airy Resolve, DC/sub content in Logo Signature, and predominantly high-frequency energy in Bloom/Morph. Corrective high/low-pass shaping, source declicks, restrained matching and per-cue gains control these characteristics. The original files are preserved. No overdrive, hard clipping, old synthetic soundtrack or constant new synthesized tone is introduced.

| Technical result | Audio review v1 |
| --- | --- |
| Duration / format | Exactly 30.000 s; 48 kHz stereo, 24-bit PCM WAV |
| Integrated loudness | -16.06 LUFS |
| True peak | -2.96 dBTP |
| Loudness range | 3.7 LU |
| Clipped samples | 0 |
| Voice/music average RMS margin during detected speech | About 13.09 dB |
| Stereo correlation | About +0.986; centered voice dominates the mix |
| Whole-mix spectral energy below 60 Hz / above 8 kHz | About 2.64% / 3.24% |

Two-pass loudness normalization used linear gain; measured peak headroom did not require a louder or more heavily limited result. These checks assess signal integrity and balance. They cannot certify the absence of every subjectively harsh tone, perceived distortion or masked word. The user must listen on headphones and a phone speaker before approving the soundtrack.

## Rights and privacy

Commercial-use basis was checked against the supplied provenance and official Runway commercial-use guidance, and against Rising's embedded CC BY 4.0 metadata plus the publisher's licensing record. Detailed source identifiers, hashes and rights records remain private. The local delivery includes the source/licensing report and music attribution text; no private records are committed to public Git.

Audio decoding, local CPU transcription and the audio-only mix ran locally. No video rendering, media upload, paid service or cloud render job was started. The standalone `first-reveal-review.py` reproduces this audio-only edit from private working copies. The prepared GitHub audio workflow can reproduce that edit later with the existing pinned numpy dependency; that new path has not been cloud-executed. The established cloud-only video master guard is unchanged.

The reviewed WAV has a recorded checksum. Keep it unchanged for approval; the `approvedMix` hash and final-export flag remain unset/false. After user approval, the approved waveform should be used once as the sole audio master for the future GitHub H.264/AAC render, without layering its source stems again.
