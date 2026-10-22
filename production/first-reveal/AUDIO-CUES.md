# First Reveal — consolidated audio cue sheet

Phase 5 supersedes the original 35-event sheet, preserved in `archive/phase4-AUDIO-CUES.*`. There are now **14 cue positions: 11 core and 3 optional**, using six reusable effect files. Optional A04/A06/A10 are disabled by default. This is a sound-edit plan, not a claim that any effects have been supplied or mixed.

The narration was independently measured at **29.649 seconds**, as reported by the user. The file and its phrase boundaries have not been inspected here. All cue positions follow the approved visual timeline and must be conformed to the actual speech and chosen music without altering the animations or speech speed. Second values govern sample-level sound editing; frame references are nearest-frame visual guides.

| Cue | Time (s) | Frames @30 | Asset | Event / direction | Priority |
| --- | --- | --- | --- | --- | --- |
| A01 | 0.43–0.65 | 13–20 | ui-detail.wav | One tab detail. Single dry tactile tick; the opening music carries the title | Core |
| A02 | 1.5–2.95 | 45–89 | airy-resolve.wav | Tab convergence and magnetic resolve. One continuous airy gesture with a soft stop | Core |
| A03 | 3.02–4.2 | 91–126 | logo-signature.wav | First brand reveal. Restrained warm signature with a short glass tail | Core |
| A04 | 8.2–9.3 | 246–279 | airy-resolve.wav | Routing trace. Optional very low texture; omit if speech is dense | Optional / off |
| A05 | 8.9–9.05 | 267–272 | ui-detail.wav | Auto Best selection. One quiet click; no confirmation melody | Core |
| A06 | 10.85–11.15 | 326–335 | airy-resolve.wav | Model comparison split. Optional short stereo separation | Optional / off |
| A07 | 13.3–14.1 | 399–423 | ui-detail.wav | Winner selection. One tactile selection accent; no separate lift sound | Core |
| A08 | 14.5–15.2 | 435–456 | airy-resolve.wav | Transfer into creative idea. One directional gesture; no separate submit click | Core |
| A09 | 16.25–16.8 | 488–504 | material-bloom.wav | Image develops. Soft material opening; no noise burst | Core |
| A10 | 17.8–18.3 | 534–549 | airy-resolve.wav | Image-to-motion framing. Optional understated width change; omit playback click | Optional / off |
| A11 | 19.8–20.8 | 594–624 | morph-texture.wav | Image slices become voice waveform. Clean sparse flutter; no synthetic voice or buzz | Core |
| A12 | 21.75–22.1 | 653–663 | airy-resolve.wav | Wallet light-mode change. Short soft downward air; typography supplies remaining motion | Core |
| A13 | 23.3–23.55 | 699–707 | soft-impact.wav | Rupee/credit equation settles. Small rounded tactile impact; no coins or casino sound | Core |
| A14 | 26–27.3 | 780–819 | logo-signature.wav | Final logo signature. Same identity as A03, slightly fuller resolve; URL and speech then remain clear | Core |

## Consolidation decisions

- Hook: replace title impact plus four tab taps with one discreet tab tick; combine convergence and resolve into one gesture.
- Brand: combine impact and sheen into a single short signature. Reprise the same identity at 26 seconds, with no separate tagline/CTA clicks.
- Intelligence: omit model-collection ticks and confirmation melody. Keep one Auto Best click; routing texture is optional.
- Battle: one winner accent replaces separate click/lift effects. Comparison split texture is optional; omit response typing.
- Creation: use one transfer, one material bloom and one morph gesture. Format expansion is optional; submit/playback clicks are removed.
- Wallet: one material transition and one equation accent; omit rupee landing and drawer sounds.
- Closing: 27.3–30 seconds is a music/narration tail, not an additional sound effect. No new event at 29.6 seconds. The voice remains intact through its natural end.

Every original event maps to a consolidated window or a deliberate omission in `cue-consolidation.csv`. Source-file loudness varies: listed gains are audition starting points, not final measured balances. Do not try to fill every window with sound. See `AUDIO-INTEGRATION-READINESS.md` for exact filenames, sync, mixing and cloud workflow requirements.
