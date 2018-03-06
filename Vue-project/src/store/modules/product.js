export default {
  state: {
    position5: '',
    position6: '',
    coords5: '',
    coords6: ''
  },
  mutations: {
    setPosition5: function (state, newState) {
      state.position5 = newState
    },
    setPosition6: function (state, newState) {
      state.position6 = newState
    },
    setCoords5: function (state, newState) {
      state.coords5 = newState
    },
    setCoords6: function (state, newState) {
      state.coords6 = newState
    }
  },
  actions: {
    useSet5: function (state, newState) {
      state.commit('setPosition5', newState)
    },
    useSet6: function (context, newState) {
      console.log(context)
      context.commit('setPosition6', newState)
    }
  },
  getters: {
    getPosition5: function (state, newState) {
      return state.position5
    },
    getPosition6: function (state, newState) {
      return state.position6
    }
  }
}
