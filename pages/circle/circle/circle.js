var app=getApp();
var http = require("../../../utils/request.js");
var charts = require('../../../utils/wxcharts.js'); 

Page({
  data: {

    type:1,  // 1 推荐奖励 2 分销奖励tab

    proData : {},//项目奖励数据
    fxData:{}, //分销奖励数据

  },

  onLoad:function(){
    // let ab_water = wx.getStorageSync('ab_water');
    let ab_apply = wx.getStorageSync('ab_apply');
    this.setData({
      ab_apply
    });
    // console.log(res.ab_water, res.ab_apply);
  },

  onShow:function(){
    this.getData();
  },

  //切换数据
  circletabbtn:function(e){
    
    var type = e.currentTarget.dataset.tab

    if(this.data.type == type){
      return;
    }

    this.setData({
      type: type
    })

    this.getData();

  },

  //获取数据
  getData:function(){
    http.ordinary.call(this, 'mkq/index', {type:this.data.type}, this.dataToPage, 1);
  },

  //渲染数据
  dataToPage:function(data){
    if(!data){
      return;
    }
    if(this.data.type == 1){
      this.setData({
        proData:data,
      })

    }else{
      this.setData({
        fxData: data,
      })
    }

    this.getWxChartData(data.tran_list);
  },

  getWxChartData: function (data) {
    var that = this
    var x = []
    var y = []
    for (var i in data) {
      x.push(data[i]['day'])
      y.push(parseFloat(data[i]['reward']))
    }
    
    that.ringShow(x, y);
  },
  //折线图
  ringShow: function (x, y) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var yuelineChart = new charts({
      canvasId: 'ringGraph',
      type: this.data.type == 1 ? "column" :"line",
      categories: x, //X轴
      animation: true,
      series: [{
        name: '最近7天奖励',
        data: y,
        format: function (val, name) {
          return val.toFixed(1);      //折线图的值
        },
        color: '#FF77A7',
      }],
      xAxis: {
        disableGrid: true,
      },
      yAxis: {
        max: 12,
        min: 0,
        disabled: false,
        gridColor: '#fff',
        fontColor: '#fff',
      },
      width: windowWidth + 20 ,
      height: 150,
      dataLabel: true,               //折现图的值是否显示
      dataPointShape: true,          //是否显示折点
    });
  },


  //点击奖励订单跳转页面
  toRewardOrder: function () {
    wx.navigateTo({
      url: '/pages/main/mine/rewardOrder/rewardOrder',
    })
  },
  toH5prize(){
    let url = wx.getStorageSync('abnorl_url');
    wx.navigateTo({
      url: '/pages/h5/index?url=' + app.UrlEncode(url),
    })
  }

})