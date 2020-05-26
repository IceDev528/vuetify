// Pathify
import { make } from 'vuex-pathify'
import headings from '@docs/headings'
import pages from '@docs/pages'

const state = {
  headings,
  pages,
}

const mutations = make.mutations(state)

const actions = {
  init: ({ dispatch }) => {
    dispatch('ads/fetch', null, { root: true })
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
