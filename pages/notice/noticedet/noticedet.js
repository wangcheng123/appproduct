var app = getApp();
const http = require("../../../utils/request.js");

Page({
  data: {

    imgUrl: app.globalData.imgurl,

    pData:{}
  },
  onLoad: function (options) {
    this.getData(options.id);
  },

   //获取数据
  getData: function (id) {

    var data={"id":id}

    http.ordinary.call(this, 'noticles/one', data, this.dataToPage, 1);
  },

  //渲染数据
  dataToPage: function (data) {
    this.setData({
      pData: data
    });
  },

})