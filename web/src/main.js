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
  baseURL:process.env.VUE_APP_API_URL||'/web/api'
  // baseURL:'http://localhost:3000/web/api'
})
axios.interceptors.response.use(res=>{
  return res
},err => {
  if (err.response.data.message){
    Vue.prototype.$message({
      type:'error',
      message:err.response.data.message
    })
  }
  return Promise.reject(err)
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


import { Swipe, SwipeItem ,Button} from 'mint-ui';
import 'mint-ui/lib/style.css'
import ElementUI from 'element-ui'
import './styles.scss'

Vue.use(ElementUI)
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Button.name, Button);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
