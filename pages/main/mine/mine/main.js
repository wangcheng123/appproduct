//获取应用实例 
const app = getApp()
const http = require('../../../../utils/request.js');

Page({
  data: {
    issewm: false, // 二维码弹框默认隐藏

    imgUrl: app.globalData.imgurl,

    mineData: {}, //我的页面数据
    message:'',
    sig_status:null,
    sig_pay_status: null
  },
  onLoad: function () {
    let ab_water = wx.getStorageSync("ab_water");
    let sig_status = app.globalData.server.sig_status
    let sig_pay_status = app.globalData.server.sig_pay_status
    let message = this.data.message
    console.log(123, sig_status, sig_pay_status)
    if (sig_pay_status == 2 && sig_status == 0){
      message = '我要成为商户'
    } else if (sig_pay_status == 2 && sig_status == 1){
      message = '已支付/认证中'
    } else if (sig_pay_status == 2 && sig_status == 2) {
      message = '已支付/认证失败'
    } else if (sig_pay_status == 2 && sig_status == 3) {
      message = '已支付/待签约'
    } else if (sig_pay_status == 2 && sig_status == 5) {
      message = '已支付/审核中'
    } else if (sig_pay_status == 2 && sig_status == 6) {
      message = '已支付/审核失败'
    }
    this.setData({
      ab_water,
      sig_pay_status,
      sig_status,
      message
    })
  },
  onShow: function () {
    this.getData();
    this.setData({
      imgUrl: app.globalData.imgurl,
    })
  },

  //点击二维码弹框显示
  codePopup: function () {
    var that = this
    that.setData({
      issewm: true,
    })
  },
  // 点击关闭按钮二维码弹窗隐藏
  hideewm: function () {
    var that = this
    that.setData({
      issewm: false,
    })
  },

  //点击奖励订单跳转页面
  torewardOrder: function () {
    wx.navigateTo({
      url: '../rewardOrder/rewardOrder',
    })
  },

  //数据请求 数据展示丢到详情页面

  getData:function(type){
    http.ordinary.call(this,'userInfo',{},this.mine,1,true)
  },

  //渲染页面
  mine:function(data){
    if (!data){
      return
    }
    let reg = /^(\d{3})\d{4}(\d{4})$/;
    data.username = data.username.replace(reg, "$1****$2");
    this.setData({
      mineData:data
    })
  },

  //跳转素材中心  海报
  toPost: function () {
    wx.navigateTo({
      url: '/pages/material/material/material?source=1',
    })
  },
  //挑转至我的客户
  toCustomer() {
    wx.navigateTo({
      url: '/pages/main/mine/myClient/myClient',
    })
  },
  //挑转至我的资金
  toMoney() {
    wx.navigateTo({
      url: "/pages/main/pirce/price",
    })
  },

  toHelpBack: function () {
    wx.navigateTo({
      url: '/pages/helpback/helpback/helpback?source=1',
    })
  },

  //跳转到卡券H5
  toCardH5: function () {
    
    let url = this.data.mineData.referee_url
    wx.navigateTo({
      url: '/pages/h5/index?url=' + app.UrlEncode(url),
    })
  },
  //退出
  exitBtn(){
    app.globalData.server = {}
    wx.clearStorage()
    wx.reLaunch({
      url: '/pages/login/index/index',
    })
  },

})
