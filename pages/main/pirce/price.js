// pages/main/pirce/price.js
let myThis
const app = getApp()
const http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    params: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    myThis = this
    myThis.detail()
  },
  detail() {
    http.ordinary.call(this, 'myReward', {}, this.datafun, 1, true)
  },
  datafun(datas) {
    console.log(datas)
    myThis.setData({
      params: datas
    })
  },
  closemodal(){
    this.setData({
      showModal:false
    })
  },
  checkfun: function() {
    console.log(app.globalData.server.redirect_type)
    if (app.globalData.server.redirect_type == 5) {
      wx.navigateTo({
        url: '/pages/circle/withdraw/withdraw/withdraw?draw=1',
      })
    } else {
      myThis.setData({
        showModal: true
      })
    }

  },
  godetail: function() {
    wx.navigateTo({
      url: '/pages/main/pricedetail/pricedetail',
    })
  },
  modalCancel: function() {
    console.log(111)

  },
  modalConfirm: function() {
    console.log(222)
    wx.switchTab({
      url: '/pages/main/mine/mine/main',
    })
  }
})