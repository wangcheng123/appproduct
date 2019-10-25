// pages/login/wxLogin/wxLogin.js
var app = getApp();
var http = require("../../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    username:'',
    verify: '',

    downNum: 0, //倒计时的数值
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //绑定手机号输入 
  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //绑定验证码输入 
  bindVerifyInput: function (e) {
    this.setData({
      verify: e.detail.value
    })
  },

  //点击获取验证码切换另一种样式
  getyzcode:function(){
    let username = this.data.username;
    if (username == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (!(/^1[3-9][0-9]{9}$/.test(username))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    this.setData({
      downNum:60,
    })

    let data = {
      'phone': username
    }
    http.ordinary.call(this, 'send_code', data, this.getyzcodeCallback, 1,true);
    
  },

  //获取验证码回调
  getyzcodeCallback:function(data) {

    var that = this;

    //获取手机验证码 成功
    var downNum = this.data.downNum;

    //倒计时
    var timer = setInterval(function () {

      downNum = --downNum

      that.setData({
        downNum: downNum
      })

      if (downNum <= 0) {
        clearInterval(timer)
      }

    }, 1000)

  },

  //绑定手机点击
  bindPhone:function(){
    let username = this.data.username;
    let verify = this.data.verify;

    if (username == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (!(/^1[3-9][0-9]{9}$/.test(username))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (verify == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    let data = {
      username: username,
      code: verify,
    }
    //登录加载框
    wx.showLoading({
      title: '正在绑定',
    })

    http.ordinary.call(this, 'mobile_login', data, this.bindPhoneCallback, 1,true);
  },

  //绑定手机号的回调
  bindPhoneCallback: function (data) {
    if (data) {
      app.globalData.server = data
      //登录成功缓存
      wx.setStorage({
        key: 'server',
        data: data
      })
      // 提示登录成功
      wx.showToast({
        title: "登录成功",
        icon: 'none',
        duration: 1000
      })

      //如果不能进入页面 则进入提示中间页 (用于弹窗提示)
      if (data.redirect_type == 1 || data.redirect_type == 2 || data.redirect_type == 4) {
        wx.redirectTo({
          url: '../../login/loginTip/loginTip',
        })
      } else {
        // 跳转主页
        wx.switchTab({
          url: '../../main/index/index',
        })
      }
      
    }
  }
  
})