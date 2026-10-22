# Demo-video-

Phase 1 infrastructure for future programmatic video production.
There are no scenes, compositions, stills, audio assets, or rendered videos.

## Project

- Repository: https://github.com/ayaneijaz45-hue/Demo-video-
- Branch: `main`; public visibility is required by both workflows.
- Runtime: Node.js 24, npm, React, TypeScript, Remotion 4.0.537.
- All Remotion packages have exact matching versions; `package-lock.json` fixes the dependency tree.
- Official Remotion skills are already available through the installed desktop plugin. No duplicate skills are installed in this repository.

## Local setup checks (no rendering)

```sh
npm ci --no-audit --no-fund
npm run verify
npm run bundle
```

`bundle` compiles JavaScript and copies assets; it does not generate video or frames.
`npm run dev` is available for future Studio work. Local video rendering is outside this project's workflow.

## Structure prepared for Phase 2

- `src/index.ts`: Remotion entry point.
- `src/Root.tsx`: empty root with no registered compositions.
- `src/components/`: future reusable 2D animation components.
- `src/compositions/`: future compositions, to be added only in Phase 2.
- `src/transitions/`: future transition components.
- `src/three/`: future 3D components.
- `public/audio/`, `public/images/`, `public/models/`: future static assets.

Core Remotion supports 2D animation and audio. Install optional packages only when Phase 2 requires them: `npx remotion add @remotion/transitions` for transitions, or `npx remotion add @remotion/three` plus compatible `three`, `@react-three/fiber`, and TypeScript types for 3D. Keep every Remotion package at the same version. No GPU service or paid integration is configured. 3D/WebGL behavior remains untested.

## Manual cloud setup verification

Once these files are on `main`, open **Actions → Phase 1 setup verification (no video) → Run workflow**.

The workflow uses the GitHub-hosted standard `ubuntu-24.04` runner, Node 24 and `npm ci`. It checks TypeScript, Remotion versions, JavaScript bundling, bundled FFmpeg availability, CPU/RAM, and launching/closing an empty Chrome Headless Shell. It uploads an environment JSON report with one-day retention. No compositions are loaded and no frames or videos are rendered.

Standard Linux runners in public repositories are documented as 4 vCPU / 16 GB RAM and free. Both workflows skip execution if this repository becomes private. There are no push, pull-request or scheduled triggers, self-hosted runners, larger runners, deployments, or external cloud services.

## Future MP4 infrastructure — do not run during Phase 1

`render-mp4.yml` is prepared for Phase 2. It requires a manual trigger, an existing composition ID, and explicit `phase2_confirm=true` (default false). It will render H.264 MP4 on GitHub and upload `out/video.mp4` as a downloadable artifact with one-day retention. The current empty root cannot produce a video. Future rendering and artifact delivery are not verified until a Phase 2 test succeeds.

## Authorization

To publish files, the authenticated GitHub account must have write access to this repository and permission to modify workflows. To dispatch the verification workflow, it also needs Actions write access. CLI OAuth tokens commonly need `repo` and `workflow` scopes; fine-grained tokens need repository Contents and Workflows write access plus Actions write for dispatch. Never commit tokens.

## Official references

- [Remotion manual installation](https://www.remotion.dev/docs/brownfield)
- [Remotion package version checks](https://www.remotion.dev/docs/cli/versions)
- [Remotion browser management](https://www.remotion.dev/docs/cli/browser)
- [GitHub standard runner specifications](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)
- [GitHub workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data)
