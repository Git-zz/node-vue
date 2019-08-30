<template>
    <div class="game">
        <mt-swipe :auto="4000">
            <mt-swipe-item><img src="../assets/images/60525442238684.jpg"></mt-swipe-item>
            <mt-swipe-item><img src="../assets/images/77419891267497.jpg"></mt-swipe-item>
            <mt-swipe-item><img src="../assets/images/84614591434276.jpg"></mt-swipe-item>
            <mt-swipe-item><img src="../assets/images/312091088636678.jpg"></mt-swipe-item>
        </mt-swipe>

        <m-list-card icon="card-hero" title="赛事中心" :categories="gameCats">
            <template #items="{category}">
                <p style="margin: 0; padding: 0;" v-for="(game,i) in category.gameList" :key="game.name" v-if="i<1">
                    <span style="color: #00adff; font-weight: bold; font-size: 20px">{{game.name}}</span>
                    <span style="font-size: 12px; border: 1px solid #a2a2a2; color: #a2a2a2; border-radius: 50px; text-align: center; margin-left: 4%; padding: .5% 2%">官方举办</span>
                    <span style="display: block"><img :src="game.cover" style="height: 210px; width: 100%" class="mt-3"></span>
                </p>
                <div class="news">赛事资讯</div>
                <router-link tag="div" :to="`/gameCon/${game._id}`" class="py-2 fs-lg d-flex" v-for="(game,i) in category.gameList" :key="i">
                    <span class="flex-1  text-ellipsis pr-2">{{game.title}}</span>
                    <span class="text-grey-1 fs-sm">{{game.createdAt | date}}</span>
                </router-link>
            </template>
        </m-list-card>


    </div>
</template>

<script>
    import dayjs from 'dayjs'
    export default {
        name: "Game",
        data(){
            return{
                gameCats:[]
            }
        },
        created() {
            this.fetchGameCats()
        },
        methods:{
            async fetchGameCats(){
                const res=await this.$http.get('games/list')
                this.gameCats=res.data
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
        height: 214px;
        .mint-swipe-item{
            img{
                width: 100%;
            }
        }
    }
    .news{
        width: 100%;
        height: 1.57rem;
        line-height: 1.57rem;
        text-align: center;
        color: #a2a2a2;
        font-size: .28rem;
        background-color: #e4e4e4;
        margin: 6px 0;
    }
</style>