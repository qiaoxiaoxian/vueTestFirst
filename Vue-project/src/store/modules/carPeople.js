export default {
  state: {
    position3: '',
    position4: '',
    coords3: '',
    coords4: ''
  },
  mutations: {
    setPosition3: function (state, newState) {
      state.position3 = newState
    },
    setPosition4: function (state, newState) {
      state.position4 = newState
    },
    setCoords3: function (state, newState) {
      state.coords3 = newState
    },
    setCoords4: function (state, newState) {
      state.coords4 = newState
    }
  },
  // actions是异步调用mutations
  // this.$store.dispatch('useState',参数)
  actions: {
    useSet3: function (state, newState) {
      state.commit('setPosition3', newState)
    },
    useSet4: function (state, newState) {
      state.commit('setPosition4', newState)
    }
  },
  getters: {
    getPosition3: function (state, newState) {
      return state.position3
    },
    getPosition4: function (state, newState) {
      return state.position4
    }
  }
}
