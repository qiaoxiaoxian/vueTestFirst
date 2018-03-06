import Vue from 'vue'
import Vuex from 'vuex'
import peopleCar from './modules/peopleCar'
import carPeople from './modules/carPeople'
import product from './modules/product'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageName: 1,
    // 记录是加载第一次加载的状态
    status: 1
  },
  getter: {},
  mutations: {
    setPageName: function (state, newState) {
      state.pageName = newState
    }
  },
  actions: {},
  modules: {
    a: peopleCar,
    b: carPeople,
    c: product
  }
})
