const app = getApp();
var http = require("../../../utils/request.js");
let myThis
Page({
  data: {
    currentTabsIndex: 0,
    index: 0,
    resultsType: {}
  },
  onLoad: function(options) {
    myThis = this
  },
  onShow() {
    myThis.getResults()
  },
  // 点击切换Tab
  onTabs: function(e) {
    let status
    let currentTabsIndex = e.currentTarget.dataset.index
    myThis.setData({
      currentTabsIndex,
      index: currentTabsIndex
    })
    myThis.getResults()
  },
  //查看明细
  resultsInfor() {
    wx.navigateTo({
      url: '/pages/main/results/information/information?currentTabsIndex=' + this.data.currentTabsIndex,
    })
  },
  //获取业绩列表
  getResults() {
    http.ordinary.call(this, 'yjIndex', {}, this.teamToPage, 1, true);
  },
  teamToPage(data) {
    if (!data) {
      return
    }
    let currentTabsIndex = myThis.data.currentTabsIndex
    if (currentTabsIndex == 0) {
      myThis.setData({
        resultsType: data.plus
      })
    } else if (currentTabsIndex == 1) {
      myThis.setData({
        resultsType: data.service
      })
    } else if (currentTabsIndex == 2) {
      myThis.setData({
        resultsType: data.project
      })
    } else {
      myThis.setData({
        resultsType: data.fx
      })
    }
  }

})