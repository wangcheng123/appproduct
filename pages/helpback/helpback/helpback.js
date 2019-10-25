var app = getApp();
var http = require('../../../utils/request.js');

Page({
  data: {
    sname: app.globalData.server.server_realname, // 服务商姓名
    sphone: app.globalData.server.server_username, // 服务商手机号
    questionarr: [], // 问题数组
    page:1,
    pageSize:15,
  },

  onLoad: function (options) {
    
    if(!this.data.sname){
      this.setData({
        sname: app.globalData.server.server_realname, // 服务商姓名
        sphone: app.globalData.server.server_username, // 服务商手机号
      })
    }

    this.getData();

  },
  // 获取数据
  getData: function () {

    var data = {
      page: this.data.page,
      pageSize: this.data.pageSize
    }

    this.setData({
      page: data.page + 1
    })

    http.ordinary.call(this, 'question/list', data, this.dataToPage, 1);
  },

  //渲染页面
  dataToPage: function (data) {
    console.log(data)

    if (!data) {
      if (this.data.page == 2) {
        this.setData({
          isshow: true,
        })
      }
      return;
    }

    this.setData({
      questionarr: this.data.questionarr.concat(data)
    })

  },

  //分页加载
  onReachBottom: function () {
    this.getData();
  },


  // 点击查看解决方案
  clickgetval: function (e) {
    console.log(e)
    var ids = e.currentTarget.dataset.id
    console.log(ids)
    wx.navigateTo({
      url: '../solution/solution?id=' + ids,
    })
  }
})
