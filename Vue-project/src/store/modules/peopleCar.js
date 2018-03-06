export default {
  state: {
    position1: '',
    position2: '',
    coords1: '',
    coords2: ''
  },
  mutations: {
    setPosition1: function (state, newState) {
      state.position1 = newState
    },
    setPosition2: function (state, newState) {
      state.position2 = newState
    },
    setCoords1: function (state, newState) {
      state.coords1 = newState
    },
    setCoords2: function (state, newState) {
      state.coords2 = newState
    }
  },
  // this.$store.dispatch('useSetStart',参数)
  // action是异步的
  actions: {
    useSet1: function (context, newState) {
      context.commit('setPosition1', newState)
    },
    useSet2: function (context, newState) {
      context.commit('setPosition2', newState)
    }
  },
  getters: {
    getPosition1: function (state, getters) {
      return state.position1
    },
    getPosition2: function (state, getters) {
      return state.position2
    }
  }
}
