var app = getApp();
var http = require('../../../utils/request.js');

Page({
  data: {
    typeid: '',  // 问题id

    pData: {},  // 页面数据数组

    type: 0, //最后一次有用无用点击情况  0 从未点击  1 有用  2无用
  },


  // 监听页面加载
  onLoad: function (options) {

    var that = this
    var questionid = options.id
    that.setData({
      typeid: options.id
    })

    that.getData();
  },


  // 请求页面数据
  getData: function () {

    http.ordinary.call(this, 'question/one', { id: this.data.typeid }, this.dataToPage, 1);

  },

  //页面数据渲染
  dataToPage:function(data){
    var that = this

    that.setData({
      pData:data, 
      type:data.type
    })

    var article = data.method

    var WxParse = require('../../../wxParse/wxParse.js');

    WxParse.wxParse("article", "html", article, that, 0);

  },

  //点击有用或者无用
  hit:function(e){
    var type = e.currentTarget.dataset.type;

    this.setData({
      type:type
    })

    http.ordinary.call(this, 'question/hint', { id: this.data.typeid, type:type},null,1)

  },

})