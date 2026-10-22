# Models Suite — One Workspace

60-second vertical launch film. 1080 × 1920, 30 FPS, 1,800 frames.

Current audio status: **visual preview only — professional narration pending**. The user requires professional narration before final audio-master approval. No paid voice service has been activated.

## Editing

- Main composition: ModelsSuite in src/Film.tsx.
- Each of eight scenes has its own source file and connected composition under Scenes in Studio.
- Design primitives, palette and font loading: src/design.tsx.
- Authentic logo: public/brand/.
- Original music and effects: public/audio/, with reproducible synthesis in scripts/compose-score.py (Python + numpy).
- Narration script, exact reserved windows and approval state: production/narration.json.
- Product evidence and asset provenance: production/ASSETS-AND-CLAIMS.md.
- Full scene timing and review notes: production/PRODUCTION.md.

Use Node 24 and npm ci. npm run verify checks types and version compatibility. npm run dev opens Studio without triggering a local render. Local video rendering is outside this project’s production workflow.

## Cloud rendering

Use **Actions → Phase 2 cloud production previews → Run workflow**.

1. Choose proof. This renders representative short ranges and ten full-resolution scene frames on the free standard Ubuntu runner.
2. Inspect the actual outputs for cropping, typography, animation and technical failures.
3. Only after that review, choose full-preview. This renders the complete film with original music/effects, normalizes the audio, extracts 30 actual-output review frames, and checks H.264/AAC, resolution, frame count, frame rate and duration.

Download the corresponding artifact from the run page. Seven-day retention applies to Phase 2 previews. Neither workflow runs automatically on push. Both skip private repositories and use only ubuntu-24.04 standard GitHub-hosted runners with concurrency 2. No GPU, paid cloud, website deployment or product-generation API is used.

The original render-mp4 workflow is reserved for a future approved final master and now requires narration approval; it is blocked while the audio status is pending.

## Scope and truth

The website repository allmodelhub-101/allmodelhub is a read-only reference. This repository contains cinematic source-based UI reconstructions with illustrative example content, not recordings or live model results. The creation graphic is original vector concept art. Model availability is not guaranteed and no partnership or instant payment claim is made. The current published conversion is one Models Suite credit = PKR 1.

## Phase 1 evidence

[Setup verification run 39737522841](https://github.com/ayaneijaz45-hue/Demo-video-/actions/runs/39737522841) succeeded on 22 October 2026: 4 vCPUs, 15.61 GiB RAM, Node 24.21.0, dependency installation, compilation, FFmpeg and empty browser launch. The manual no-video setup-verification workflow remains available.
