<template>
    <div class="edit">
        <h1>{{id ? '编辑' : '新建'}}攻略</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            <el-form-item label="所属分类">
                <el-select v-model="model.categories" multiple>
                    <el-option v-for="item in categories"
                               :key="item._id"
                               :label="item.name"
                               :value="item._id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="model.title"></el-input>
            </el-form-item>
            <el-form-item label="封面">
                <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :headers="getAuthHeaders()"
                        :show-file-list="false"
                        :on-success="res=>$set(model,'cover',res.url)">
                    <!--                        :before-upload="beforeAvatarUpload">-->
                    <img v-if="model.cover" :src="model.cover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="详情">
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
        name: "WayEdit",
        props:{
            id:{ }
        },
        components:{
            VueEditor
        },
        data(){
            return{
                model:{ },
                categories:[]
            }
        },
        methods:{
            async save(){
                let res
                if (this.id){
                    res=await this.$http.put(`rest/ways/${this.id}`,this.model)
                } else {
                    res=await this.$http.post('rest/ways',this.model)
                }
                this.$router.push('/ways/list')
                this.$message({
                    type:'success',
                    message:'保存成功'
                })
            },
            async fetch(){
                const res=await this.$http.get(`rest/ways/${this.id}`)
                this.model=res.data
            },
            async fetchCategories(){
                const res=await this.$http.get(`rest/categories`)
                this.categories=res.data
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
            this.fetchCategories()
        }
    }
</script>

<style scoped>

</style>