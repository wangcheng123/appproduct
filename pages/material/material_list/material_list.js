var app = getApp();
var http = require('../../../utils/request.js');

Page({
  data: {

    imgurl: app.globalData.imgurl,
    isshow: false, // 占位符

    listarr: [],  // 素材列表
    page: 1,
    pageSize: 6,

    type: '', // 素材类别id
    province_id: app.globalData.province.province_id, // 省份id
    mclass: 0,  //素材类型  0 全部  1 图片  2视频

  },

  onLoad: function (options) {
    this.setData({
      imgurl: app.globalData.imgurl,
    })

    wx.setNavigationBarTitle({
      title: options.title
    })

    this.setData({
      province_id:options.province_id,
      type: options.type
    })


    if (!options.type) {
      wx.showToast({
        title: '未获取素材类型',
        icon: 'none',
        duration: 2000,
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 500)
      return;
    }

    if (options.type) {
      this.setData({
        type: options.type,
        listarr: [],
        page: 1,
      })
    }

    // 获取列表数据
    this.getdata();
  },

  // 点击素材跳转详情
  todetails: function (e) {
    var that = this
    var mid = e.currentTarget.dataset.id
    var classs = e.currentTarget.dataset.class

    console.log(mid, classs)

    wx.navigateTo({
      url: '../material_del/material_del?mid=' + mid + '&class=' + classs,
    })
  },

  // 选择类型
  gettypeval: function (e) {

    var that = this
    var mclass = e.currentTarget.dataset.tab

    if(mclass == that.data.mclass){
      return;
    }

    that.setData({
      page: 1,
      listarr: [],
      mclass: mclass,
    })

    
    //再次调用数据
    that.getdata();

  },

  // 获取素材列表数据
  getdata: function () {

    wx.showLoading({
      title: '加载中',
    })

    var data = {
      page:this.data.page,
      pageSize:this.data.pageSize,
      type:this.data.type,
      keyword:'',
      province_id:this.data.province_id,
      class:this.data.mclass
    }

    this.setData({
      page : data.page + 1
    })

    http.ordinary.call(this, 'material/lists', data, this.dataToPage, 1);

  },

  dataToPage:function(data){

    console.log(data)

    if(!data){
      console.log(this.data.page)

      if(this.data.page == 2){
        
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

  // 上拉触底 加载素材列表
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '玩命加载中',
    })

    //再次调用数据
    that.getdata();
  },

  

})