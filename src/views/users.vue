<template>
    <div class="users-container container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header">
            <el-button type="primary"
                plain
                @click="showAddModal">添加用户</el-button>
        </div>
        <div class="content">
            <el-table :data="userList"
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
                <el-table-column prop="name"
                    label="用户名">
                </el-table-column>
                <el-table-column prop="pwd"
                    label="密码">
                </el-table-column>
                <el-table-column width="80"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text"
                            @click="del(scope.row.name)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="添加用户"
            :visible.sync="addModal"
            width="35%">
            <el-form :model="user"
                :rules="rules"
                ref="userForm">
                <el-form-item prop="name">
                    <el-input v-model="user.name"
                        placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input v-model="user.pwd"
                        type="password"
                        placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="hideAddModal">取 消</el-button>
                <el-button type="primary"
                    @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { userApi } from '@/config'
import { Loading } from '../assets/js/mixins'

export default {
    name: 'users',
    mixins: [Loading],
    data() {
        return {
            user: {
                name: '',
                pwd: ''
            },
            userList: [],
            addModal: false,
            rules: {
                name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        }
    },
    methods: {
        showAddModal() {
            this.addModal = true
        },
        hideAddModal() {
            this.addModal = false
        },
        getUserList() {
            this.showLoading()
            this.http.get(`${userApi}/list`)
                .then(res => {
                    if (res.data.result) {
                        this.userList = res.data.data
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.hideLoading()
                }).catch(err => {
                    this.hideLoading()
                    this.$message.error(err)
                })
        },
        addUser() {
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    this.http.post(`${userApi}/add`, {
                        name: this.user.name,
                        pwd: this.user.pwd
                    }).then(res => {
                        if (res.data.result) {
                            this.$message.success('添加成功')
                            this.hideAddModal()
                            this.getUserList()
                        } else {
                            this.$message.error(`添加失败:${res.data.msg}`)
                        }
                    }).catch(err => {
                        this.$message.error(err)
                    })
                }
            })
        },
        del(name) {
            if (name === 'root') {
                this.$message.error('不能删除root用户')
            } else {
                this.$confirm(`确认删除用户 ${name} 吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.http.post(`${userApi}/del`, { name })
                        .then(res => {
                            if (res.data.result) {
                                this.$message.success('删除成功')
                                this.getUserList()
                            } else {
                                this.$message.error('删除失败')
                            }
                        }).catch((error) => {
                            this.$message.error(error)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            }
        }
    },
    created() {
        this.getUserList()
    }
}
</script>

<style lang="scss" scoped>

</style>
