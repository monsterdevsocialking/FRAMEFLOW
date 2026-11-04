# FRAMEFLOW

**Creative video editor for the web.** A creator-first video editing experience built on top of the MIT-licensed FreeCut project.

> Current repository status: FRAMEFLOW product shell and integration groundwork. The upstream FreeCut engine has not yet been vendored into this repository. Do not describe this shell as a working video renderer until the upstream runtime is integrated and tested.

## Upstream and licensing

The intended upstream base is [FreeCut](https://github.com/walterlow/freecut), licensed under the MIT License. Its original copyright and license notice must be preserved when its source is imported. This repository's new FRAMEFLOW-authored files are also MIT unless a file says otherwise. Third-party dependencies, fonts, media, AI models, and codecs retain their own licenses and must be audited independently.

## Product direction

- Browser-first, local-first editing; media should remain on the user's device.
- Creator-friendly workflow for vertical, square, and landscape social video.
- Preserve FreeCut's timeline, preview, WebGPU/WebCodecs pipeline, project storage, and export rather than reimplementing those systems.
- FRAMEFLOW visual identity is independent and does not imply endorsement by FreeCut maintainers.

## Current starter

The initial app shell includes a responsive editor workspace, local media selection and preview, aspect-ratio presets, and an illustrative multi-track timeline UI. Timeline controls are currently UI scaffolding and do not yet alter an actual FreeCut project or render a finished timeline. Real editing/export becomes available after the upstream engine is integrated.

## Run

This shell uses Vite + React + TypeScript.

```bash
npm install
npm run dev
``

## Browser target

Use a recent Chromium browser (Chrome/Edge) for future WebGPU, WebCodecs, OPFS, and File System Access API integration. Browser capability support varies by device.

## MIT notice

See [LICENSE](./LICENSE). When incorporating FreeCut source, retain its original MIT license and copyright notice in all substantial copies.
