<template>
    <div id="app"
        class="index-container">
        <div v-if="isLogin"
            class="login">
            <router-view></router-view>
        </div>
        <el-container v-else>
            <el-header>
                <book-nav></book-nav>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <book-slider></book-slider>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import BookNav from '@/components/navbar'
import BookSlider from '@/components/slider'

export default {
    name: 'App',
    components: {
        BookNav,
        BookSlider
    },
    computed: {
        isLogin() {
            return new RegExp(this.$route.path).test('/login')
        }
    }
}
</script>
<style lang="scss">
@import "./assets/css/variable.scss";
html,
body,
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow: hidden;
}
.login {
  width: 100%;
  height: 100%;
  background: url("./assets/image/bg.jpg") no-repeat center;
  background-size: cover;
}
.el-container {
  height: 100%;
  .el-header {
    border-bottom: 1px solid $border-color;
  }
  .el-main {
    margin: 68px 20px 20px 20px;
    border: 1px solid $border-color;
    box-shadow: 0 0 15px 5px $border-color;
  }
}
</style>
