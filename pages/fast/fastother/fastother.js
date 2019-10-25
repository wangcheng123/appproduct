var app=getApp();
var http = require('../../../utils/request.js');
Page({
  data: {
    user_nature: '',    //性格特点
    user_concern: '',   //用户关注点
    know_hospitals: '', //曾咨询过的医院
    done_project:'',   //曾做过的医美项目
    auto_economic: '',  //经济自主权
    power_economic: '', //经济实力

    follow_project:"",  //铺垫项目
    follow_level:"",    //铺垫程度
    expect_free:'',     //预计消费额
    submit_remark:'',          //备注

    expect_frees: ['1万以下', '1-5万', '6-10万', '11-20万', '20万以上'],  //预约类型列表
    expect_free_str:"",
    
    //用户关注点
    user_concern_arr: { 1: false, 2: false, 3: false, 4: false},
  },
 
  onLoad: function (options) {
    var user_concern = app.globalData.order.user_concern ? app.globalData.order.user_concern : "";

    var user_concern_arr = []

    for(var i = 1 ;i<5;i++){
      user_concern_arr[i] = user_concern.indexOf(i) != -1 ? true : false;
    }

    this.setData({
      user_concern_arr: user_concern_arr,

      user_nature: app.globalData.order.user_nature,    //性格特点
      user_concern: app.globalData.order.user_concern,   //用户关注点
      know_hospitals: app.globalData.order.know_hospitals, //曾咨询过的医院
      done_project: app.globalData.order.done_project,   //曾做过的医美项目
      auto_economic: app.globalData.order.auto_economic,  //经济自主权
      power_economic: app.globalData.order.power_economic, //经济实力
    })

  },

  //填写性格特点
  set_user_nature:function(e){
    this.setData({
      user_nature: e.detail.value
    })
  },
  //填写曾咨询医院
  set_know_hospitals:function(e){
    this.setData({
      know_hospitals: e.detail.value
    })
  },
  //填写曾做过的医美项目
  set_done_project:function(e){
    this.setData({
      done_project: e.detail.value
    })
  },
  //填写经济自主权
  set_auto_economic:function(e){
    this.setData({
      auto_economic: e.detail.value
    })
  },
  //填写经济实力
  set_power_economic:function(e){
    this.setData({
      power_economic: e.detail.value
    })
  },
  //填写铺垫项目
  set_follow_project:function(e){
    this.setData({
      follow_project: e.detail.value
    })
  },
  //填写铺垫程度
  set_follow_level:function(e){
    var follow_level = parseInt(e.detail.value);

    if (follow_level > 100){
      follow_level = 100;
    }

    this.setData({
      follow_level: follow_level
    })
  },
  //选择预计消费
  expectfreeChange:function(e){
    this.setData({
      expect_free: parseInt(e.detail.value) + 1,
      expect_free_str: this.data.expect_frees[e.detail.value],
    })
  },
  //选择用户关注点
  set_user_concern:function(e){
    var concern = e.detail.value.join("#")
    this.setData({
      user_concern: concern
    })
  },
  //输入备注
  set_submit_remark:function(e){
    this.setData({
      submit_remark: e.detail.value
    })
  },

  //立即预约
  fastsubmit:function(){
    var order = app.globalData.order
   
    order.user_nature = this.data.user_nature
    order.user_concern = this.data.user_concern
    order.know_hospitals = this.data.know_hospitals
    order.done_project = this.data.done_project
    order.auto_economic = this.data.auto_economic
    order.power_economic = this.data.power_economic
    order.follow_project = this.data.follow_project
    order.follow_level = this.data.follow_level
    order.expect_free = this.data.expect_free
    //提交备注
    order.submit_remark = this.data.submit_remark

    // console.log(order);return;

    //order/add
    http.ordinary.call(this, 'order/add', order, this.fastOk, 0);

  },
  //提交成功
  fastOk:function(data){
    if(!data) return;

    wx.showToast({
      title: "预约成功",
      icon: 'none',
      duration: 2000
    })

    setTimeout(function () {
      app.globalData.order = {};
      wx.redirectTo({
        url: '../bookingForm/bookingForm?type=1',
      })
    }, 2000)

  }

})