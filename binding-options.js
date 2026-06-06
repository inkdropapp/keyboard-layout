'use strict'

// Shared by lib/keyboard-layout.js (the runtime loader) and the
// `pkg-prebuilds-verify` install hook. `name` must match the gyp target_name in
// binding.gyp, and `napi_versions` must match the NAPI_VERSION define.
module.exports = {
  name: 'keyboard-layout-manager',
  napi_versions: [8]
}
