<template>
  <div class="article" v-if="model">
    <div class="d-flex py-3 px-2 border-bottom">
      <router-link tag="div" class="iconfont icon-back text-blue" to="/"></router-link>
      <strong class="flex-1 text-blue pl-2">
        {{model.title}}
      </strong>
      <div class="text-grey fs-xs">
        2019-08-20
      </div>
    </div>
    <div v-html="model.body" class="px-3 body fs-lg"></div>
      <div class="px-3 border-top py-3">
          <div class="d-flex ai-center">
              <i class="iconfont icon-xiangguanlianjie"></i>
              <strong class="text-blue fs-lg ml-1">相关资讯</strong>
          </div>
          <div class="pt-2 fs-lg">
              <router-link tag="div" class="py-1"
                           v-for="item in model.related"
                           :key="item._id"
                           :to="`/articles/${item._id}`">
                  {{item.title}}
              </router-link>
          </div>
      </div>
      <m-comment></m-comment>
  </div>
</template>
<script>
  export default {
    props:{
      id:{required:true}
    },
    data(){
      return{
        model:null
      }
    },
    created() {
      this.fetch()
    },
    methods:{
      async fetch(){
        const res=await this.$http.get(`articles/${this.id}`)
        this.model=res.data
      }
    },
    watch:{
        id:'fetch'
        // id(){
        //     this.fetch()
        // }  id变化触发方法
    }
  }
</script>
<style lang="scss">
  .article{
      .icon-Back{
        font-size: 1.6923rem;
      }
    .body{
      img{
        max-width: 100%;
        height: auto;
      }
      iframe{
        width: 100%;
        height: auto;
      }
    }
  }
</style>