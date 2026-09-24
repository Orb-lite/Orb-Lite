---
name: Artifact package manager
description: Dependency installation boundary between the root workspace and the visual-flyer-builder artifact.
---

The `visual-flyer-builder` artifact owns its dependency graph through `package.json` and `bun.lock`; install or refresh artifact packages from that directory with Bun. Do not regenerate the root workspace lockfile for an artifact-only dependency.

**Why:** A root pnpm install can replace shared React, Leaflet, and email package links with incompatible versions, producing unrelated TypeScript errors or missing transitive modules during the artifact build.

**How to apply:** Keep root workspace dependency changes separate from artifact changes, and validate with the artifact's own Bun install/build path after adding packages.