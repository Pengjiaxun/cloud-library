<template>
    <div class="slider-container">
        <el-menu :default-active="activeIndex"
            class="el-menu-vertical-demo"
            mode="vertical"
            :router=true>
            <el-menu-item index="books"
                class="tc">图书管理</el-menu-item>
            <el-menu-item index="users"
                class="tc">用户管理</el-menu-item>
            <el-menu-item index="records"
                class="tc">借阅记录</el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    name: 'slider',
    data() {
        return {
            activeIndex: 'books',
            pathMap: {
                Books: 'books',
                Users: 'users',
                Records: 'records'
            }
        }
    },
    watch: {
        '$route.path'() {
            this.reset()
        }
    },
    computed: {
        path() {
            return this.$route.matched[0] && this.$route.matched[0].name
        }
    },
    methods: {
        reset() {
            const path = this.$route.path
            if (path) {
                this.activeIndex = this.pathMap[this.path]
            }
        }
    },
    created() {
        this.reset()
    }
}
</script>
<style lang="scss" scoped>
.slider-container {
  width: 200px;
  height: 100%;
  display: inline-block;
}
</style>
<style lang="scss">
.slider-container {
  .el-menu {
    height: 100%;
  }
}
</style>
