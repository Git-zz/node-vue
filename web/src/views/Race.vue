<template>
    <div class="race" v-if="model">
        <div v-html="model.body" class="videoImg"></div>


        <div class="d-flex jc-between mx-1 mt-3" style="border: 1px solid #d4d9de">
            <img :src="model.avatar"  width="60" height="60">
            <div class="ml-2 m-1">
                <div><strong>{{model.title}}</strong></div>
                <div class="d-flex fs-xxs text-grey-1 mt-3">
                    <span class="mr-3">投稿：{{model.articleNum}}</span>
                    <span>粉丝：{{model.fansNum}}</span>
                </div>
            </div>
        </div>

        <div class="mt-4 mx-1 fs-lg text-dark-1"><i class="iconfont icon-xihuan mr-2"></i>猜您喜欢</div>
        <div class="mt-3 d-flex jc-around" style="cursor: pointer">

            <router-link tag="div" style="width: 187.5px" class="mx-2"
                         v-for="item in model.related"
                         :key="item._id"
                         :to="`/races/${item._id}`">
                <img :src="item.cover" width="100%" height="102.05px">
                <p class="w-100 mt-1">{{item.title}}</p>
            </router-link>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Race",
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
                const res=await this.$http.get(`races/${this.id}`)
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
    .videoImg{
        overflow: hidden;
        width: 100%;
        height: 377px;

        /*.videoImg{*/
        /*    width: auto;*/
        /*    height: 100%;*/

        /*}*/
    }
</style>