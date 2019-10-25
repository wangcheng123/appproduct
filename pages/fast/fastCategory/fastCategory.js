// pages/fast/fastCategory/fastCategory.js
var app = getApp();

var http = require('../../../utils/request.js');
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentId: -1,
    currentGname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let project_id = options.project_id;
    // 测试数据
    let arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push(`哈哈哈${i}`)
    }
    let arr2 = [];
    for (let i = 0; i < 8; i++) {
      arr2.push(i);
    }
    this.setData({
      someData: arr,
      arr2
    })
    //  测试数据结束
    http.ordinary.call(this, 'getProjectCategoryTree', {}, res => {
      console.log(res);
      let someData = res.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      });
      let firstList = res[0].children;
      this.setData({
        someData,
        allData: res,
        currentId: someData[0].id,
        currentGname: someData[0].name,
        firstList
      })
      //  
    }, 0)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 点击一级分类 展示二级,三级分类
  chioseCategory(e) {
    console.log(e);
    let oneScaleId = e.currentTarget.dataset.id;
    let allData = this.data.allData;
    // 循环展示
    let firstList = []
    let currentGname = ''
    allData.map(item => {
      if (item.id == oneScaleId) {
        firstList = item.children
        currentGname = item.name
      }
    })
    this.setData({
      firstList,
      currentId: oneScaleId,
      currentGname
    })
  },
  // 点击三级分类 拿到数据搞事情
  getItemData(e) {
    console.log(e);
    let gid = this.data.currentId;
    let gname = this.data.currentGname;
    let pid = e.currentTarget.dataset.pid;
    let pname = e.currentTarget.dataset.pname;
    let cid = e.currentTarget.dataset.cid;
    let cname = e.currentTarget.dataset.cname;
    console.log(gid, gname, pid, pname, cid, cname);
    let obj = {
      gradeOne:{
        name: gname,
        id: gid
      },
      gradeTwo:{
        name : pname,
        id:pid
      },
      gradeThree:{
        name: cname,
        id: cid
      }
    }
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      backData: obj
    })
    wx.navigateBack({
      delta:1,
    })
  }
})