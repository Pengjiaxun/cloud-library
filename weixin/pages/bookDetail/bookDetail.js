//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    title: '',
    bookDetail: {}
  },
  onLoad(option) {
    this.setData({
      title: option.title
    })
    this.getBookDetail(option.title)
  },
  getBookDetail(title) {
    if (title) {
      const _this = this
      wx.request({
        url: 'http://localhost:8888/book/list',
        data: {
          title,
          status: 0
        },
        success(res) {
          if (res.data.result) {
            _this.setData({
              bookDetail: res.data.data[0]
            })
          }
          console.log(_this.data.bookDetail)
        }
      })
    }
  },
  borrow() {
    const { title, image } = this.data.bookDetail
    const _this = this
    wx.request({
      url: 'http://localhost:8888/log/add',
      method: 'POST',
      data: {
        title,
        image,
        user: app.globalData.userInfo.nickName,
        status: 1
      },
      success(res) {
        if (res.data.result) {
          wx.showToast({
            title: '借阅成功',
          })
          _this.getBookDetail(_this.data.title)
        } else {
          wx.showToast({
            title: `借阅失败:${res.data.msg}`,
          })
        }

      }
    })
  }
})