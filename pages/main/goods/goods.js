// pages/main/goods/goods.js

var app = getApp();
var http = require("../../../utils/request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentIndex:0,
    index:0,
    isShowclass:true,

    goods:[], //商品数据

    cates:null, //头部分类

    imgUrl: app.globalData.imgurl,

    page:1,

    cate_id:0,
    redirect_type:0,
    showModal:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgurl,
    });
    let redirect_type = app.globalData.server.redirect_type ? app.globalData.server.redirect_type : 0
    let currentIndex = this.data.currentIndex
    if (redirect_type==3){
      currentIndex = 2
    }
    this.setData({
      redirect_type,
      currentIndex,
      showModal: false
    })
    this.getData();
  },
  /**
   * 点击tab切换
   */
  changeNav(e){
    console.log(4444444444)
    if (this.data.redirect_type == 3) {
      this.setData({
        showModal:true
      })
      return
    }
    let currentIndex = e.currentTarget.dataset.index
    let index = currentIndex
    this.setData({
      currentIndex,
      index,
      goods: [],
      page: 1,
    })
    //请求数据
    this.getData();
  },
  changetab: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } 

    this.setData({
      isShowclass:true,
      currentTab: e.target.dataset.current,
      goods: [],
      page: 1,
      cate_id: e.target.dataset.current
    })

    //请求数据
    this.getData();

  },

  //下拉加载
  lower:function(){
    this.getData();
  },

  //数据请求
  getData: function () {
    
    let currentIndex = this.data.currentIndex
    if (currentIndex == 0) {
      var data = {
        page: this.data.page,
        pageSize: 10,
      }
      http.ordinary.call(this, 'fxPlus', data, this.dataToPage, 1,true);
    } else if(currentIndex == 1){
      var data = {
        page: this.data.page,
        pageSize: 10,
      }
      http.ordinary.call(this, 'fxService', data, this.dataToPage, 1,true);
    }else{
      var data = {
        cate_id: this.data.cate_id,
        page: this.data.page,
        pageSize: 6,
      }
      http.ordinary.call(this, 'mkq/fx/mn/goods', data, this.dataToPage, 1);
    }
    

    

    
  },

  //渲染页面
  dataToPage: function (data) {
    
    var that = this;
    let currentIndex = this.data.currentIndex
    if(!data){
      return;
    }
    this.setData({
      page: this.data.page + 1,
    })
    //渲染分类列表
    if (that.data.cates == null && currentIndex == 2){
      that.setData({
        cates:data.cate
      });
    }
    
    //渲染数据
    var goods = [];
    
    var dgoods
    if (currentIndex==2){
      dgoods = data.goods
      for (var i = 0; i < dgoods.length; i += 2) {
        goods.push(dgoods.slice(i, i + 2));
      }
    }else{
      goods = that.data.goods.concat(goods)
    }
    that.setData({
      goods:that.data.goods.concat(goods),
    });
  
  },

  //跳转主小程序
  jumpApp:function(e){
    var id = e.currentTarget.dataset.id

    if (!id || parseInt(id) < 1 ){
      return;
    }

    wx.navigateToMiniProgram({
      appId: 'wx068421b4fbf58332',
      path: '/pages/goods_detail/main?goods_id=' + id,
      extraData: {
        stg: 'server'
      },
      envVersion: 'release',  //develop 开发  trial 体验  release 正式   
      success(res) {
        // 打开成功
        console.log("跳转成功")
      },
      fail(res){
        console.log("取消跳转")
      }
    })

  },
 

})