// pages/mine/mine.js
const date = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    records: []
  },
  onShow() {
    this.getUserInfo()
    this.getRecords()
  },
  getUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getRecords() {
    const _this = this
    wx.request({
      url: 'http://localhost:8888/record/list',
      data: {
        user: _this.data.userInfo.nickName
      },
      success(res) {
        if (res.data.result) {
          const data = res.data.data
          data.forEach(item => {
            item.date = date.formatTime(item.date).substring(0, 10)
            item.day = Math.ceil((Date.now() - new Date(item.date).getTime()) / 1000 / 60 / 60 / 24)
          })
          _this.setData({
            records: data
          })
        }
      }
    })
  },
  returnBack(option) {
    const { title, user, image } = option.currentTarget.dataset.detail
    const _this = this
    wx.request({
      url: 'http://localhost:8888/record/add',
      method: 'POST',
      data: {
        title,
        image,
        user: app.globalData.user,
        status: 2
      },
      success(res) {
        if (res.data.result) {
          wx.showToast({
            title: '还书成功',
          })
          _this.getRecords(_this.data.title)
        } else {
          wx.showToast({
            title: `还书失败:${res.data.msg}`,
          })
        }
      }
    })
  }
})
