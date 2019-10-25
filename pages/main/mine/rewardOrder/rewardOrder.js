// pages/main/mine/rewardOrder/rewardOrder.js
var app = getApp();
var http = require('../../../../utils/request.js');

Page({

  data: {
    imgUrl: app.globalData.imgurl, //图片域名
    noClient:true,

    page:1, //当前页
    pageSize:6, //每次6条

    orders:[] , //订单列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgurl, //图片域名
    })
    this.getData()
  },

  //记载数据
  getData:function(){
    var data = {
      page:this.data.page,
      pageSize:this.data.pageSize,
    }

    this.setData({
      page:data.page + 1
    });

    http.ordinary.call(this, 'mkq/fx/mn/orders', data, this.dataToPage, 1);
  },

  //数据渲染页面
  dataToPage:function(data){
    console.log(data);

    if (!data) {
      if (this.data.page == 2) {
        this.setData({
          noClient: false,
        })
      }
      return;
    }

    this.setData({
      orders:this.data.orders.concat(data),
    });

  },

  //触底加载
  onReachBottom:function(){
    this.getData();
  },

})
