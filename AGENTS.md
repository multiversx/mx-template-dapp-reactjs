# AGENTS.md — mx-template-dapp-reactjs

Guidance for AI agents (and humans) working with code in this repository.

## What this is

The MultiversX dApp Template for React.js — a reference implementation of [@multiversx/sdk-dapp](https://www.npmjs.com/package/@multiversx/sdk-dapp) demonstrating MultiversX wallet authentication and transaction signing. The source is plain JavaScript/JSX (no `tsconfig.json`).

Toolchain: **Node 24+**, **pnpm 11** (there is a `pnpm-lock.yaml` — use pnpm, not npm/yarn), Vite 8 (Rolldown).

## Commands

Dev server (HTTPS on https://localhost:3000, via `@vitejs/plugin-basic-ssl`) — pick the target network:

```bash
pnpm start-devnet     # or start-testnet / start-mainnet
```

Build (to `dist/`):

```bash
pnpm build-devnet     # or build-testnet / build-mainnet
```

Lint (must pass; ESLint enforces formatting via the prettier plugin):

```bash
pnpm lint
pnpm lint:fix
```

There is no test runner configured in this repo.

## Network configuration is selected by file copy

The `start-*` / `build-*` scripts `cp src/config/config.<network>.js` over `src/config/index.js` (via `&&`, before Vite runs). So:

- **`src/config/index.js` is a generated file** — do not edit it by hand; it is overwritten on every start/build. Edit `config.devnet.js`, `config.testnet.js`, `config.mainnet.js`, or the shared `sharedConfig.js` instead.
- Each per-network config sets `API_URL`, `contractAddress`, `environment`, and re-exports `sharedConfig.js` (contains `walletConnectV2ProjectId`, `nativeAuth`, sample batch-transaction SC data, etc.).
- `main.jsx` imports `environment` from `@/config` and passes it to `initApp` — the copy mechanism is the single source of truth for the network.

## Architecture

- **`src/lib/` is a wrapper layer around the SDK.** `@multiversx/sdk-dapp` is imported via deep paths (e.g. `@multiversx/sdk-dapp/out/react/account/useGetAccount`). Rather than scatter those deep imports across the app, `src/lib/sdkDapp/*` re-exports them grouped by concern (`.hooks`, `.methods`, `.managers`, `.providers`, `.helpers`, `.constants`, `.types`, plus wrapped `components/`). App code should import from `@/lib` (or `@/lib/sdkDapp/...`), **not** from `@multiversx/...` deep paths directly. When you need an SDK export not yet surfaced, add it to the appropriate `src/lib/sdkDapp/*` file.
- **Path alias `@` → `/src`** (configured in `vite.config.js` and `eslint.config.js`). Always use `@/...` imports.
- **Routing** (`src/routes/routes.js` + `src/App.jsx`): routes are a data array; `App.jsx` maps them and wraps each in `AuthenticatedRoute`, which redirects to `/unlock` when `route.authenticatedRoute` is true and the user is not logged in (`useGetIsLoggedIn`).
- **Transaction flow** (see `src/pages/Dashboard/widgets/SendToSelf/hooks/useSendToSelfTransaction.js` as the canonical example): build a `Transaction` from `@multiversx/sdk-core` → `getAccountProvider().signTransactions()` → `TransactionManager.getInstance().send()` → `.track()` for toast/status. Account nonce comes from `useGetAccount()`, chain ID from `useGetNetworkConfig()`.
- **Pages → widgets**: `Dashboard` composes self-contained `widgets/` (Account, SendToSelf, SignMessage, etc.), each a folder with its own `components/`, `hooks/`, and `helpers/` and a barrel `index.js`.
- **Barrel files everywhere**: nearly every folder exposes an `index.js` re-exporting its contents; import from the folder, not the file.

## Conventions enforced by ESLint

- `sort-exports/sort-exports` and `import/order` (alphabetized, grouped builtin→external→internal→parent→sibling→index, `react` hoisted first, no blank lines between groups) are **errors** — keep exports and imports sorted or `pnpm lint` fails.
- `import/no-unresolved` ignores `@multiversx/.*` (deep `/out/` paths don't resolve statically) and `.svg?react` virtual imports. `*.config.{js,cjs}` files disable a few `import/*` rules that misfire on Vite plugin dist bundles.

## Verification

To prove a change works, run in order:

```bash
pnpm lint                # must pass
pnpm build-devnet        # production build must succeed
```

There are no automated tests — for login/transaction changes, start `pnpm start-devnet`, open `https://localhost:3000`, and exercise the flow manually. After `build-testnet`/`build-mainnet` runs, run a devnet build (or `cp src/config/config.devnet.js src/config/index.js`) so the committed `src/config/index.js` shows no diff.

## Other templates

The same template dApp exists for other frameworks — useful when a task actually targets a different stack:

| Template | Stack | Repository |
| --- | --- | --- |
| React (TypeScript) | React 18 · TypeScript · Vite | [mx-template-dapp](https://github.com/multiversx/mx-template-dapp) |
| React (JavaScript) **← this repo** | React 19 · JSX · Vite | [mx-template-dapp-reactjs](https://github.com/multiversx/mx-template-dapp-reactjs) |
| Next.js | Next.js 16 (App Router) · TypeScript | [mx-template-dapp-nextjs](https://github.com/multiversx/mx-template-dapp-nextjs) |
| SolidJS | SolidJS · TypeScript · Vite | [mx-template-dapp-solidjs](https://github.com/multiversx/mx-template-dapp-solidjs) |
| Vue | Vue 3 · TypeScript · Vite | [mx-template-dapp-vue](https://github.com/multiversx/mx-template-dapp-vue) |
| Angular | Angular 20 · TypeScript | [mx-template-dapp-angular](https://github.com/multiversx/mx-template-dapp-angular) |
| React Native | React Native | [mx-template-dapp-react-native](https://github.com/multiversx/mx-template-dapp-react-native) |
