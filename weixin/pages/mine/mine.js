// pages/mine/mine.js
const date = require('../../utils/util.js')
var app = getApp()

Page({
    data: {
        user: '',
        userInfo: {},
        hasUserInfo: false,
        showHistory: false,
        showWishes: false,
        records: [],
        wishes: []
    },
    onLoad() {
        const user = 
        this.setData({
            user: wx.getStorageSync('user')
        })
    },
    onShow() {
        this.getUserInfo()
        this.getRecords()
        this.getWishes()
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
                user: _this.data.user
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
    getWishes() {
        const _this = this
        wx.request({
            url: 'http://localhost:8888/wish/mine',
            data: {
                user: _this.data.user
            },
            success(res) {
                if (res.data.result) {
                    _this.setData({
                        wishes: res.data.data
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
                    _this.getRecords()
                } else {
                    wx.showToast({
                        title: `还书失败:${res.data.msg}`,
                    })
                }
            }
        })
    },
    toggleShowHistory() {
        this.setData({
            showHistory: !this.data.showHistory
        })
    },
    toggleShowWishes() {
        this.setData({
            showWishes: !this.data.showWishes
        })
    },
    cancelWish(option) {
        const { title, user } = option.currentTarget.dataset.detail
        const _this = this
        wx.request({
            url: 'http://localhost:8888/wish/del',
            method: 'POST',
            data: {
                title,
                user
            },
            success(res) {
                if (res.data.result) {
                    wx.showToast({
                        title: '移除成功',
                    })
                    _this.getWishes(_this.data.user)
                } else {
                    wx.showToast({
                        title: `移除失败:${res.data.msg}`,
                    })
                }
            }
        })
    }
})
