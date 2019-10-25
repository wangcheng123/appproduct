// pages/login/loginTips/loginTips.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:true,
    redirect_type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let redirect_type = app.globalData.server.redirect_type ? app.globalData.server.redirect_type : 0
    this.setData({ redirect_type})
  },

  modalCancel: function () {

  },
})