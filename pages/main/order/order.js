const app = getApp();
const http = require('../../../utils/request.js');
let myThis

Page({
  data: {
    imgurl: app.globalData.imgurl,
    page: 1,
    num: 3,
    currentTabsIndex: 0,
    project: [],
    isLastPage: false,
    tips: '上拉加载更多',
    index:0,
  },
  onLoad: function(options) {
    myThis = this
  },
  onShow() {
    let status
    if (myThis.data.currentTabsIndex == 0) {
      status = 0
    } else if (myThis.data.currentTabsIndex == 1) {
      status = 2
    } else if (myThis.data.currentTabsIndex == 2) {
      status = 6
    }
    myThis.setData({
      project: [],
      page:1
    })
    
    myThis.getList(status, myThis.data.page)
  },

  // 点击切换Tab
  onTabs: function(e) {
    let status
    let currentTabsIndex = e.currentTarget.dataset.index
    if (currentTabsIndex == 0) {
      status = 0
    } else if (currentTabsIndex == 1) {
      status = 2
    } else if (currentTabsIndex == 2) {
      status = 6
    }
    let page = 1
    myThis.setData({
      currentTabsIndex,
      index: currentTabsIndex,
      project: [],
      isLastPage: false,
      page
    })
    myThis.getList(status, page)
  },
  onReachBottom: function() {
    // 最后一页了，取消下拉功能
    if (myThis.data.isLastPage) {
      return
    }
    let status
    if (myThis.data.currentTabsIndex == 0) {
      status = 0
    } else if (myThis.data.currentTabsIndex == 1) {
      status = 2
    } else if (myThis.data.currentTabsIndex == 2) {
      status = 6
    }
    let page = myThis.data.page + 1
    myThis.setData({
      page
    })
    myThis.getList(status, page)
  },
  getList: function(status, page) {
    let obj = {
      order_status: status,
      page: page,
      pageSize: this.data.num
    }
    http.ordinary.call(this, 'orderIndex', obj, this.dataToDeal, 1, true);
  },
  dataToDeal: function(data) {
    if (!data) return;
    let project = data
    if (project.length>0) {
      //item.order_status==2'color:#FF383E':''
      project.forEach(item=>{
        if (item.order_status==2){
          item.color = '#FF383E'
        }
      })
      if (project.length < myThis.data.num) {
        // 没有数据了，已经是最后一页

        myThis.setData({
          isLastPage: true,
          tips: "已显示全部啦"
        })
      }
    }
    // 追加数据
    let projectList = myThis.data.project.concat(project)
    myThis.setData({ project: projectList})
  },
  //查看详情
  goDetails(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/main/order/orderDetails/orderDetails?id=` + id,
    })
  }
})