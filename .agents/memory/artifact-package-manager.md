---
name: Artifact package manager
description: Dependency installation boundary between the root workspace and the visual-flyer-builder artifact.
---

The `visual-flyer-builder` artifact owns its dependency graph through `package.json` and `bun.lock`; install or refresh artifact packages from that directory with Bun. Do not regenerate the root workspace lockfile for an artifact-only dependency.

**Why:** A root pnpm install can replace shared React, Leaflet, and email package links with incompatible versions, producing unrelated TypeScript errors or missing transitive modules during the artifact build.

**How to apply:** Keep root workspace dependency changes separate from artifact changes, and validate with the artifact's own Bun install/build path after adding packages.

Publishing can also fail before the build when Replit's package proxy temporarily refuses tarball downloads. If the artifact's frozen Bun install succeeds locally and the package endpoints recover, retry Publish instead of rewriting the lockfile.

**Why:** A broad set of unrelated tarballs failing together indicates package-service availability, not a single dependency or application defect.

**How to apply:** Check the package endpoints and run the artifact's frozen install; preserve the internal Replit/Lovable lockfile URLs when they respond successfully.