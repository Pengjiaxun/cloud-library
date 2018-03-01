<template>
    <div class="books-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/books' }">图书管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs v-model="tabActive"
            @tab-click="tabChange">
            <el-tab-pane label="馆存"
                name="store">
                <div class="header">
                    <el-select v-model="status"
                        placeholder="筛选"
                        @change="filterChange">
                        <el-option v-for="item in bookStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="keyStore"
                        prefix-icon="el-icon-search"
                        autofocus
                        placeholder="请输入图书名字进行搜索"
                        clearable></el-input>
                    <el-button type="primary"
                        plain
                        @click="searchStore">搜索</el-button>
                </div>
                <div class="content">
                    <el-table :data="bookData"
                        stripe
                        style="width: 100%"
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        refs="onshelfTable">
                        <el-table-column label="封面"
                            width="120">
                            <template slot-scope="scope">
                                <img :src="scope.row.image"
                                    width="80"
                                    alt="图书封面">
                            </template>
                        </el-table-column>
                        <el-table-column prop="title"
                            label="书名">
                        </el-table-column>
                        <el-table-column prop="author"
                            label="作者">
                        </el-table-column>
                        <el-table-column prop="publisher"
                            label="出版社">
                        </el-table-column>
                        <el-table-column prop="summary"
                            label="简介"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="status"
                            label="状态"
                            width="80">
                            <template slot-scope="scope">
                                {{scope.row.status === 1 ? '在架' : '借出'}}
                            </template>
                        </el-table-column>
                        <el-table-column width="80"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button v-show="scope.row.status === 1"
                                    type="text"
                                    @click="offshelf(scope.row.title)">下架</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="录入"
                name="recording">
                <div class="header">
                    <el-input v-model="key"
                        prefix-icon="el-icon-search"
                        autofocus
                        placeholder="请输入图书名字进行搜索"
                        clearable></el-input>
                    <el-button type="primary"
                        plain
                        @click="search">搜索</el-button>
                </div>
                <div class="content">
                    <el-table :data="recordList"
                        stripe
                        style="width: 100%"
                        v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)">
                        <el-table-column label="封面"
                            width="120">
                            <template slot-scope="scope">
                                <img :src="scope.row.image"
                                    width="80"
                                    alt="图书封面">
                            </template>
                        </el-table-column>
                        <el-table-column prop="title"
                            label="书名">
                        </el-table-column>
                        <el-table-column prop="author"
                            label="作者">
                        </el-table-column>
                        <el-table-column prop="publisher"
                            label="出版社">
                        </el-table-column>
                        <el-table-column prop="summary"
                            label="简介"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column width="80"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button type="text"
                                    @click="record(scope.row)">录入</el-button>
                                <!-- <el-button type="text">编辑</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import Store from 'store2'
import { Loading } from '../assets/js/mixins'
import { api } from '@/config'

export default {
    name: 'books',
    mixins: [Loading],
    data() {
        return {
            tabActive: 'store',
            key: '数学之美',
            keyStore: '',
            recordList: [],
            bookData: [],
            bookStatus: [
                {
                    label: '所有图书',
                    value: 0
                },
                {
                    label: '在架图书',
                    value: 1
                },
                {
                    label: '在借图书',
                    value: 2
                }],
            status: 0
        }
    },
    methods: {
        tabChange() {
            if (this.tabActive === 'store') {
                this.$nextTick(() => {
                    this.getBookData()
                })
            }
        },
        filterChange() {
            this.getBookData()
        },
        search() {
            this.showLoading()
            this.http.get(`/api/v2/book/search?q=${this.key}`)
                .then(res => {
                    if (res.status === 200 && res.data.books.length !== 0) {
                        this.recordList = res.data.books
                    } else {
                        alert('查询失败')
                    }
                    this.hideLoading()
                })
        },
        searchStore() {
            this.showLoading()
            this.http.get(`${api.bookApi}/list`, {
                params: {
                    status: this.status,
                    title: this.keyStore
                }
            }).then(res => {
                if (res.data.result) {
                    this.bookData = res.data.data
                } else {
                    this.$message.error()
                }
                this.hideLoading()
            }).catch(err => {
                this.hideLoading()
                this.$message.error(err)
            })
        },
        record(data) {
            this.http.post(`${api.bookApi}/record`, data)
                .then(res => {
                    if (res.data.result) {
                        this.$message.success('录入成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
                .catch(error => {
                    this.$message.error(error)
                })
        },
        getBookData() {
            this.showLoading()
            this.http.get(`${api.bookApi}/list`, {
                params: {
                    status: this.status,
                    title: this.keyStore
                }
            }).then(res => {
                if (res.data.result) {
                    this.bookData = res.data.data
                } else {
                    this.$message.error('查询失败')
                }
                this.hideLoading()
            }).catch(() => {
                this.hideLoading()
                this.$message.error('error')
            })
        },
        refreshList() {
            this.getBookData(this.status)
        },
        offshelf(title) {
            this.$confirm('是否确认下架该图书？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.http.post(`${api.bookApi}/offshelf`, { title })
                    .then(res => {
                        if (res.data.result) {
                            this.$message.success('操作成功')
                            this.refreshList()
                        } else {
                            this.$message.success(`操作失败: ${res.data.msg}`)
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    },
    created() {
        if (Store.get('isLogin') === 0) {
            this.$router.push('/login')
        }
    },
    mounted() {
        this.getBookData(0)
    }
}
</script>
<style lang="scss" scoped>

</style>
