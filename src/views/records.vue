<template>
    <div class="records-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/records' }">借阅记录</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header">
            <el-select v-model="status"
                placeholder="筛选"
                @change="getRecordList">
                <el-option v-for="item in recordStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input v-model="key"
                prefix-icon="el-icon-search"
                autofocus
                placeholder="请输入图书名字进行搜索"
                clearable></el-input>
            <el-button type="primary"
                plain
                @click="getRecordList">搜索</el-button>
        </div>
        <div class="content">
            <el-table :data="recordList"
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
                <el-table-column prop="user"
                    label="用户">
                </el-table-column>
                <el-table-column prop="title"
                    label="借阅书籍">
                </el-table-column>
                <el-table-column prop="date"
                    label="借阅日期">
                    <template slot-scope="scope">
                        {{format(scope.row.date)}}
                    </template>
                </el-table-column>
                <el-table-column prop="returnDate"
                    label="归还日期">
                    <template slot-scope="scope">
                        {{scope.row.returnDate ? format(scope.row.returnDate) : ''}}
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                    label="状态">
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
import { api } from '@/config'
import { formatDate } from '../assets/js/utils'

export default {
    name: 'records',
    mixins: [Loading],
    data() {
        return {
            recordList: [],
            recordStatus: [
                {
                    label: '所有记录',
                    value: 0
                },
                {
                    label: '借阅中',
                    value: 1
                },
                {
                    label: '已归还',
                    value: 2
                }],
            status: 0,
            key: ''
        }
    },
    methods: {
        getRecordList() {
            this.showLoading()
            this.http.get(`${api.recordApi}/list`, {
                params: {
                    status: this.status,
                    title: this.key
                }
            }).then(res => {
                if (res.data.result) {
                    this.recordList = res.data.data
                } else {
                    this.$message.error('查询失败')
                }
                this.hideLoading()
            }).catch(err => {
                this.hideLoading()
                this.$message.error(err)
            })
        },
        format(t) {
            return formatDate(Number(t))
        }
    },
    created() {
        this.getRecordList()
    }
}
</script>
<style lang="scss" scoped>

</style>
