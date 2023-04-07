import vue from 'vue'
import vuex from 'vuex'

vue.use(vuex)

const state = {
    currentUser: null,
    currentChannel: null
}
const mutations = {
    SET_USER: function (state, user) {
        state.currentUser = user
    },
    SET_CURRENT_CHANNEL: function (state, channel) {
        state.currentChannel = channel
    }
}
const actions = {
    setUser: function (state, user) {
        state.commit('SET_USER', user)
    },
    setCurrentChannel: function (state, channel) {
        state.commit('SET_CURRENT_CHANNEL', channel)
    }
}
const getters = {
    getCurrentUser: function () {
        return state.currentUser
    },
    getCurrentChannel: function () {
        return state.currentChannel
    }
}

const store = new vuex.Store({
    state,
    mutations,
    actions,
    getters
})

export default store
