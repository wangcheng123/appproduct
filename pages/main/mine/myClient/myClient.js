// pages/main/mine/myClient/myClient.js
const app = getApp()
const http = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noClient:true,

    mineClients:[],  //我的客户页面数据

    page : 1,  //当前页
    tmonth:0,  //是否本月数据

    mineData: {}, //顶部数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ab_water = wx.getStorageSync('ab_water');
    this.setData({
      ab_water
    });
    if (options.tmonth){
      this.setData({
        tmonth:1
      })
    }
    // this.getData();
  },

  onShow: function () {
    this.setData({
      imgUrl: app.globalData.imgurl,
      mineClients:[],
      page:1
    })

    this.getData();
  
  },

  //分页加载数据
  lower:function(){
    console.log("触发了lower");
    this.setData();
  },

  //数据请求
  getData: function (type) {
    
    //请求title数据
    http.ordinary.call(this, 'mkq/fx/mn/index', {}, this.mine, 1)

    var data = {
      page:this.data.page,
      pageSize:15,
      tmonth: this.data.tmonth
    }

    this.setData({
      page: data.page +1
    })

    http.ordinary.call(this, 'mkq/fx/mn/rec', data, this.mineClient, 1)
  },

  //渲染页面
  mineClient: function (data) {
    //判断如果没有数据就让没有客户页面显示
    if (!data) {

      if (this.data.page == 2){
        this.setData({
          noClient: false
        })
      }
      return;
    }
    console.log(data);
    this.setData({
      mineClients: this.data.mineClients.concat(data),
    })
  },

  //渲染页面 title字段
  mine: function (data) {
    this.setData({
      mineData: data,
    })
  },

  onReachBottom:function(){
    this.getData()
  },

  subyichang(e){
    let taht = this;
    let status = e.currentTarget.dataset.status;
    if (status != 0){
      wx.showModal({
        content: '此客户绑定多个服务商，请尽快与客服联系：400-671-1314或前来武汉美美咖科技有限公司处理！',
        confirmColor: '#FF383E',
        showCancel: false,
        confirmText: '查看详情',
        success: function (e) {
          // console.log(e);
          // 这里跳转到H5页面
          taht.toH5prize();
        }
      })
    }
    
  },
  toH5prize() {
    let url = wx.getStorageSync('abnorl_url');
    wx.navigateTo({
      url: '/pages/h5/index?url=' + app.UrlEncode(url),
    })
  }
})