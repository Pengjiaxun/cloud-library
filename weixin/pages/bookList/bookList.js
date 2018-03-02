// pages/bookList/bookList.js
const date = require('../../utils/util.js')

Page({
    data: {
        activeIndex: 1,
        searchKey: '',
        bookList: [],
        orderList: []
    },
    onLoad() {
        // console.log('123')
        wx.setEnableDebug({
            enableDebug: true
        })
        this.getBookList()
        this.getOrderList()
    },
    onShow() {
        this.setData({
            searchKey: ''
        })
        this.getBookList()
        this.getOrderList()
    },
    switchTab(event) {
        this.setData({ activeIndex: +event.target.dataset.index })
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
        const _this = this
        wx.showLoading({
            title: 'loading',
        })
        wx.request({
            url: 'http://localhost:8888/book/list',
            data: {
                status: 0,
                title: _this.data.searchKey
            },
            success(res) {
                if (res.data.result) {
                    const data = res.data.data
                    data.forEach(item => {
                        item.record_date = date.formatTime(item.record_date).substring(0, 10)
                    })
                    _this.setData({
                        bookList: data
                    })
                }
            },
            complete() {
                wx.hideLoading()
            }
        })
        console.log(this.data.searchKey)
    },
    resetList() {
        this.setData({
            searchKey: ''
        })
        this.getBookList()
    },
    toBookDetail(item) {
        const id = item.currentTarget.dataset.id
        const title = item.currentTarget.dataset.title
        wx.navigateTo({
            url: `/pages/bookDetail/bookDetail?id=${id}&title=${title}`
        })
    },
    getBookList() {
        wx.showLoading({
            title: 'loading',
        })
        const _this = this
        wx.request({
            url: 'http://localhost:8888/book/list',
            data: {
                status: 0
            },
            success(res) {
                if (res.data.result) {
                    const data = res.data.data
                    data.forEach(item => {
                        item.record_date = date.formatTime(item.record_date).substring(0, 10)
                    })
                    _this.setData({
                        bookList: data
                    })
                }
            },
            complete() {
                wx.hideLoading()
            }
        })
    },
    getOrderList() {
        const _this = this
        wx.request({
            url: 'http://localhost:8888/book/list',
            data: {
                status: 0,
                order: true
            },
            success(res) {
                if (res.data.result) {
                    _this.setData({
                        orderList: res.data.data
                    })
                }
            }
        })
    },
    addWish() {
        const _this = this
        const user = wx.getStorageSync('user')
        wx.request({
            url: 'http://localhost:8888/wish/add',
            method: 'POST',
            data: {
                title: _this.data.searchKey,
                user: user
            },
            success(res) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    }
})