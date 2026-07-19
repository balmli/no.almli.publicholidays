# AGENTS.md

## Project overview

This repository contains a Homey SDK v3 app that exposes public-holiday checks as Flow condition cards and publishes holiday names as Flow tokens. The runtime is written in TypeScript and delegates holiday data and date calculations to `@balmli/homey-public-holidays`.

## Repository map

- `app.ts` — application lifecycle, Flow listeners, holiday checks, token updates, and scheduling.
- `app.json` — Homey app metadata and Flow card definitions.
- `locales/` — translation files.
- `assets/` — source app icon and store images.
- `README.md` and `.homeychangelog.json` — user-facing documentation and release notes.
- `.github/workflows/` — CI validation plus manually triggered versioning and App Store publishing.
- `.homeyignore` — files and directories excluded from the packaged Homey app.
- `.homeybuild/` — generated Homey build output; do not edit it directly.

## Setup and validation

Use the Node.js version in `.nvmrc` (currently Node 24.16.0) and install locked dependencies with:

```sh
npm ci
```

Before handing off a change, run:

```sh
npm run build
```

There is currently no automated test suite. For changes to Homey metadata or Flow cards, also run `npx homey app validate` when the Homey CLI and its required credentials are available. Report any validation that could not be run.

GitHub Actions runs the TypeScript build and Homey `publish`-level validation for pushes to `main` and pull requests. Versioning and publishing are separate manual workflows. Publishing requires the `HOMEY_PAT` secret and must only be triggered when explicitly requested.

The app installs `@balmli` dependencies from GitHub Packages. Workflows authenticate with their short-lived `GITHUB_TOKEN`; each private package must grant this repository read access under **Manage Actions access**. If that is not possible, configure a `GH_PACKAGES_TOKEN` repository secret containing a classic GitHub PAT with `read:packages`; the workflows automatically prefer that secret when present. Never commit a package token to `.npmrc`.

## Homey Apps SDK MCP

The `homey-apps-sdk` MCP server is configured for this development environment at `https://apps.developer.homey.app/~gitbook/mcp`. Use it as the primary source for current Homey Apps SDK documentation, APIs, manifest schemas, Flow-card behavior, and platform conventions instead of relying on memory. If its tools are unavailable in the current session, restart Codex or open a new task so the MCP configuration is reloaded. Clearly report when the MCP could not be consulted.

## Homey package contents

`.homeyignore` controls which repository files are excluded when Homey creates `.homeybuild` and the distributable app package. Keep the package small and runtime-focused:

- Whenever adding a development-only file, directory, generated output, local reference, or symlink, add an appropriate entry to `.homeyignore` in the same change.
- In particular, keep tests, scripts, CI configuration, agent instructions, local linked repositories such as `no.yr`, legacy `build/` output, and contributor documentation out of the package.
- Do not exclude runtime files required by the app, including `app.json`, `package.json`, compiled application code, production dependencies, `assets/`, or `locales/`.
- After changing `.homeyignore` or adding a top-level path, run Homey validation to regenerate `.homeybuild`, inspect its contents, and check its total size. Do not assume `.gitignore` also excludes files from the Homey package.

## Change guidelines

- Keep changes focused and follow the existing TypeScript style; avoid unrelated formatting churn.
- Treat Flow card IDs and argument names as a contract. Any change in `app.json` must match the listeners and argument access in `app.ts`.
- Preserve Homey's configured timezone when calculating dates. Do not replace `getLocalDate()` with a host-machine or UTC date without accounting for the app timezone.
- Preserve the recurring token-update schedule and cleanup behavior: scheduled work must stop after `onUninit()`, and subsequent runs must still be scheduled after recoverable errors.
- The last country used by a condition is persisted and drives the yesterday/today/tomorrow tokens. Consider this coupling when changing condition checks or settings.
- `is_school_holiday` is intentionally retained in the manifest as deprecated and throws at runtime; do not silently restore or remove it without a migration decision.
- Keep public, bank, and observance holiday semantics distinct. `is_holiday` and working-day checks intentionally combine public and bank holidays.
- Update `README.md` when supported countries, Flow behavior, or tokens change.
- Change `package.json`/`app.json` versions and `.homeychangelog.json` only as part of an explicit release task, keeping their version information consistent.
- Do not commit generated output, dependency directories, credentials, or `env.json`.

## Verification notes

When runtime behavior changes, manually exercise the affected Flow condition for today, yesterday, and tomorrow where applicable. Include at least one holiday and one non-holiday date, and verify that the three Flow tokens are refreshed for the most recently selected country.
