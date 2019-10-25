var app=getApp();
var http = require("../../../utils/request.js");

Page({
  data: {
    imgUrl: app.globalData.imgurl, //图片域名

    income:0, //入账 
    outcome:0, //出账

    start_time:"", //开始时间  不写默认本月第一天
    end_time:"",   //结束时间  不写默认本月最后一天

    page:1, //当前页
    pageSize:10,//每页加载数量


    colorChange: true,

    isshow:false, //占位符

    fx_list:[],  //流水数据

    flag:0,     //滑动锁

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {

  },

  onShow:function(){
    this.setData({
      page:1,
      fx_list:[],
    });

    this.getData();
  },

  //获取数据
  getData:function(){

    var data = {
      page:this.data.page,
      pageSize: this.data.pageSize,
      start_time: this.data.start_time,
      end_time: this.data.end_time
    }

    this.setData({
      page:data.page + 1
    })
    //滑动锁开放
    this.setData({
      flag: 0
    })

    http.ordinary.call(this, 'mkq/fx/trans', data, this.dataToPage, 1);
  },
  //渲染页面
  dataToPage:function(data){
    console.log(data)

    if(!data.list){
      if(this.data.page == 2){
        this.setData({
          isshow:true,
        })
      }
      return;
    }

    if (this.data.page == 2){
      this.setData({
        income:data.income,
        outcome:data.outcome
      })
    }

    this.setData({
      fx_list: this.data.fx_list.concat(data.list),
    })

  },

  //触底分页加载
  bindscrolltolower:function(){
    let tmpFlag = this.data.flag;
    if (tmpFlag == 0) {

      this.setData({
        flag: 1
      })
      this.getData()
    }

  },


})