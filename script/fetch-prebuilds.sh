#!/usr/bin/env bash
set -euo pipefail

# Download the prebuilt Node-API binaries attached to a GitHub Release and
# assemble them into prebuilds/, so the next `npm publish` ships them inside the
# package tarball (node-gyp-build loads from there, not from GitHub Releases).
#
# Prereqs: gh CLI (authenticated: `gh auth login`), tar, node.
# Usage:   script/fetch-prebuilds.sh [vX.Y.Z]
#          Defaults to v<version from package.json>.
#
# Typical release flow:
#   npm version 2.1.0 && git push --follow-tags   # CI builds + attaches binaries
#   npm run fetch-prebuilds                        # this script
#   npm publish                                    # prompts for your 2FA OTP

cd "$(dirname "$0")/.."

TAG="${1:-v$(node -p "require('./package.json').version")}"

echo "==> Fetching prebuilds for $TAG"
rm -rf prebuilds
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

gh release download "$TAG" --pattern '*.tgz' --dir "$tmp"
for f in "$tmp"/*.tgz; do
  echo "    extracting $(basename "$f")"
  tar -xzf "$f"
done

echo "==> Assembled prebuilds:"
find prebuilds -type f | sort

count="$(find prebuilds -name '*.node' | wc -l | tr -d ' ')"
echo "==> $count binaries ready (expected 6: win/mac/linux x x64/arm64)."
echo
echo "Next:  npm publish        # ships the binaries; prompts for your 2FA OTP"
