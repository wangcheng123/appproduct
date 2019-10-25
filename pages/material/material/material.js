var app = getApp();
var http = require('../../../utils/request.js');

Page({
  data: {

    imgUrl: app.globalData.imgurl, //图片域名

    pts:{},  //分类数据
    parent:1,  //当前父分类
    swiper_heigth:100,

    pData:[], //页面素材数据
    page:1,   //素材当前页
    isshow:false,
    
    isalert:false,  //自定义 定位授权窗 
    location: {'province_id':13,'name':'湖北省'}, //定位默认湖北省
    new_location: { 'province_id': 13, 'name': '湖北省' }, //定位默认湖北省
    
    //经纬度  默认总部地址
    postion: {
      latitude: 30.49984,
      longitude: 114.34253
    },

    top:0,

  },

  onLoad: function (options) {
    this.setData({
      imgUrl: app.globalData.imgurl, //图片域名
    })

    //分销主页跳转过来
    if (options.source) {
      this.setData({
        parent: 4,
      })
    }

    this.getlatitude(); // 获取经纬度 定位省份

    this.getTypes();  //获取分类

    this.getData();   //获取素材数据

  },

  onShow:function(){
    //如果值发生了改变
    if (this.data.new_location.province_id != this.data.location.province_id){

      this.setData({
        location: this.data.new_location,
        page:1,
        pData:[],
      })
      this.getData();   //获取素材数据
    }
  },

  // 获取经纬度
  getlatitude: function () {
    var that = this
    wx.showLoading({
      title: '正在获取定位,请稍后',
    })

    // 获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        // 获取省份
        that.getaddress();
      },
      fail(res) {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userLocation']) {
              that.setData({
                isalert: true,
              })
            }else{
              wx.showToast({
                title: '定位获取失败',
                icon: 'none',
                duration: 2000,
              })
            }
          }
        });

      }
    })

  },
  // 获取定位省份
  getaddress: function () {

    var data = this.data.postion

    http.ordinary.call(this, 'loction/get', data, this.getposok, 1);

  },

  //成功定位
  getposok:function(data){

    this.setData({
      location:data,
      page: 1,
      pData: [],
    })

    this.getData();

  },

  //取消定位授权
  cancel: function () {
    this.setData({
      isalert: false
    });

  },

  // 再次调用定位
  handler: function (e) {
    console.log(e)

    var pos_auth = e.detail.authSetting['scope.userLocation']

    //未授权过  或者 已拒绝授权
    if (!pos_auth){
      this.setData({
        isalert:true,
      })
      return;
    }

    //统一授权 定位
    this.getlatitude();
  },

  //获取分类列表
  getTypes:function(){
    http.ordinary.call(this, 'material/type', {}, this.typeToPage, 1);
  },
  //分类页获取数据
  typeToPage:function(data){
    this.setData({
      pts:data,
    });

    this.setHeight(this.data.parent)

  },

  //监听到滑动 
  pchange:function(e){
  
    var parent = e.detail.current + 1;

    this.pset(parent);

  },
  //点击 父分类切换
  pchange2:function(e){
    console.log(e)

    this.setData({
      parent: e.target.dataset.id,
    })
  },
  pset:function(parent){
    this.setData({
      page: 1,
      pData: [],
      parent:parent,
      top:0,
    })
    this.setHeight(parent);
    this.getData();
  },

  //设置轮播的高度
  setHeight:function(parent){
    var len = this.data.pts.types[parent].length

    var i = Math.ceil(len / 4);
    this.setData({
      swiper_heigth: 150 * i + 40,
    });
  },

  //获取列表推荐数据
  getData:function(){

    var data = {
      province_id: this.data.location.province_id,
      page:this.data.page,
      pageSize:6,
      parent: this.data.parent,
    }

    this.setData({
      page:data.page + 1,
    })

    http.ordinary.call(this, 'material', data, this.dataToPage, 1);

  },

  //数据渲染到页面上
  dataToPage:function(data){
    if (!data) {
      if (this.data.page == 2) {
        this.setData({
          isshow: true,
        })
      }
      return;
    }

    var pData= data.data

    this.setData({
      pData: this.data.pData.concat(pData)
    })

  },

  //素材搜索
  getval:function(e){
  
    var keyword = e.detail.value;

    console.log("跳转搜索");

    this.setData({
      keyword:'',
    })

    if (keyword) {
      wx.navigateTo({
        url: '../material_search/material_search?keyword=' + keyword + "&province_id="+this.data.location.province_id,
      })
    }
    
  },

  //跳转详情
  todetails:function(e){
    var that = this
    var mid = e.currentTarget.dataset.id
    var classs = e.currentTarget.dataset.class

    wx.navigateTo({
      url: '../material_del/material_del?mid=' + mid + '&class=' + classs + '&page=' + that.data.page,
    })
  },

  //跳转单个素材列表
  goMaterialList:function(e){
    
    var that = this
    var ids = e.currentTarget.dataset.id
    var title = e.currentTarget.dataset.title

    if (ids) {
      wx.navigateTo({
        url: '../material_list/material_list?type=' + ids +"&title=" + title + "&province_id="+that.data.location.province_id,
      })
    }
  },

  //触底加载更多
  onReachBottom:function(){
    this.getData()
  },
 
})