var app=getApp();
var http = require('../../../utils/request.js');
Page({
  data: {

    realname:'',  //客户姓名
    username:'',  //客户手机号
    verify: "",   //验证码 
    age:"",       //年龄
    sex:0,        //性别
    workplace:'', //职业

    vsecond:0,    //距离下次发送短信验证码的秒数

    userData:{}, //接口返回数据
  },
  
  onLoad: function (options) {
   
  },

  //填写客户姓名
  setRealname:function(e){
    this.setData({
      realname:e.detail.value
    })
  },

  //填写手机号
  setUsername:function(e){
    var username = e.detail.value;

    this.setData({
      username: username,
    })

    if (username.length == 11){
      if(/^1[3-9][0-9]{9}$/.test(username)){
        //判断用户是否已经注册过
        http.ordinary.call(this, 'isUser', { username: username, realname:this.data.realname}, this.userToPage, 0)

      }else{
        wx.showToast({
          title: '请填写正确手机号',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
    }

  },
  //如果是老用户，获取到信息后，将数据渲染到页面上
  userToPage:function(data){

    if (!data || !data.realname || data.length <= 0) return;  //未注册

    if(!data.realname){
      data.realname=this.data.realname;
    }

    this.setData({
      realname: data.realname ? data.realname : this.data.realname,  //客户姓名
      age: data.age,       //年龄
      sex: data.sex,        //性别
      workplace: data.workplace, //职业
      userData:data,     //所有数据
    })

  },

  //发送短信验证码
  sendcode:function(){

    if (!this.data.username){
      wx.showToast({
        title: '请先填写手机号',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    var data={
      type: 1002,
      username: this.data.username,
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
  //填写验证码
  setVerify:function(e){
    var verify = e.detail.value

    this.setData({
      verify: verify
    })

  },
  //填写年龄
  setAge:function(e){
    var age = e.detail.value
    this.setData({
      age:age
    })
  },
  //选择性别
  setSex:function(e){
    var sex = e.target.dataset.sex
    this.setData({
      sex:sex
    })
  },
  //填写职业
  setWork:function(e){
    var workplace = e.detail.value

    this.setData({
      workplace: workplace
    })
  },

  // 下一步验证  客户姓名  客户手机号  验证码  年龄  性别  职业
  userhrefto: function () {
    var data = this.data

    //数据验证 
    if (!data.realname) {
      wx.showToast({
        title: '请填写客户姓名',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if (!data.username || !/^1[3-9][0-9]{9}$/.test(data.username)){
      wx.showToast({
        title: '请填写正确格式手机号',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if (!data.verify || data.verify.length != 6) {
      wx.showToast({
        title: '请填写6位验证码',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if (!data.age) {
      wx.showToast({
        title: '请填写客户年龄',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if(!data.sex){
      wx.showToast({
        title: '请选择客户性别',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if(!data.workplace){
      wx.showToast({
        title: '请填写客户职业',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    //请求用户注册接口
    var tdata = {
      username:data.username,
      realname:data.realname,
      sex:data.sex,
      workplace:data.workplace,
      age:data.age,
      verify:data.verify,
    }

    //发送请求
    http.ordinary.call(this, 'getUser', data, this.nextTo, 0);

  },
  //用户注册结果处理
  nextTo:function(data){
    if(!data) return;

    console.log(data);
    console.log(this.data.userData)

    var tdata = {
      user_id:data.user_id,
      verify:this.data.verify,
      auto_economic: this.data.userData.auto_economic ? this.data.userData.auto_economic:'',
      user_nature: this.data.userData.user_nature ? this.data.userData.user_nature:'',
      user_concern: this.data.userData.user_concern ? this.data.userData.user_concern:'',
      know_hospitals: this.data.userData.know_hospitals ? this.data.userData.know_hospitals:'',
      done_project: this.data.userData.done_project ? this.data.userData.done_project:'',
      power_economic: this.data.userData.power_economic ? this.data.userData.power_economic:'',
    }

    var order = app.globalData.order

    for(var i in tdata){
      order[i] = tdata[i];
    }

    app.globalData.order = order;

    wx.navigateTo({
      url: '../fastother/fastother',
    })

  },

})