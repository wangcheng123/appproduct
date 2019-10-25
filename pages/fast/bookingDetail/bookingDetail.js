var app = getApp();

var http = require('../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id : 0,
    order: {},
    // 订单中的user信息
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("跳转页面携带参数为=>"+options.order_id);
    let order_id = options.order_id;

    this.setData({
      order_id: order_id
    })

    let data = {
      'order_id': order_id
    }
    http.ordinary.call(this, 'order/detail', data, this.dataToPage, 1);

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

  },


  /**
   * 请求接口的回调
   */
  dataToPage: function (data) {
    console.log(data);
    if (data) {
      
      if (!data.user) {
        wx.showToast({
          title: '订单user信息缺失',
          icon: 'none',
          duration: 1000
        })
      }

      console.log(data.user);
      this.setData({
        order: data,
        user: data.user
      })
    }

  } 

})