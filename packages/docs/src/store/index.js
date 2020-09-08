// Vue
import Vue from 'vue'
import Vuex from 'vuex'

// Utilities
import pathify from '@/plugins/vuex-pathify'

// Modules
import * as modules from './modules'

// Globals
import { IS_SERVER } from '@/util/globals'

Vue.use(Vuex)

export function createStore () {
  const store = new Vuex.Store({
    modules,
    plugins: [pathify.plugin],
  })

  store.subscribe(mutation => {
    if (!mutation.type.startsWith('user/')) return

    store.dispatch('user/update', mutation)
  })

  if (!IS_SERVER) {
    store.dispatch('user/fetch')
    store.dispatch('pwa/init')
  }

  return store
}

export const ROOT_DISPATCH = Object.freeze({ root: true })
