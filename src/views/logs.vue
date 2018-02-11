<template>
    <div class="records-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/records' }">借阅记录</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header">

        </div>
        <div class="content">
            <el-table :data="recordList"
                stripe
                style="width: 100%"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column label="序号">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="user"
                    label="用户">
                </el-table-column>
                <el-table-column prop="title"
                    label="借阅书籍">
                </el-table-column>
                <el-table-column prop="date"
                    label="借阅时间">
                    <template slot-scope="scope">
                        {{format(scope.row.date)}}
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                    label="当前状态">
                    <template slot-scope="scope">
                        {{scope.row.status === 1 ? '借阅中' : '已归还'}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { Loading } from '../assets/js/mixins'
import { logApi } from '@/config'
import { formatDate } from '../assets/js/utils'

export default {
    name: 'records',
    mixins: [Loading],
    data() {
        return {
            recordList: []
        }
    },
    methods: {
        getRecordList() {
            this.http.get(`${logApi}/list`)
                .then(res => {
                    if (res.data.result) {
                        this.recordList = res.data.data
                    } else {
                        this.$message.error('查询失败')
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
        },
        format(t) {
            return formatDate(Number(t))
        }
    },
    created() {
        this.getRecordList()
        console.log(formatDate(1234567890000), 'formatDate')
    }
}
</script>
<style lang="scss" scoped>

</style>
