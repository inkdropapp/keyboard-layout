#include "keyboard-layout-manager.h"

Napi::Object KeyboardLayoutManager::Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = DefineClass(env, "KeyboardLayoutManager", {
    InstanceMethod("getCurrentKeyboardLayout", &KeyboardLayoutManager::GetCurrentKeyboardLayout),
    InstanceMethod("getCurrentKeyboardLanguage", &KeyboardLayoutManager::GetCurrentKeyboardLanguage),
    InstanceMethod("getInstalledKeyboardLanguages", &KeyboardLayoutManager::GetInstalledKeyboardLanguages),
    InstanceMethod("getCurrentKeymap", &KeyboardLayoutManager::GetCurrentKeymap),
  });

  exports.Set("KeyboardLayoutManager", func);
  return exports;
}

static Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return KeyboardLayoutManager::Init(env, exports);
}

NODE_API_MODULE(keyboard_layout_manager, InitAll)
