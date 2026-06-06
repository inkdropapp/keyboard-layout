#ifndef SRC_KEYBORD_LAYOUT_OBSERVER_H_
#define SRC_KEYBORD_LAYOUT_OBSERVER_H_

#include <napi.h>

#if defined(__linux__) || defined(__FreeBSD__)
#include <X11/Xlib.h>
#endif // __linux__ || __FreeBSD__

class KeyboardLayoutManager : public Napi::ObjectWrap<KeyboardLayoutManager> {
 public:
  static Napi::Object Init(Napi::Env env, Napi::Object exports);

  KeyboardLayoutManager(const Napi::CallbackInfo& info);
  ~KeyboardLayoutManager();

  Napi::Value GetCurrentKeyboardLayout(const Napi::CallbackInfo& info);
  Napi::Value GetCurrentKeyboardLanguage(const Napi::CallbackInfo& info);
  Napi::Value GetInstalledKeyboardLanguages(const Napi::CallbackInfo& info);
  Napi::Value GetCurrentKeymap(const Napi::CallbackInfo& info);

 private:
#if defined(__linux__) || defined(__FreeBSD__)
  Display *xDisplay;
  XIC xInputContext;
  XIM xInputMethod;
#endif
};

#endif  // SRC_KEYBORD_LAYOUT_OBSERVER_H_
