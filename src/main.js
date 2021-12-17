import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from '@/apis/http.js'
import 'element-ui/lib/theme-chalk/index.css';
import elementUi from "element-ui"
import 'swiper/css/swiper.min.css'

Vue.config.productionTip = false
Vue.use(elementUi)
Vue.prototype.$axios = http

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
