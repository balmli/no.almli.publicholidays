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
- `.homeybuild/` — generated Homey build output; do not edit it directly.

## Setup and validation

Use the Node.js version in `.nvmrc` (currently Node 18) and install locked dependencies with:

```sh
npm ci
```

Before handing off a change, run:

```sh
npm run build
```

There is currently no automated test suite. For changes to Homey metadata or Flow cards, also run `npx homey app validate` when the Homey CLI and its required credentials are available. Report any validation that could not be run.

GitHub Actions runs the TypeScript build and Homey `publish`-level validation for pushes to `main` and pull requests. Versioning and publishing are separate manual workflows. Publishing requires the `HOMEY_PAT` secret and must only be triggered when explicitly requested.

## Homey Apps SDK MCP

The `homey-apps-sdk` MCP server is configured for this development environment at `https://apps.developer.homey.app/~gitbook/mcp`. Use it as the primary source for current Homey Apps SDK documentation, APIs, manifest schemas, Flow-card behavior, and platform conventions instead of relying on memory. If its tools are unavailable in the current session, restart Codex or open a new task so the MCP configuration is reloaded. Clearly report when the MCP could not be consulted.

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
