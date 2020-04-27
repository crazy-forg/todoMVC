// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


Vue.config.productionTip = false

// 全局自定义指令
// 页面载入时自动聚焦到输入框
Vue.directive('focus', {
  inserted: function (el) {
      el.focus()
  }
})
// 双击编辑时自动聚焦
Vue.directive('todo-focus', {
  update: function (el, binding) {
          el.focus()
  }
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
