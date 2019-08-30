<template>
    <div class="content">
        <mt-swipe :auto="4000">
            <mt-swipe-item><img src="../assets/images/1.jpg"></mt-swipe-item>
            <mt-swipe-item><img src="../assets/images/2.jpg"></mt-swipe-item>
            <mt-swipe-item><img src="../assets/images/3.jpg"></mt-swipe-item>
            <mt-swipe-item><img src="../assets/images/4.jpg"></mt-swipe-item>
        </mt-swipe>

        <m-list-card icon="video" title="热门视频" :categories="videoCats">
            <template #items="{category}">
                <div class="mr-2">
                    <router-link tag="div" :to="`/videos/${video._id}`"
                                 class="py-2 fs-lg d-flex"
                                 v-for="(video,i) in category.videoList" :key="i">
                        <span class="flex-1  text-ellipsis">{{video.title}}</span>
                        <span class="mr-2"><i class="sprite sprite-video"></i></span>
                        <span>{{video.click}}</span>

                    </router-link>
                </div>
            </template>
        </m-list-card>

        <m-list-card icon="gonglue" title="英雄攻略" :categories="heroCats">
            <template #items="{category}">
                <div class="d-flex flex-wrap" style="margin: 0 -0.5rem;">
                    <router-link tag="div" :to="`/heroCon/${hero._id}`"
                                 class="p-2 text-center" style="width: 20%;"
                                 v-for="(hero,i) in category.heroList" :key="i">
                        <img :src="hero.avatar" class="w-100">
                        <div>{{hero.name}}</div>
                    </router-link>
                </div>
                <router-view></router-view>
            </template>
        </m-list-card>

        <m-list-card icon="lanmu" title="赛事精品" :categories="raceCats">
            <template #items="{category}">
                <div class="d-flex flex-wrap" style="margin: 0 -0.5rem;">
                    <router-link tag="div" :to="`/races/${race._id}`"
                                 class="p-2" style="width: 50%;"
                                 v-for="(race,i) in category.raceList" :key="i">
                        <img :src="race.cover" class="w-100" style="border-radius: 3px">
                        <div class="text-ellipsis-1 fs-lg mt-2">{{race.title}}</div>
                        <div class="d-flex jc-between mt-2 text-grey-1 ai-center">
                            <span><i class="sprite sprite-video mr-1"></i>{{race.click}}</span>
                            <span>{{race.createdAt | date}}</span>
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
            </template>
        </m-list-card>

    </div>
</template>

<script>
    import dayjs from 'dayjs'
    export default {
        name: "Content",
        data(){
            return{
                videoCats:[],
                heroCats:[],
                raceCats:[],
                wayCats:[]
            }
        },
        created(){
            this.fetchVideoCats()
            this.fetchHeroCats()
            this.fetchRaceCats()
            this.fetchWayCats()
        },
        methods:{
            async fetchVideoCats(){
                const res=await this.$http.get('videos/list')
                this.videoCats=res.data
            },
            async fetchHeroCats(){
                const res=await this.$http.get('heroes/list')
                this.heroCats=res.data
            },
            async fetchRaceCats(){
                const res=await this.$http.get('races/list')
                this.raceCats=res.data
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
    .mint-swipe{
        height: 144.38px;
    .mint-swipe-item{
    img{
        width: 100%;
    }
    }
    }
</style>