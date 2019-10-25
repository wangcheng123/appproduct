// pages/login/index/index.js
var app = getApp();
var http = require("../../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow:function(){
    this.getCode();
  },
  
  //点击账号登录跳转到账号登录accountLogin页面
  aclogin:function(){
    wx.navigateTo({ 
      url: '../accountLogin/accountLogin',
    })
  },
  //点击手机号登录/注册跳转到账号登录bindingPhone页面
  bindphone(){
    wx.navigateTo({
      url: '../bindingPhone/bindingPhone',
    })
  },
  //点击微信授权跳转到wxAuthorize页面
  bindGetUserInfo: function (e) {
    var that = this

    if(!e.detail.iv){
      return;
    }

    //没有code
    if (!this.data.code){
      this.getCode(); //重新设置code
      wx.showToast({
        title: "登录失败，请重试",
        icon: 'none',
        duration: 2000,
        mask:true
      })
      return;
    }
    

    var data = {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData,
      code:this.data.code
    }
    // 发起网络请求
    http.ordinary.call(this, 'wx_auth', data, that.wxLoginCallback, 1,true);
    return;

  },


  //wx登录请求的回调
  wxLoginCallback: function (data) {

    this.getCode(); //刷新code

    if(!data){
      return;
    }

    //登陆成功
    if (data){
      //存储登录数据
      app.globalData.userPhone = data

      //登录成功缓存
      wx.setStorage({
        key: 'userPhone',
        data: data
      })

      // 提示登录成功
      // wx.showToast({
      //   title: "登录成功",
      //   icon: 'none',
      //   duration: 1000
      // })

      // 跳转主页
      wx.navigateTo({
        url: '/pages/login/wxAuthorize/wxAuthorize',
      })
    }else{
      //需要绑定手机号
      // app.globalData.openid = data.openid
      app.globalData.unionid = data.unionid
    }

  },

  //获取微信登录的code
  getCode:function(){
    var that = this;
    wx.login({
      success(res) {
        console.log(res)
        that.setData({
          code:res.code
        })
      },
      fail(res) {
        wx.showToast({
          title: '授权登录失败',
          icon: 'none',
          duration: 2000
        })
        console.log('登录失败！' + res.errMsg)
      }
    })
  }
})