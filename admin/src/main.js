import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
// import axios from 'axios'
// axios.defaults.baseURL='http://localhost:3000/admin/api'
// axios.defaults.headers.post['Content-Type'] = 'application/json'  设置post参数格式

import http from './http'
Vue.prototype.$http=http

Vue.mixin({
  computed:{
    uploadUrl(){
      return this.$http.defaults.baseURL+'/upload'
    }
  },
  methods:{
    getAuthHeaders(){
      return{
        Authorization : `Bearer ${localStorage.token || ''}`
      }
    }
  }
})
import './style.css'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
