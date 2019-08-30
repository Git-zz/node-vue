import Vue from 'vue'
import App from './App.vue'
import './assets/scss/style.scss'
import router from './router'
import './assets/iconfont/iconfont.css'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'

import axios from 'axios'
Vue.prototype.$http=axios.create({
  baseURL:'http://localhost:3000/web/api'
})

import Card from './components/Card'
Vue.component('m-card',Card)

import ListCard from './components/ListCard'
Vue.component('m-list-card',ListCard)

import Comment from './components/Comment'
Vue.component('m-comment',Comment)

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
