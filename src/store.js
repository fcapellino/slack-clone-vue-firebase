import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex)

const state = {
  currentUser: null
}
const mutations = {
  SET_USER: function (state, user) {
    state.currentUser = user
  }
}
const actions = {
  setUser: function (state, user) {
    state.commit('SET_USER', user)
  }
}
const getters = {
  getCurrentUser: function () {
    return state.currentUser
  }
}

const store = new vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
