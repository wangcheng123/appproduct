var app=getApp();
var http = require("../../../../../utils/request.js");

Page({
  data:{
   imgurl: app.globalData.imgurl, //图片路径
  
   edit_id:0,         //正在编辑的银行卡ID
   isshow:false,     //空白占位符

   showModal:false, //点击解除绑定弹出框

   page:1, //当前页
   pageSize:6, //每页6条

   banks:[], //银行卡列表
  },
  onLoad:function(){
    this.setData({
      imgurl: app.globalData.imgurl, //图片路径
    })
  },
  onShow:function(){
    this.setData({
      edit_id:0,
      page:1,
      banks: [],
      showModal: false,
      isshow:false,
    })
    this.getList();
  },

  //获取银行卡列表
  getList:function(){
    var data = {
      page:this.data.page,
      pageSize:this.data.pageSize,
    }

    this.setData({
      page:data.page + 1
    })

    http.ordinary.call(this, 'mkq/card/list', data, this.listToPage, 1);
  },
  //一囊卡列表渲染到页面
  listToPage:function(data){
    console.log(data)
    if(!data){
      if(this.data.page == 2){
        this.setData({
          isshow:true,
        })
      }
      return;
    }

    this.setData({
      banks:this.data.banks.concat(data),
    })

  },
  
  //触底分页
  banklower:function(){
    this.getList();
  },


  //点击显示接触绑定按钮
  chedit:function(e){
    this.setData({
      edit_id:e.target.dataset.id
    })
  },

  //解除绑定弹窗
  deletebank:function(){
    this.setData({
      showModal:true,
    })
  },

  //取消解除绑定
  canceld:function(){
    this.setData({
      showModal: false,
      edit_id:0,
    })
  },

  //确定解除绑定
  confirm:function(){
    http.ordinary.call(this, 'mkq/card/del', { card_id: this.data.edit_id }, this.delcard, 1);
  },
  delcard:function(data){
    this.setData({
      page:1,
      banks:[],
      showModal: false,
      edit_id: 0,
    })
    this.getList();
  },

  //选择银行卡
  cardselect:function(e){
    console.log(e)
    var card_id=e.currentTarget.dataset.id;
    var cardtxt = e.currentTarget.dataset.cardtxt

    var pages = getCurrentPages();

    var prevPage = pages[pages.length - 2];  //上一个页面

    prevPage.setData({
      card_id: card_id,
      card_txt: cardtxt,
    })

    wx.navigateBack({
      delta: 1,
    })

  },




  

})