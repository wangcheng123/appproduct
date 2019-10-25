var app = getApp();//获取应用实例
var http = require("../../../../../utils/request.js");

Page({
  data:{
    realname:'', //持卡人
    card_num:"", //银行卡号
    verify:'',   //验证码

    username: '',

    vsecond:0, //距离下次发送验证码的秒数

  },
  onLoad:function(){
    this.setData({
      username: app.globalData.server.server_username
    })
  },

  //输入持卡人姓名
  setName:function(e){
    this.setData({
      realname:e.detail.value,
    })
  },

  //输入卡号
  setCard:function(e){
    this.setData({
      card_num: e.detail.value,
    })
  },

  //输入验证码
  setVerify:function(e){
    this.setData({
      verify: e.detail.value,
    })
  },

  //发送短信验证码
  sendMsg: function () {
    var data = {
      type: 1004,
      username: app.globalData.server.server_username,
    }
    http.ordinary.call(this, 'send/msg', data, this.verMsg, 4);

  },
  //验证码倒计时
  verMsg: function (data) {

    var that = this

    this.setData({
      vsecond: 60
    });

    //执行倒计时
    var timer = setInterval(function () {
      var vsecond = that.data.vsecond - 1
      that.setData({
        vsecond: vsecond
      })

      if (vsecond <= 0) {
        clearInterval(timer)
      }
    }, 1000)


  },

  //确定提交
  cardsub:function(){

    var data = {
      realname: this.data.realname,
      card_num: this.data.card_num,
      verify:this.data.verify
    }

    if(!data.realname){
      wx.showToast({
        title: '请填写持卡人姓名',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    if(!data.card_num){
      wx.showToast({
        title: '请填写银行卡号',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    if (!data.verify) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    console.log(data)

    http.ordinary.call(this, 'mkq/card/add', data, this.subok, 1);

  },

  //提交成功后的操作
  subok:function(data){

    console.log(data)

    if(!data){
      return;
    }

    wx.showToast({
      title: "添加成功",
      icon: 'none',
      duration: 2000,
      mask: true,
    })

    setTimeout(function () {
      wx.navigateBack({
        delta: 1,
      })
    }, 2000);

    
    
  },



})