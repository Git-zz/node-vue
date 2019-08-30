<template>
    <div class="edit">
        <h1>{{id ? '编辑' : '新建'}}评论</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            <el-form-item label="评论内容">
                <vue-editor v-model="model.body" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {VueEditor} from 'vue2-editor'
    export default {
        name: "CommentEdit",
        props:{
            id:{ }
        },
        components:{
            VueEditor
        },
        data(){
            return{
                model:{},
            }
        },
        methods:{
            async save(){
                let res
                if (this.id){
                    res=await this.$http.put(`rest/comments/${this.id}`,this.model)
                } else {
                    res=await this.$http.post('rest/comments',this.model)
                }
                this.$router.push('/comments/list')
                this.$message({
                    type:'success',
                    message:'保存成功'
                })
            },
            async fetch(){
                const res=await this.$http.get(`rest/comments/${this.id}`)
                this.model=Object.assign({},this.model,res.data)
            },
            async handleImageAdded(file,Editor,cursorLocation,resetUploader) {
                const formData = new FormData();
                formData.append('file',file)
                const res=await this.$http.post('upload',formData)
                Editor.insertEmbed(cursorLocation,'image',res.data.url)
                resetUploader()
            }
        },
        created() {
            this.id&&this.fetch()
        }
    }
</script>

<style scoped>

</style>