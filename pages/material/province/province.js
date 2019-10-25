var app = getApp();
var http = require('../../../utils/request.js');

Page({
  data: {
    location: { 'province_id': 13, 'name': '湖北省' }, //定位默认湖北省

    prolist:{},
  },

  onLoad: function (options) {
    console.log(options)

    this.setData({
      location:options
    });

    //获取所有省份 
    this.getallprovince();

  },

  getallprovince:function(){
    http.ordinary.call(this, 'province/list', {}, this.proToPage, 1);
  },
  proToPage:function(data){
    console.log(data)
    this.setData({
      prolist:data.provinces
    })
  },

  //选择省份
  setProvince:function(e){

    var location = e.target.dataset;

    console.log(location)

    this.setData({
      location:location
    })

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({ 
      new_location: location
    })

    wx.navigateBack({
      //返回 
      delta:1
    })

  }


})