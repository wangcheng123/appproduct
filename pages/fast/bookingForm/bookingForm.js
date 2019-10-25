var app = getApp();

var http = require('../../../utils/request.js');

Page({
  data: {
    imgUrl: app.globalData.imgurl, //图片域名
   
    isInput: false,  //输入框是否输入
    
    isshow: false,  //占位符

    page: 1,  //预约单列表 当前页
    pageSize:4, // 每页数量
    keyword:'',

    orders:[], //预约单列表

    type:0, // 0 正常跳转  1 预约成功后跳转

  }, 

  onLoad: function (option) {
    this.getData(); //获取第一页预约单数据
    
    this.setData({
      type:option.type?1:0,
      imgUrl: app.globalData.imgurl, //图片域名
    });
  },

  // 点击显示另外一个输入框
  showSearchTwo: function () {
    var that = this;
    that.setData({
      isInput: true
    })
  },


  //预约单接口
  getData:function(){

    var data={
      page:this.data.page,
      pageSize:this.data.pageSize,
      keyword:this.data.keyword
    };

    this.setData({
      page:data.page + 1
    });

    http.ordinary.call(this, 'order/list', data, this.dataToPage, 1);

  },
  //渲染数据
  dataToPage:function(data){
    if(!data){
      if(this.data.page == 2){
        this.setData({
          isshow:true,
        })
      };
      return;
    };

    //存在数据就隐藏
    this.setData({
      isshow: false,
    })
    

    this.setData({
      orders:this.data.orders.concat(data),
    });

  },
  //分页加载
  lower:function(){
    this.getData();
  },

  //取消预约
  cancel_order:function(e){
    var that = this
    var order_sn = e.target.dataset.order
    var index = e.target.dataset.index

    var data = {
      order_sn: order_sn,
      consult: 6,
    }

    
    wx.showModal({
      title: '温馨提示',
      content: '如果您关闭了预约，可能会影响客户到院咨询喔',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          http.ordinary.call(that, 'order/close', data, undefined, 1);

          var orders = that.data.orders
          orders[index].order_status = 2
          that.setData({
            orders: orders
          })
          
        } 
      }
    })

  },


  //清空输入框
  clearInput:function(){

    console.log(123)

    this.setData({
      keyword:"",
      isInput: false
    })
    //搜索
    this.setData({
      page: 1,
      orders: [],

    })
    this.getData();
  },
  //取消搜索
  returnInput: function () {
    var that = this;
    that.setData({
      isInput: false,
      keyword: "",
    })
  },

  //搜索
  search:function(){
    this.setData({
      page:1,
      orders:[],

    })
    this.getData();
  },

  //输入搜索词
  toInput:function(e){

    this.setData({
      keyword:e.detail.value
    })

  },

  //返回快速预约
  toOrder:function(){

    if(this.data.type == 1){
      wx.redirectTo({
        url: '../fast/fast',
      })
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
  },


  //跳转到详情页面
  toDetail:function(e){
    let order_id = e.currentTarget.dataset['id'];
    if (order_id == undefined) {
      wx.showToast({
        title: '未知的参数信息',
        icon: 'none',
        duration: 1000
      })
    }

    wx.navigateTo({
      url: '../bookingDetail/bookingDetail?order_id=' + order_id,
    })
  }

})