var app = getApp();
const http = require("../../../utils/request.js");

Page({
  data: {
    page:1,
    pageSize: 6,
    pData:[],  //页面数据
  },
  onLoad: function (options) {
    this.getData();
  },

  //点击查看详情进入详情列表
  todetails: function (e) {
    //获取id
    var id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: '../noticedet/noticedet?id=' + id,
    })
  },

  //获取数据
  getData:function(){
    var data={
      page: this.data.page,
      pageSize: this.data.pageSize,
    }

    this.setData({
      page:this.data.page + 1
    });

    http.ordinary.call(this, 'noticles/list', data, this.dataToPage, 1);
  },

  //渲染数据
  dataToPage:function(data) {
    if(!data) return;
      
    this.setData({
      pData: this.data.pData.concat(data)
    });
  },

  //分页加载数据
  lower:function(){
    this.getData();

  }

})