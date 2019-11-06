import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import { isPlainObject, isArray } from '@/utils/tools'

Vue.use(Vuex)

const state = {
  MOCK: true,
  ajaxLoading: false,
  menuFold: false,
  lang: localStorage.getItem('lang') || 'zh-CN',
  userName: localStorage.getItem('userName') || '',
  accountId: localStorage.getItem('accountId') || '',
  curNavId: localStorage.getItem('curNavId') || '',
  curMenuId: localStorage.getItem('curMenuId') || '',
  curMenuName: localStorage.getItem('curMenuName') || '',
  curNav: {},
  navs: []
}

const mutations = {
  setState (state, payload) {
    if (isPlainObject(payload)) {
      saveState(payload)
    } else if (isArray(payload)) {
      payload.forEach(item => {
        isPlainObject(item) && saveState(item)
      })
    }
    function saveState (obj) {
      let { saveStorage } = obj
      let keys = Object.keys(obj)
      keys.forEach(v => {
        if (state.hasOwnProperty(v)) {
          state[v] = obj[v]
          saveStorage && localStorage.setItem(v, obj[v])
        }
      })
    }
  }
}

export default new Vuex.Store({
  state,
  mutations,
  modules
})
