<template>
    <div class="comment">
        <h3>发表评论</h3>
        <textarea placeholder="请输入内容" v-model="msg"></textarea>
        <mt-button type="primary" size="large" @click="postComment">发表评论</mt-button>
        <div class="cmt-list">
                <div v-for="(item,i) in model" :key="i">
                    <div class="cmt-title d-flex jc-between">
                        <p>第{{i+1}}楼用户</p>
                        <p>发表时间：{{item.createdAt | date}}</p>
                    </div>
                    <div class="cmt-body" v-html="item.body"></div>
                </div>
        </div>
    </div>
</template>

<script>
    import dayjs from 'dayjs'
    export default {
        name: "Comment",
        data(){
            return{
                pageIndex:1,
                msg:'',
                model:[]
            }
        },
        created() {
            this.fetch()
        },
        methods:{
            async fetch(){
                const res=await this.$http.get(`comments`)
                this.model=res.data
            },
            async postComment(){
                const res=await this.$http.post('comments',{body:this.msg.trim()})
                const cmt={
                    body: this.msg.trim()
                }
                this.model.unshift(cmt)
                this.msg=''
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
    h3{
        font-size: 18px;
    }
    textarea{
        font-size: 14px;
        height: 85px;
        width: 367px;
        margin: 0 4px;
        resize: none;
    }
    .cmt-list{
        margin: 5px 0;
    }
    .cmt-item{
        font-size: 13px;
    }
    .cmt-title{
        background-color: #ccc;
        line-height: 30px;
        p{
            margin: 0;
            padding: 0;
            line-height: 30px;
        }
    }
    .cmt-body{
        line-height: 35px;
        text-indent: 2em;
    }
</style>