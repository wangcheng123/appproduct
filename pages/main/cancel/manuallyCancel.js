// pages/main/cancel/manuallyCancel.js
var http = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  bindCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  //扫码核销
  getScancode() {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        _this.setData({
          code: result
        })
      }
    })
  },
  checkBtn() {
    // http.ordinary.call(this, 'hxVerif', {code:this.data.code}, this.teamToPage, 1, true,true);
    wx.navigateTo({
      url: '/pages/main/cancel/cancelResults/cancelResults?code=' + this.data.code,
    })
  },
  
})