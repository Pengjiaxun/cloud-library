// pages/bookList/bookList.js
const date = require('../../utils/util.js')

Page({
  data: {
    activeIndex: 1,
    searchKey: '',
    bookList: []
  },
  onLoad() {
    // console.log('123')
    wx.setEnableDebug({
      enableDebug: true
    })
    this.getBookList()
  },
  switchTab(event) {
    this.setData({ activeIndex: +event.target.dataset.index})
  },
  bindKeyInput(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },
  search() {
    if (!this.data.searchKey) {
      return
    }
    wx.showLoading({
      title: 'loading',
    })
    console.log(this.data.searchKey)
  },
  toBookDetail(item) {
    const id = item.currentTarget.dataset.id
    const title = item.currentTarget.dataset.title
    wx.navigateTo({
      url: `/pages/bookDetail/bookDetail?id=${id}&title=${title}`
    })
  },
  getBookList() {
    const _this = this
    wx.request({
      url: 'http://localhost:8888/book/list',
      data: {
        status: 0
      },
      success (res) {
        if (res.data.result) {
          const data = res.data.data
          data.forEach(item => {
            item.record_date = date.formatTime(item.record_date).substring(0, 10)
          })
          _this.setData({
            bookList: data
          })
        }
      }
    })
  }
})