<template>
    <div>
        <h1>攻略列表</h1>
        <el-table :data="items">
            <el-table-column prop="_id" label="ID" width="240"></el-table-column>
            <!--            <el-table-column prop="parent.name" label="上级分类"></el-table-column>-->
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="$router.push(`/ways/edit/${scope.row._id}`)">编辑</el-button>
                    <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button><!-- scope.row 表示当前这一行-->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "WayList",
        data(){
            return{
                items:[ ]
            }
        },
        created(){
            this.fetch()
        },
        methods: {
            async fetch() {
                const res = await this.$http.get('rest/ways')
                this.items = res.data
            },


            async remove(row){
                this.$confirm(`是否确定删除"${row.title}"`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res=await this.$http.delete(`rest/ways/${row._id}`)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.fetch()
                })
            }
        }
    }
</script>

<style scoped>

</style>