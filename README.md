# inkdrop-keyboard-layout

[![CI](https://github.com/inkdropapp/keyboard-layout/actions/workflows/ci.yml/badge.svg)](https://github.com/inkdropapp/keyboard-layout/actions/workflows/ci.yml)

Read and observe the current keyboard layout on macOS, Windows, and Linux/FreeBSD.

Maintained by [Inkdrop](https://www.inkdrop.app/); originally from the Atom project. This is a [Node-API (N-API)](https://nodejs.org/api/n-api.html) native addon, so a single prebuilt binary per platform/arch works on every modern Node.js and Electron release (including Electron 42+) — no per-version rebuild or `electron-rebuild` required.

## Installation

```sh
npm install inkdrop-keyboard-layout
```

Prebuilt binaries for macOS, Windows, and Linux (x64 and arm64) are bundled in the package and selected automatically by [node-gyp-build](https://github.com/prebuild/node-gyp-build). If no prebuild matches your platform, it is compiled from source on install, which requires a C++ toolchain (and, on Linux/FreeBSD, the X11 development headers `libx11-dev` and `libxkbfile-dev`).

## Usage

To get the current keyboard layout, call `getCurrentKeyboardLayout`. It returns the string identifier of the current layout based on the value returned by the operating system.

```js
const KeyboardLayout = require("inkdrop-keyboard-layout");
KeyboardLayout.getCurrentKeyboardLayout(); // => "com.apple.keylayout.Dvorak"
```

To return characters for various modifier states based on a DOM 3 `KeyboardEvent.code` value and the current system keyboard layout, use `getCurrentKeymap()`:

```js
const KeyboardLayout = require("inkdrop-keyboard-layout");
KeyboardLayout.getCurrentKeymap()["KeyS"];
/*
On a US layout, this returns:
{
  unmodified: 's',
  withShift: 'S',
  withAltGraph: 'ß',
  withAltGraphShift: 'Í'
}
*/
```

The remaining methods are `getCurrentKeyboardLanguage()` (returns the current language) and `getInstalledKeyboardLanguages()` (returns an array of available languages).

`onDidChangeCurrentKeyboardLayout` and `observeCurrentKeyboardLayout` register a callback; `observeCurrentKeyboardLayout` also invokes it immediately with the current layout:

```js
const KeyboardLayout = require("inkdrop-keyboard-layout");
const subscription = KeyboardLayout.observeCurrentKeyboardLayout((layout) =>
  console.log(layout),
);
subscription.dispose(); // to unsubscribe later
```

> **Note:** this release does not emit live layout-change events — `observeCurrentKeyboardLayout` fires once with the current layout, but the callbacks are not invoked again when the layout later changes. (The native change-notification path was removed during the Node-API port; call `getCurrentKeyboardLayout()` when you need a fresh value.)

## Development

```sh
npm install        # install deps and build the addon
npm test           # run the jest specs
npm run rebuild    # rebuild the native addon after editing C++ in src/
```

## Releasing

Prebuilt binaries are built in CI and shipped **inside the npm package** — the loader (`node-gyp-build`) reads them from the installed package, not from GitHub Releases. Publishing is done locally so no long-lived npm token is stored in CI.

1. Bump the version and push the tag:

   ```sh
   npm version <patch|minor|major>
   git push --follow-tags
   ```

2. The [`Release` workflow](.github/workflows/release.yml) triggers on the `v*` tag, builds a Node-API prebuild for each target, and attaches them to a GitHub Release:

   | OS      | Architectures |
   | ------- | ------------- |
   | macOS   | x64, arm64    |
   | Linux   | x64, arm64    |
   | Windows | x64, arm64    |

3. Download those binaries into `prebuilds/` (requires the [GitHub CLI](https://cli.github.com/), authenticated via `gh auth login`):

   ```sh
   npm run fetch-prebuilds
   ```

4. Publish to npm (prompts for your 2FA one-time password):

   ```sh
   npm publish
   ```

Prebuilds are produced with [prebuildify](https://github.com/prebuild/prebuildify) and loaded with [node-gyp-build](https://github.com/prebuild/node-gyp-build).

The `prebuild` script passes `--name node.napi --tag-armv` so the binaries are named `node.napi.node` / `node.napi.armv8.node` rather than prebuildify's default `<package>.node`. Both names load fine via `node-gyp-build`, but this convention is also the one [`@electron/rebuild`](https://github.com/electron/rebuild) recognizes — so when a consumer (e.g. an Electron app rebuilding other native modules) runs it, this addon is **skipped** instead of needlessly recompiled from source.
