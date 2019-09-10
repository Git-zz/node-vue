<template>
  <div class="home">
    <mt-swipe :auto="4000">
      <mt-swipe-item><img src="../assets/images/f3bb936262973c96b972082f6568f0c4.jpeg"></mt-swipe-item>
      <mt-swipe-item><img src="../assets/images/6477a1acbdedcd0f4c836e7d21813935.jpeg"></mt-swipe-item>
      <mt-swipe-item><img src="../assets/images/e5acd51a07acb72ace6fd45aacc7c637.jpeg"></mt-swipe-item>
    </mt-swipe>


  <m-list-card icon="menu" title="新闻资讯" :categories="newsCats">
    <template #items="{category}">
      <router-link tag="div" :to="`/articles/${news._id}`" class="py-2 fs-lg d-flex" v-for="(news,i) in category.newsList" :key="i">
        <span class="text-info">[{{news.categoryName}}]</span>
        <span class="px-2">|</span>
        <span class="flex-1  text-ellipsis pr-2">{{news.title}}</span>
        <span class="text-grey-1 fs-sm">{{news.createdAt | date}}</span>
      </router-link>
    </template>
  </m-list-card>

    <m-list-card icon="card-hero" title="英雄列表" :categories="heroCats">
      <img src="../assets/images/9936541435635.jpg" class="w-100 mb-3">
      <template #items="{category}">
        <div class="d-flex flex-wrap" style="margin: 0 -0.5rem;">
          <router-link tag="div" :to="`/heroes/${hero._id}`"
                  class="p-2 text-center" style="width: 20%;"
               v-for="(hero,i) in category.heroList" :key="i">
            <img :src="hero.avatar" class="w-100">
            <div>{{hero.name}}</div>
          </router-link>
        </div>
      </template>
    </m-list-card>

    <m-list-card icon="video" title="精彩视频" :categories="videoCats">
      <template #items="{category}">
        <div class="d-flex flex-wrap" style="margin: 0 -0.5rem;">
          <router-link tag="div" :to="`/videos/${video._id}`"
                       class="p-2" style="width: 50%;"
                       v-for="(video,i) in category.videoList" :key="i">
            <img :src="video.cover" class="w-100" style="border-radius: 3px;height: 103.17px;">
            <div class="text-ellipsis-1 fs-lg mt-2">{{video.title}}</div>
            <div class="d-flex jc-between mt-2 text-grey-1 ai-center">
              <span><i class="sprite sprite-video mr-1"></i>{{video.click}}</span>
              <span>{{video.createdAt | date}}</span>
            </div>
          </router-link>
        </div>
      </template>
    </m-list-card>

    <m-list-card icon="strategy" title="图文攻略" :categories="wayCats">
      <template #items="{category}">
        <div class="d-flex flex-wrap ai-center" style="margin: 0 -0.5rem;">
          <router-link tag="div" :to="`/ways/${way._id}`"
                       class="p-2 d-flex mx-1"
                       v-for="(way,i) in category.wayList" :key="i">
            <img :src="way.cover" class="w-100 mr-2" style="border-radius: 3px; width: 116px; height: 70px">
            <div class="">
              <p class="m-0 p-0  fs-lg">{{way.title}}</p>
              <p class="mt-3 p-0 m-0 fs-xs text-grey-1">{{way.createdAt | date}}</p>
            </div>
          </router-link>
        </div>
        <router-link tag="div" to="/content" style="text-align: center; cursor: pointer" class="mt-2">>>点击查看更多<<</router-link>
      </template>
    </m-list-card>

  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'home',
  data(){
    return{
      swiperOption:{
        pagination:{
          el:".pagination-home"
        }
      },
      newsCats:[],
      heroCats:[],
      videoCats:[],
      wayCats:[]
    }
  },
  created() {
    this.fetchNewsCats()
    this.fetchHeroCats()
    this.fetchVideoCats()
    this.fetchWayCats()
  },
  methods:{
    async fetchNewsCats(){
      const res=await this.$http.get('news/list')
      this.newsCats=res.data
    },
    async fetchHeroCats(){
      const res=await this.$http.get('heroes/list')
      this.heroCats=res.data
    },
    async fetchVideoCats(){
      const res=await this.$http.get('videos/list')
      this.videoCats=res.data
    },
    async fetchWayCats(){
      const res=await this.$http.get('ways/list')
      this.wayCats=res.data
    },
  },
  filters:{
    date(val){
      return dayjs(val).format('MM/DD')
    }
  }

}
</script>
<style lang="scss" scoped>
  @import "../assets/scss/variables";
  .mint-swipe{
    height: 159.38px;
    .mint-swipe-item{
      img{
        width: 100%;
      }
    }
  }
  .nav-icons{
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    .nav-item{
      width: 25%;
      border-left: 1px solid $border-color;
      &:nth-child(4n+1){
        border-left: none;
      }
    }
  }
</style>
