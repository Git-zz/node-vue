import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Content from './views/Content.vue'
import Game from './views/Game.vue'
import Article from './views/Article.vue'
import Hero from './views/Hero.vue'
import Video from './views/Video.vue'
import Way from './views/Way.vue'
import HeroCon from './views/HeroCon'
import HeroVideo from './views/HeroVideo'
import Race from './views/Race'
import GameCon from './views/GameCon'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Main,
      children:[
        {path:'/',name:'home',component:Home},
        {path:'/content',name:'content',component:Content,children: [
            {path:'/heroCon/:id',name:'heroCon',component:HeroCon,props:true}
          ]},
        {path:'/game',name:'game',component:Game},
        {path:'/articles/:id',name:'article',component:Article,props:true},
        {path:'/videos/:id', name:'video', component:Video, props:true},
        {path:'/heroVideo/:id', name:'heroVideo', component:HeroVideo, props:true},
        {path:'/ways/:id', name:'way', component:Way, props:true},
        {path:'/races/:id', name:'race', component:Race, props:true},
        {path:'/gameCon/:id', name:'gameCon', component:GameCon, props:true},


      ]
    },
    {
      path: '/heroes/:id',
      name: 'hero',
      component:Hero,
      props:true
    },

  ]
})
