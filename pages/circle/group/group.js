var app = getApp();
var http = require("../../../utils/request.js");

Page({
  data:{
    imgUrl: app.globalData.imgurl, //图片域名

    type: 0,            //查看下级 0 全部 1 一级 2 二级 3 其他
    
    stype:false,        //是否选择过下级类型
    sopen:false,        //类型列表是否打开

    ssort:false,        //是否点过排序  
    sort: 0,            //排序 0 业绩倒序 1 业绩正序 默认0

    isshow: false,       //列表和占位符切换 默认不显示

    page:1,
    pageSize:10,

    teamAchieve:0, //团队总业绩
    teams:[],      //团队列表

    redirect_type: app.globalData.server.redirect_type ? app.globalData.server.redirect_type : 0 ,


  },

  onLoad:function(){


    this.setData({
      redirect_type: app.globalData.server.redirect_type,
      imgUrl: app.globalData.imgurl
    })


    //this.getTeamAchieve();

    this.getTeam();
  },

  //打开 选择服务商等级 列表
  select_open:function(){
    this.setData({
      sopen: this.data.sopen ? false : true,
    })
  },
  //选择类型
  select_type:function(e){
    console.log(e) 

    var type = e.target.dataset.type

    this.setData({
      type:type,
      stype:true,
      sopen:this.data.sopen?false:true,
      page:1,
      teams:[],
    })

    this.getTeam();

  },
  //业绩排名
  select_sort:function(){
    this.setData({
      sort:this.data.sort==0?1:0,
      ssort:true,
      page: 1,
      teams: [],
    })

    this.getTeam();
  },

  //获取团队本月业绩
  getTeamAchieve:function(){
    if (this.data.redirect_type == 3){
      http.ordinary.call(this, 'mkq/team/achive', {}, this.teamAchieve, 1);
    }
    
  },
  teamAchieve:function(data){

    console.log(data)

    if(!data){
      return
    }
    
    this.setData({
      teamAchieve: data.team_achive,
    });
  },

  //获取我的团队列表
  getTeam:function(){
    var data = {
      page:this.data.page,
      pageSize:this.data.pageSize,
      sort:this.data.sort,
      type:this.data.type,
    }

    this.setData({
      page:data.page + 1
    })

    http.ordinary.call(this, 'myTeam', data, this.teamToPage, 1,true);
  },
  teamToPage:function(data){
    console.log(data)
    if(!data){
      if(this.data.page == 2){
        this.setData({
          isshow:true
        })
      }
      return;
    }

    this.setData({
      teams:this.data.teams.concat(data.list),
      isshow: false
    })
  },

  onReachBottom:function(){
    this.getTeam();
  },


})