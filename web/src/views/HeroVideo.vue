<template>
    <div class="heroVideo" v-if="model">
        <div v-for="item in model.content" :key="item.name">
        <div v-html="item.body" class="videoImg mb-3"></div>


        <div class="d-flex jc-between mx-1 my-3 ai-center" style="border: 1px solid #d4d9de">
            <img :src="model.avatar"  width="60" height="60">
                <div class="mr-2"><strong>{{item.title}}</strong></div>
        </div>
        </div>


    </div>
</template>

<script>
    export default {
        name: "HeroVideo",
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

<style lang="scss" scoped>
    .videoImg{
        overflow: hidden;
        width: 100%;
        height: 360px;

        /*.videoImg{*/
        /*    width: auto;*/
        /*    height: 100%;*/

        /*}*/
    }
</style>