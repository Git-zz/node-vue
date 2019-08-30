<template>
  <div class="heroCon" v-if="model">
    <div class="bg-light-1 d-flex jc-around ">
      <p>{{model.name}}</p>|
      <p>{{model.categories[0].name}}</p>|
      <p>登场排名{{model.show}}</p>|
      <p>胜率排名{{model.win}}</p>|
      <router-link tag="p" :to="`/heroes/${model._id}`">查看英雄详细介绍></router-link>
    </div>
    <div class="mt-2 d-flex flex-wrap jc-between">
      <router-link tag="div" :to="`/heroVideo/${model._id}`"
                   v-for="item in model.content" :key="item.name" style="text-align: center;">
          <img :src="item.cover" width="171px" class="mb-1">
          <div>{{item.title}}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name:'heroCon',
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
        const res=await this.$http.get(`heroes/${this.id}`)
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
  .heroCon{
    p{
      margin: 0;
      padding: 0;
    }

  }
</style>