import Vue from 'vue'

export default Vue.directive('focus', {
  update: function (el) {
    el.focus()
  }
})
