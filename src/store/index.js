import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
// import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex)
export default new Vuex.Store({
  // plugins: [createPersistedState()],
  state: {
    time_down: []
  },
  mutations: {
    settime_down (state, time) {
      // console.log(time);
      state.time_down.push(time)
      // console.log(state.time_down);

    },
  },
  actions: {
    //
  },
  modules: {
    user,
    app
  }
})
