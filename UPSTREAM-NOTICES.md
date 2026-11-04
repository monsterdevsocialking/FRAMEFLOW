# Third-party notices

FRAMEFLOW integrates the browser-based video editor [FreeCut](https://github.com/walterlow/freecut).

- Upstream repository: https://github.com/walterlow/freecut
- Pinned upstream commit: `5ceeeb388eef5423640b7db157706274bf1b8165`
- License: MIT
- The upstream MIT license is copied into the deployed application at `/third-party-licenses/FREECUT-MIT-LICENSE.txt`.

The build downloads the pinned upstream source, applies a small FRAMEFLOW white-label patch to the document title, application logo text, language preference key, and root route, then builds the original editor. The editor's timeline, media pipeline, project storage, preview, and export are upstream functionality; they are not reimplemented in the FRAMEFLOW shell.

Third-party packages, fonts, codecs, and AI models retain their own licenses and terms. The upstream repository and its dependency notices remain authoritative.
