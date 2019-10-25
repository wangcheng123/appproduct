var app = getApp();

var http = require('../../../utils/request.js');
var util = require('../../../utils/util.js');

Page({
  data:{ 

    imgurl: app.globalData.imgurl, //图片域名

    //时间选择器
    date: '',             //日期                      
    start_time: util.formatTime(new Date()),        //日期选择器的开始值
    end_time: parseInt((util.formatTime(new Date())).substr(0, 4)) + 1 + "-" + parseInt((util.formatTime(new Date())).substr(5, 2)) + "-" + parseInt((util.formatTime(new Date())).substr(8, 2)) + "",

    //选择的预约类型
    order_types: ['首次咨询', '复诊', '签订合同', '进行医美项目', '其他'],  //预约类型列表
    order_type: 0,    //预约类型       

    //地区选择
    openAddr:[], //接口返回的所有省市区
    multiArray: [],  //当前可选的列
    address:[0,0],   //多列选择器两列的值
    addressStr:'', //选中后的地址

    //医院选择
    hospitals:[], //接口返回的医院信息
    hosRange:[], //医院可选择列表
    hospital:0,  //当前选中医院的key值
    hosStr:'',   //选中的医院名字
    hospital_id: 0, //当前选择的医院id

    //项目选择
    projects:[],  //接口返回的项目信息
    proRange:[],  //项目可选择列表
    project:0,    //当前选中的项目key值
    proStr:'',    //选中的项目名字
    project_id:0, //当前选中的项目id

    //toast的提示
    toast_msg: "错误提示",
    is_show_toast: false,
    isShowNoActive:false, // 没有选中
    isShowActive:false, // 选中
    isOther:false  // 是否是其他
  },

  onLoad: function (option) {
    //加载已开通地区选择
    this.getAddr();
  },
  onShow(e){
    // 判断有没有返回参数
    if (this.data.backData){
        /**
     * 
     * gradeOne
        gradeTwo.name
       gradeThree.name
     * 
     */
      this.setData({
        isShowNoActive: false,
        isShowActive: true,
        gradeOne: this.data.backData.gradeOne,
        gradeTwo: this.data.backData.gradeTwo,
        gradeThree: this.data.backData.gradeThree
      })
    }
  },

  //选择日期
  bindDateChange: function (e) {
    var that = this
    this.setData({
      date: e.detail.value
    })
  },
  //选择地址
  change_addr:function(e){

    var value = e.detail.value;

    var openAddr = this.data.openAddr;

    var province = openAddr[value[0]]['name'];
    
    var city = openAddr[value[0]]['children'][value[1]]['name'];

    var cityId = openAddr[value[0]]['children'][value[1]]['id'];

    this.setData({
      address : value,
      addressStr: province + " " + city,

      hospital_id:0,
      hosStr:'',
      hosRange:[],
      hospitals:[],


      proStr:'',
      project_id:0,
      projects: [], 
      proRange: [],

    })

    //根据城市id获取医院信息
    this.getHospitals(cityId);

  },
  //选择医院
  change_hos:function(e){

    if (this.data.hosRange.length == 0) {
      return;
    }

    var value = e.detail.value;

    var hospitals = this.data.hospitals;

    var cur_hospital = hospitals[value];

    if (cur_hospital['minapp_appoint'] == 1) {
      //如果该医院已经冻结
      console.log("医院冻结了");
      // wx.showToast({
      //   title: '<停止引流</view>',
      //   icon: 'none',
      //   duration: 2000,
      // })

      var that = this;
      that.setData({
        is_show_toast:true,
        toast_msg: "停止引流"
      })
      setTimeout(function () {
        that.setData({
          is_show_toast: false
        })
      }, 2000);

      return false;
    }

    var hosStr = hospitals[value]['name']

    var hospital_id = hospitals[value]['id']


    this.setData({
      hosStr: hosStr,
      hospital:value,
      hospital_id: hospital_id,

      proStr: '',
      project_id: 0,
      projects: [],
      proRange: [],
    })

    //获取可选择的项目
    this.getPro(hospital_id);

  },
  //选择项目
  change_pro:function(e){
    if (this.data.proRange.length == 0) {
      return;
    }
    this.setData({
      gradeOne: null,
      gradeTwo: null,
      gradeThree: null,
    })

    var value = e.detail.value;

    var projects = this.data.projects;

    var proStr = projects[value]['name']

    var project_id = projects[value]['id']

    //  这里进行判断 => 1.若选择其他 则显示项目带选择状态
    //  2.若选择其他项目 则请求接口 拿取信息并展示
    if (proStr.indexOf('其他')!= -1){
      console.log('选择其他');
      this.setData({
        isShowNoActive:true,
        isShowActive: false,
        isOther:true
      })
    }else{
      console.log('选择项目');
      // 发送请求拿数据并展示
      http.ordinary.call(this, 'getProjectCategory', { project_id}, res=>{
        this.setData({
          gradeOne:res[0],
          gradeTwo:res[1],
          gradeThree:res[2],
          isShowActive:true,
          isShowNoActive: false,
          isOther:false
        })
      }, 0)
    }

    this.setData({
      proStr: proStr,
      project: value,
      project_id: project_id,
    })
  },

  // 跳转分类详情
  gotoCateDetail(e){
    let isOther = this.data.isOther;
    if (!isOther){
      return;
    }
    let project_id = this.data.project_id;
    wx.navigateTo({
      url: '/pages/fast/fastCategory/fastCategory?project_id=' + project_id,
    })
  },
  //选择预约类型
  orderTypeChange: function (e) {
    var that = this
    that.setData({
      order_type: parseInt(e.detail.value) + 1
    })
  },

  //获取开通的省市区信息
  getAddr:function(){
    http.ordinary.call(this,'getCity', {}, this.addrToPage,0)
  },
  //省市区渲染到选择器上面
  addrToPage:function(data){

    if(!data){
      return;
    }

    var multiArray=[];

    var province=[];
    var city=[];

    for(var i in data){
      province.push(data[i]['name']);

      if(i == 0){
        var citys = data[i]['children']
        for (var j in citys) {
          city.push(citys[j]['name'])
        }
      }

    }

    this.setData({
      openAddr:data,
      multiArray: [province,city],
      address:[0,0]
    })


  },
  //省市区选择器数据切换  当省份发生变化时，切换可选择的市
  change_province:function(e){
    var detail = e.detail

    var openAddr = this.data.openAddr
    var multiArray = this.data.multiArray

    //省份发生变化
    if(detail.column == 0){

      var citys = openAddr[detail.value]['children']

      var city = [];

      for(var i in citys){
        city.push(citys[i]['name'])
      }

      multiArray[1]=city;

      this.setData({
        multiArray: multiArray,
      })
    }

  },

  //获取所在城市的医院数据
  getHospitals:function(cityId){
    http.ordinary.call(this, 'getHospital', { city: cityId }, this.hosToPage, 0)
  },
  //医院信息渲染到页面选择器上
  hosToPage:function(data){
    if(!data){
      return;
    }

    var hosRange = [];

    for(var i in data){
      hosRange.push(data[i]['name']);
    }

    this.setData({
      hosRange: hosRange,
      hospitals:data
    })

  },

  //获取项目
  getPro: function(hospital_id){
    http.ordinary.call(this, 'getProject', { hospital: hospital_id }, this.proToPage, 0)
  },
  //项目渲染到选择列表上
  proToPage:function(data){
    if(!data) return;
    var proRange = [];

    for(var i in data){
      proRange.push(data[i]['name']);
    }

    this.setData({
      proRange: proRange,
      projects:data,
    })


  },
  

  // 下一步验证
  nexthrefto: function () {
    //数据验证  预约时间 医院id 项目id 预约类型
    var data = this.data
    if (!data.date){
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if(!data.hospital_id){
      wx.showToast({
        title: '请选择预约医院',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if(!data.project_id){
      wx.showToast({
        title: '请选择预约项目',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if(!data.order_type){
      wx.showToast({
        title: '请选择预约类型',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    // 效验是否填写预约分类
    console.log(data.gradeOne, data.gradeTwo, data.gradeThree);
    if (!data.gradeOne || !data.gradeTwo || !data.gradeThree){
      wx.showToast({
        title: '请选择预约分类',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    //保存预约数据
    var order = {
      order_time:data.date,
      hospital_id:data.hospital_id,
      project_id: data.project_id,
      order_type: data.order_type,
      bc_id_array:[data.gradeOne.id,data.gradeTwo.id,data.gradeThree.id]
    }

    console.log(order)

    app.globalData.order = order

    //跳转到下一页继续预约
    wx.navigateTo({
      url: '../fastclient/fastclient',
    })
    
  }

})