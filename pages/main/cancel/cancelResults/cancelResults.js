//首页
const app = getApp();
const http = require('../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    isResult: false,
    result: '', 
    resultIcon:"",
    imgurl: app.globalData.imgurl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let code = options.code ? options.code : ''
    let isShowToast = false
    this.setData({
      code
    })
    if (!isShowToast) {
      wx.showLoading({
        title: '请求中...',
        mask: true
      })
      isShowToast = true
    }

    wx.request({
      url: app.globalData.url + 'server/v2_4/hxVerif', // 仅为示例，并非真实的接口地址
      data: {
        code: that.data.code
      },
      method: 'post',
      header: {
        'Authorization': 'Bearer ' + app.globalData.server.remember_token
      },
      success(res) {
        wx.hideLoading();
        isShowToast = false;
        if (res.data.code == 200) {
          that.setData({
            isResult: true,
            result: res.data.data,
            resultIcon: that.data.imgurl + 'h5_images/businessAssistant/icon_success.png'
          })
          wx.setNavigationBarTitle({
            title: '核销成功'
          })
        } else {
          that.setData({
            isResult: false,
            result: res.data.msg, 
            resultIcon: that.data.imgurl + 'h5_images/businessAssistant/icon_fail.png'
          })
          wx.setNavigationBarTitle({
            title: '核销失败'
          })
        }
      }

    })
  },


  onShow: function() {


  },
  //扫码核销
  getScancode() {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        wx.navigateTo({
          url: '/pages/main/cancel/cancelResults/cancelResults?code=' + result,
        })
      }
    })
  }


})