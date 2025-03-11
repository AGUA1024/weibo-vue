import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";
import getters from "./getters";
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })],
  state,
  getters,
  mutations,
  actions,
  modules: {
  }
})
