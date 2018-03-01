<template>
    <div class="users-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/wishes' }">愿望清单</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <el-table :data="wishesList"
                stripe
                style="width: 100%"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column label="序号"
                    width="80">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="_id"
                    label="书名">
                </el-table-column>
                <el-table-column label="被加入愿望单">
                    <template slot-scope="scope">
                        {{scope.row.account}} 次
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { api } from '@/config'
import { Loading } from '../assets/js/mixins'

export default {
    name: 'wishes',
    mixins: [Loading],
    data() {
        return {
            wishesList: []
        }
    },
    methods: {
        getWishesList() {
            this.showLoading()
            this.http.get(`${api.wishApi}/list`)
                .then(res => {
                    if (res.data.result) {
                        this.wishesList = res.data.data
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.hideLoading()
                }).catch(err => {
                    this.hideLoading()
                    this.$message.error(err)
                })
        }
    },
    created() {
        this.getWishesList()
    }
}
</script>

<style lang="scss" scoped>

</style>
