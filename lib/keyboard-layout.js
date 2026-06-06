'use strict'

const path = require('path')
const Emitter = require('event-kit').Emitter
const { KeyboardLayoutManager } = require('node-gyp-build')(path.join(__dirname, '..'))

const emitter = new Emitter()
const keymapsByLayoutName = new Map()

const manager = new KeyboardLayoutManager(() => {
  emitter.emit('did-change-current-keyboard-layout', getCurrentKeyboardLayout())
})

function getCurrentKeymap () {
  const currentLayout = getCurrentKeyboardLayout()
  let currentKeymap = keymapsByLayoutName.get(currentLayout)
  if (!currentKeymap) {
    currentKeymap = manager.getCurrentKeymap()
    keymapsByLayoutName.set(currentLayout, currentKeymap)
  }
  return currentKeymap
}

function getCurrentKeyboardLayout () {
   return manager.getCurrentKeyboardLayout()
}

function getCurrentKeyboardLanguage () {
  return manager.getCurrentKeyboardLanguage()
}

function getInstalledKeyboardLanguages () {
  var languages = {}

  for (var language of (manager.getInstalledKeyboardLanguages() || [])) {
    languages[language] = true
  }

  return Object.keys(languages)
}

function onDidChangeCurrentKeyboardLayout (callback) {
  return emitter.on('did-change-current-keyboard-layout', callback)
}

function observeCurrentKeyboardLayout (callback) {
  callback(getCurrentKeyboardLayout())
  return onDidChangeCurrentKeyboardLayout(callback)
}

module.exports = {
  getCurrentKeymap: getCurrentKeymap,
  getCurrentKeyboardLayout: getCurrentKeyboardLayout,
  getCurrentKeyboardLanguage: getCurrentKeyboardLanguage,
  getInstalledKeyboardLanguages: getInstalledKeyboardLanguages,
  onDidChangeCurrentKeyboardLayout: onDidChangeCurrentKeyboardLayout,
  observeCurrentKeyboardLayout: observeCurrentKeyboardLayout
}
