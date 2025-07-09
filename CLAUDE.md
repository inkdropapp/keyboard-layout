# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a native Node.js module that provides keyboard layout detection and key mapping functionality across macOS, Windows, and Linux/FreeBSD platforms. It originated from the Atom project and is now maintained by Inkdrop.

## Commands

### Build and Install
```bash
npm install  # Builds native module and installs dependencies
```

### Run Tests
```bash
npm test              # Runs platform-specific tests using Jest
npm test -- --coverage  # Run tests with coverage report
```

### Development
```bash
npm rebuild  # Rebuild native module after C++ changes
```

## Architecture

### High-Level Structure
- **JavaScript API** (`lib/keyboard-layout.js`): Main entry point providing the public API
- **Native Bindings** (`src/`): Platform-specific C++ implementations
  - `keyboard-layout-manager.h`: Abstract interface defining the API
  - `keyboard-layout-manager-mac.mm`: macOS implementation using AppKit
  - `keyboard-layout-manager-windows.cc`: Windows implementation using Win32 API
  - `keyboard-layout-manager-linux.cc`: Linux/FreeBSD implementation using X11/xkbfile

### Key Design Patterns
1. **Platform Abstraction**: Uses conditional compilation in `binding.gyp` to include platform-specific implementations
2. **Event System**: Uses `event-kit` for layout change notifications
3. **Native Bridge**: Uses `nan` (Native Abstractions for Node.js) for V8 compatibility across Node versions

### API Surface
The module exports 6 main functions:
- `getCurrentKeyboardLayout()`: Returns current layout ID
- `getCurrentKeyboardLanguage()`: Returns current language
- `getInstalledKeyboardLanguages()`: Lists all available languages
- `getCurrentKeymap()`: Maps all keys to their characters
- `getCurrentKeyboardLayoutSync()`: Synchronous version of layout detection
- `onDidChangeCurrentKeyboardLayout()`: Observable for layout changes

## Platform-Specific Notes

### macOS
- Returns layout IDs like `"com.apple.keylayout.US"`
- Uses Carbon framework for key mapping
- Requires no special dependencies

### Windows
- Returns layout IDs as hex strings (e.g., `"00000409"` for US English)
- Uses Windows Input Method Manager API
- Requires no special dependencies

### Linux/FreeBSD
- Requires X11 and xkbfile libraries at runtime
- Returns X11 keyboard group indices
- Test coverage limited to basic functionality

## Testing Strategy
- Tests are in `spec/keyboard-layout-spec.js`
- Uses Jest test framework with configuration in `jest.config.js`
- Platform-specific test cases with conditional execution
- Mock support for CI environments without displays
- Focus on public API behavior rather than internals