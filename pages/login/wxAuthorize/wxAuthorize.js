var app = getApp();
var http = require("../../../utils/request.js");

Page({

  data: {
    wxPhone : false,  //wx绑定的手机号
    code:'', //登录code,
    userPhone:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      userPhone: app.globalData.userPhone
    })
    
  },

  onShow:function(){
    this.getCode();
  },
checkBtn(){
  this.setData({
    wxPhone:true
  })
  var data = {
    'status': this.data.wxPhone ? 2 : 1,
    'phone': this.data.userPhone.phone ? this.data.userPhone.phone : '',
    'iv': '',
    'encryptedData': '',
    'code': '',
    'unionid': this.data.userPhone.unionid
  }

  //请求获取手机号 接口
  http.ordinary.call(this, 'wx_login', data, this.getPhoneCallback, 1, true);
},

  //点击获取微信用户手机号
  getPhoneNumber:function(e){
    var that = this;

    //没有code
    if (!this.data.code) {
      this.getCode("登录失败，请重试"); //重新设置code
      wx.showToast({
        title: '',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return;
    }

    if (!e.detail.encryptedData) {
      //如果获取手机信息加密数据失败 或者 拒绝了授权 ，则跳转到手动绑定手机号页面  
      wx.showToast({
        title: '授权失败，请重新授权',
        icon: 'none',
        duration: 2000, 
        mask: true,
      })
      return;
    }

    var data = {
      'status': that.data.wxPhone ? 2:1,
      'phone': that.data.userPhone.phone ? that.data.userPhone.phone:'',
      'iv': e.detail.iv,
      'encryptedData': e.detail.encryptedData,
      'code':this.data.code,
      'unionid': that.data.userPhone.unionid
    }

    //请求获取手机号 接口
    http.ordinary.call(that, 'wx_login', data, that.getPhoneCallback, 1,true);
    return;
  },

  //用微信绑定的手机号--登录服务商回调
  getPhoneCallback:function(data){

    this.getCode(); //刷新code

    if(!data){
      return;
    }

    //登录成功
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
      duration: 1000,
      mask:true
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

  },

  //获取微信登录的code
  getCode: function () {
    var that = this;
    wx.login({
      success(res) {
        console.log(res)
        that.setData({
          code: res.code
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