//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo, 'userInfo')
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 验证是否登录
    wx.getStorage({
      key: 'isLogin',
      success: res => {
        if (res && res.data !== 1) {
          wx.navigateTo({
            url: './pages/login/login',
            success(e) {
              console.log(e)
            }
          })
        }
      },
      fail(res) {
        wx.navigateTo({
          url: './pages/login/login',
          success(e) {
            console.log(e)
          }
        })
      }
    })

    // 获取登录账号
    wx.getStorage({
      key: 'user',
      success: res => {
        if (res && res.data) {
          this.globalData.user = res.data
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  globalData: {
    userInfo: null,
    user: null
  }
})