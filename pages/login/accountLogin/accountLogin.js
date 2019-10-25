// pages/login/accountLogin/accountLogin.js
var app = getApp();
var http = require("../../../utils/request.js");
var http2 = require("../../../utils/request2.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowPassword: true, // 输入密码默认隐藏
    ispsw: true,
    username:'',
    passwd:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 密码显示隐藏
  toggleShowPassword: function (e) {
    var that = this
    if (that.data.isShowPassword) {
      that.setData({
        ispsw: false,
      })
    } else if (!that.data.isShowPassword) {
      that.setData({
        ispsw: true,
      })
    }
    var isShowPassword = !that.data.isShowPassword;
    that.setData({
      isShowPassword: isShowPassword,
    });
  },

  //绑定账号输入 
  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  //绑定密码输入 
  bindPasswdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    })
  },

  //账号密码登录
  login: function (e) {
    
    let username = this.data.username;
    let passwd = this.data.passwd

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

    if (passwd == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    let data = {
      username: username,
      password: passwd
    }
    //登录加载框
    wx.showLoading({
      title: '正在登录',
    })

    //http.ordinary.call(this, 'server/login', data, this.loginCallback, 4);
    http2.ordinary.call(this, 'login', data, this.loginCallback);
  },

  //登录回调
  loginCallback: function (data) {
    console.log("登录成功信息 =》 ",data);
    if (data) {
      // 存储 server_id remember_token
      app.globalData.server = data
      //登录成功缓存
      wx.setStorage({
        key: 'server',
        data: data
      })

      //如果不能进入页面 则进入提示中间页 (用于弹窗提示)
      if (data.redirect_type == 1 || data.redirect_type == 2 || data.redirect_type == 4) {
        wx.redirectTo({
          url: '../../login/loginTip/loginTip',
        })
      }else{
        // 跳转主页
        wx.switchTab({
          url: '../../main/index/index',
        })
      }

      // 提示登录成功
      wx.showToast({
        title: "登录成功",
        icon: 'none',
        duration: 2000
      })

     
    }

  },

  //清除手机号
  clear_username:function(){
    this.setData({
      username:'',
    })
  },

})