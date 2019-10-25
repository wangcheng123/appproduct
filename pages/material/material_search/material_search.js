var app = getApp();
var http = require('../../../utils/request.js');

Page({
  data: {
    imgurl: app.globalData.imgurl,
    isshow:false,  //占位符

    listarr: [],  // 素材列表
    page: 1,
    pageSize: 6,
    type: '', // 素材类别id
    province_id: 13, // 省份id
    mclass: 0,  //素材类型  0 全部  1 图片  2视频
    keyword: "", //搜索关键词

  },
  onLoad: function (options) {
    this.setData({
      province_id:options.province_id,
      keyword:options.keyword,
      imgurl: app.globalData.imgurl,
    })

    this.getData();
  },

  getData:function(){
    var data = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      keyword: this.data.keyword,
      province_id: this.data.province_id,
    }

    this.setData({
      page:data.page + 1
    })

    http.ordinary.call(this, 'material/lists', data, this.dataToPage, 1);

  },

  dataToPage: function (data) {

    if (!data) {
      console.log(this.data.page)

      if (this.data.page == 2) {

        this.setData({
          isshow: true,
        })
      }
      return;
    }

    this.setData({
      listarr: this.data.listarr.concat(data.data),
      isshow: false,
    })

  },

  goback:function(){

    wx.navigateBack({
      delta:1,
    })
  },

  // 点击素材跳转详情
  todetails: function (e) {
    var that = this
    var mid = e.currentTarget.dataset.id
    var classs = e.currentTarget.dataset.class

    wx.navigateTo({
      url: '../material_del/material_del?mid=' + mid + '&class=' + classs,
    })
  },

  //再次输入搜索
  searchkeyword:function(e){

    this.setData({
      keyword:e.detail.value,
      page:1,
      listarr:[],
    })

    this.getData();
  },

  // 上拉触底 加载素材列表
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '玩命加载中',
    })

    //再次调用数据
    that.getData();
  },

  //清除输入框内容
  clear:function(){
    this.setData({
      keyword:''
    })
  }

})