// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: 'pjx',
    pwd: '123'
  },
  bindAccountInput: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  bindPwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  verify() {
    if (!this.data.account) {
      wx.showToast({
        title: '账号不能为空',
        icon: 'loading',
        duration: 1800
      })
      return false
    }else if (!this.data.pwd) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 1800
      })
      return false
    }
    return true
  },
  login: function () {
    console.log(this.data.account, this.data.pwd)
    if (this.verify()) {
      wx.setStorage({
        key: 'isLogin',
        data: '1',
      })
      wx.switchTab({
        url: '../mine/mine',
        complete: function(e) {
          console.log(e)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'isLogin',
      success: function (res) {
        if(res && res.data) {
          if (res.data == '1') {
            wx.switchTab({
              // url: '../mine/mine',
              url: '../bookList/bookList',
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})