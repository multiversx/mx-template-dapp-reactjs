# MultiversX Template dApp (React + JavaScript)

The **MultiversX dApp Template** built with plain-JavaScript [React](https://react.dev/) 19 (JSX, no TypeScript) and [Vite](https://vitejs.dev/). It is a minimal reference implementation of [@multiversx/sdk-dapp](https://www.npmjs.com/package/@multiversx/sdk-dapp) v5, demonstrating:

- wallet authentication (browser extension, xPortal / WalletConnect, web wallet, Ledger)
- transaction signing, sending, and tracking
- message signing

> **Looking for another framework?** The same dApp exists for TypeScript React, Next.js, Vue, Angular, SolidJS, and React Native — see [Other templates](#other-templates). The [TypeScript React template](https://github.com/multiversx/mx-template-dapp) is the most complete one (batch transactions, native auth, custom provider, tests).

## Requirements

- Node.js 24+
- pnpm 11+ (the repo ships a `pnpm-lock.yaml` — use pnpm, not npm or yarn)

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the dev server on the desired network

```bash
pnpm start-devnet     # or start-testnet / start-mainnet
```

Open [https://localhost:3000](https://localhost:3000) (note **https** — the dev server uses a self-signed certificate, because wallet providers only work on secure origins; accept the browser warning).

### 3. Build for production

```bash
pnpm build-devnet     # or build-testnet / build-mainnet
```

The output goes to the `dist/` folder, ready to deploy to any static host.

## Available scripts

| Script | Description |
| --- | --- |
| `pnpm start` | Dev server with the devnet config |
| `pnpm start-devnet` / `start-testnet` / `start-mainnet` | Copy the network config, then run the Vite dev server on `https://localhost:3000` |
| `pnpm build` | Production build with the devnet config |
| `pnpm build-devnet` / `build-testnet` / `build-mainnet` | Copy the network config, then build to `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm lint` / `pnpm lint:fix` | ESLint (Prettier rules enforced) |

There is no test runner configured in this template.

## Network configuration

There is **no `.env` file**. The active network (devnet / testnet / mainnet) is selected at dev/build time by copying one of the per-network config files over the generated index:

- `src/config/config.devnet.js`, `config.testnet.js`, `config.mainnet.js` — per-network values (`API_URL`, `contractAddress`, `environment`)
- `src/config/sharedConfig.js` — values common to all networks (WalletConnect project ID, native auth flag, etc.)
- `src/config/index.js` — **generated** by the `start-*` / `build-*` scripts; never edit it by hand, it is overwritten on every run

The `environment` exported by the active config is passed to sdk-dapp's `initApp` in `src/main.jsx`, so the copy mechanism is the single source of truth for the network.

## Project structure

```
src/
├── assets/          # images, icons
├── components/      # shared presentational components
├── config/          # per-network configs (see Network configuration)
├── lib/             # SDK re-export layer — the only place with deep @multiversx/* imports
├── pages/           # Home, Dashboard (feature widgets), Unlock, Disclaimer, PageNotFound
├── routes/          # declarative route array consumed by App.jsx
├── wrappers/        # AuthenticatedRoute and other app-wide wrappers
├── App.jsx          # maps routes, applies auth gating
└── main.jsx         # entry: awaits initApp(config), then renders <App />
```

## How sdk-dapp is used

1. **Bootstrap** — `src/main.jsx` calls `initApp(config)` (environment from `src/config`, transaction-tracking callbacks, WalletConnect project ID) and renders the app only after it resolves.
2. **SDK import layer** — app code never imports `@multiversx/sdk-dapp/out/...` deep paths directly; everything is funneled through `src/lib/sdkDapp/*` re-exports grouped by concern (`.hooks`, `.methods`, `.managers`, `.providers`, `.helpers`, `.constants`, `.types`). Import from `@/lib`.
3. **Login** — the Unlock page opens sdk-dapp's `UnlockPanelManager`, which lists all available providers.
4. **Transactions** — see `src/pages/Dashboard/widgets/SendToSelf/hooks/useSendToSelfTransaction.js` for the canonical flow: build a `Transaction` → `getAccountProvider().signTransactions()` → `TransactionManager.getInstance().send()` → `.track()` for toast notifications.
5. **State** — account, network, and login data come from sdk-dapp's store via React hooks (`useGetAccount`, `useGetNetworkConfig`, `useGetIsLoggedIn`).

## Other templates

The same template dApp is implemented across several frameworks. If another stack suits your project better, start from one of these instead:

| Template | Stack | Repository |
| --- | --- | --- |
| React (TypeScript) | React 18 · TypeScript · Vite | [mx-template-dapp](https://github.com/multiversx/mx-template-dapp) |
| React (JavaScript) **← this repo** | React 19 · JSX · Vite | [mx-template-dapp-reactjs](https://github.com/multiversx/mx-template-dapp-reactjs) |
| Next.js | Next.js 16 (App Router) · TypeScript | [mx-template-dapp-nextjs](https://github.com/multiversx/mx-template-dapp-nextjs) |
| SolidJS | SolidJS · TypeScript · Vite | [mx-template-dapp-solidjs](https://github.com/multiversx/mx-template-dapp-solidjs) |
| Vue | Vue 3 · TypeScript · Vite | [mx-template-dapp-vue](https://github.com/multiversx/mx-template-dapp-vue) |
| Angular | Angular 20 · TypeScript | [mx-template-dapp-angular](https://github.com/multiversx/mx-template-dapp-angular) |
| React Native | React Native | [mx-template-dapp-react-native](https://github.com/multiversx/mx-template-dapp-react-native) |

## Links

- [@multiversx/sdk-dapp on GitHub](https://github.com/multiversx/mx-sdk-dapp) · [on npm](https://www.npmjs.com/package/@multiversx/sdk-dapp)
- [MultiversX developer docs](https://docs.multiversx.com/)
