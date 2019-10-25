// pages/h5/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let url = app.UrlDecode(options.url);

    let query = 'server_id=' + app.globalData.server.server_id + '&token=' + app.globalData.server.remember_token

    if(/\?/.test(url))
    {
      url += '&'+query
    }else{
      url += '?'+query
    }

    console.log("跳转的H5地址是" , url);

    this.setData({
      url:url,
    });
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

  }
})