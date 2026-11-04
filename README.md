# FRAMEFLOW

**A browser-based video editor built on the real FreeCut editing engine.**

FRAMEFLOW uses the MIT-licensed [FreeCut](https://github.com/walterlow/freecut) project as its editing engine. The production build pins a reviewed upstream commit, applies a small FRAMEFLOW identity patch, and builds the complete upstream application rather than a mock editor shell.

## What works in the engine

The upstream editor includes a multi-track timeline, video/audio/image/text clips, trim and split operations, track controls, preview and playback, effects, transitions, keyframes, audio controls, project storage, and browser-based export. Feature availability depends on browser capabilities; Chromium-based browsers are recommended.

## Run locally

The production build script downloads the pinned FreeCut source and builds it:

```bash
npm install
npm run build
```

To develop directly against the engine, clone [FreeCut](https://github.com/walterlow/freecut), install its dependencies with `ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm ci`, and run `npm run dev` in that checkout.

## Architecture and licensing

- FRAMEFLOW-authored deployment and integration scripts are MIT licensed under [LICENSE](./LICENSE).
- FreeCut is MIT licensed. Its original notice is preserved in the deployed app at `/third-party-licenses/FREECUT-MIT-LICENSE.txt`.
- Upstream source is pinned in `scripts/build-engine.mjs`; the integration patch is intentionally small.
- Third-party packages, fonts, codecs, and AI models retain their own licenses and terms.

FRAMEFLOW is an independent project and is not endorsed by the FreeCut maintainers.
