var app = getApp();
var http = require('../../../utils/request.js');

Page({
  data: {
    typetab: [
      { name: '服务建议', ischeck: false, type: 1 },
      { name: '问题投诉', ischeck: false, type: 2 },
      { name: '系统反馈', ischeck: false, type: 3 },
      { name: '其他', ischeck: false, type: 4 },
    ], // 意见反馈数组

    imgarr: [], // 图片数组
    imgurls: app.globalData.imgurl,  // 图片域名
    btnisshow: true,  // 添加图片按钮显示与隐藏

    tabtype: '',  // 反馈类型
    tareaval: '',  // 描述内容
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      imgarr: [],
      imgurls: app.globalData.imgurl,  // 图片域名
    })
  },

  // 描述内容
  getval: function (e) {
    var that = this
    that.setData({
      tareaval: e.detail.value
    })
  },

  // 类型选择
  choosetype: function (e) {
    var that = this
    // 获取点击类型
    var tabtype = e.currentTarget.dataset.type
    // 获取点击索引
    var tabindex = e.currentTarget.dataset.sid
    // 获取反馈类型数组
    var tabarr = that.data.typetab
    // 移除所有选中状态
    for (var i in tabarr) {
      tabarr[i].ischeck = false
    }
    // 当前点击选中
    tabarr[tabindex].ischeck = true

    that.setData({
      typetab: tabarr,
      tabtype: tabtype
    })
  },

  // 删除图片
  deleteimg: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var arrs = that.data.imgarr
    arrs.splice(index, 1);
    that.setData({
      imgarr: arrs,
      btnisshow: true,
    })
  },

  // 上传图片
  addimg: function () {
    var that = this
    let imgarr = that.data.imgarr;
    if (imgarr.length == 3) {
      wx.showToast({
        title: '图片最多只能上传三张',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // that.setData({
        //   imgarr: []
        // })
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        for (var i in tempFilePaths) {
          that.uploadimg(tempFilePaths[i])
        }
        if (tempFilePaths.length == 3) {
          that.setData({
            btnisshow: false,
          })
        }
      },
      fail(res) {
        // wx.showToast({
        //   title: '图片上传失败',
        //   icon: 'none',
        //   duration: 2000,
        // })
      }
    })
  },

  // 上传图片方法
  uploadimg: function (file) {
    var that = this
    wx.showLoading({
      title: '图片上传中..',
    })
    wx.uploadFile({
      url: 'https://act.ameimeika.com/api/upload/img',
      filePath: file,
      name: 'file',
      formData: {
        'dirPath': 'service'
      },
      success(res) {
        wx.hideLoading();
        var data = JSON.parse(res.data)
        //do something
        console.log(data)
        var imgurl = data.data.url
        that.setData({
          imgarr: that.data.imgarr.concat(imgurl),
        })
        console.log(that.data.imgarr)

        let imgarr = that.data.imgarr;
        if (imgarr.length == 3) {
          that.setData({
            btnisshow: false,
          })
        }
      },
      fail(res) {
        console.log(res, 'wx.uploadFile方法失败')
        wx.showToast({
          title: '图片上传失败',
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },

  // 提交意见
  submitdata: function () {
    var that = this
    var imgarrs = that.data.imgarr.join(",")

    if (!that.data.tabtype) {
      wx.showToast({
        title: '请选择反馈类型',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    if (!that.data.tareaval) {
      wx.showToast({
        title: '请输入描述',
        icon: 'none',
        duration: 2000,
      })
      return;
    } else if (that.data.tareaval.length < 15) {
      wx.showToast({
        title: '描述不能少于15字',
        icon: 'none',
        duration: 2000,
      })
      return;
    }

    var data = {
      type: that.data.tabtype,
      content: that.data.tareaval,
      pic: imgarrs,
    }

    http.ordinary.call(this, 'question/feedback', data, this.afterSub, 1);
    
  },

  //数据提交成功后的操作
  afterSub:function(data){
    
    wx.showToast({
      title: '提交成功',
      icon: 'none',
      duration: 1000,
      mask:true,
    })

    setTimeout(function () {
      wx.navigateBack({
        delta: 2,
      })
    }, 1000)

  },

})