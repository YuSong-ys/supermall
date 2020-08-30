import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import lazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

//引入我们自定义的插件
import toast from './components/common/toast'

Vue.use(toast)
//使用懒加载
Vue.use(lazyLoad, {
  //加载时的替代图片
  loading: require('assets/img/common/placeholder.png')
})

//决绝移动端的300ms延迟
FastClick.attach(document.body)

//事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
