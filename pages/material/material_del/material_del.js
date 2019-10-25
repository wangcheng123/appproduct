var app = getApp();
var http = require('../../../utils/request.js');

Page({
  data: {
    mid: '', // 素材id
    mtype: 1, // 素材类型 1图片素材 2视频素材
    material_url: '', //素材路径

    imgUrl: app.globalData.imgurl,  // 图片域名

    isalert: false, // 授权弹框
    filePath: '', // 图片或视频保存文件

    ispage: '', 

    contents: ''
  },
  onLoad: function (options) {
    console.log(options)
    var that = this

    if (options.mid && options.class) {
      that.setData({
        mid: options.mid,
        mtype: options.class,
      })

    } else {
      wx.showToast({
        title: '未获取素材类型',
        icon: 'none',
        duration: 2000,
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 500)

      return;
    }

    // 获取素材数据
    that.getdetdata();
  },

  // 授权弹框隐藏
  hidealert: function (e) {
    var that = this
    console.log(e)
    that.setData({
      isalert: false,
    })

  },

  // 授权弹框是否确定
  handleSetting: function (e) {
    console.log(e)
    var that = this
    var mtype = that.data.mtype
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      if (mtype == 1) {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.filePath,
          success: function (data) {
            console.log(data)
            wx.showToast({
              title: '下载成功，已保存至相册',
              icon: 'none',
              duration: 2000
            })
          },
        })
      } else if (mtype == 2) {
        wx.saveVideoToPhotosAlbum({
          filePath: that.data.filePath,
          success: function (data) {
            console.log(data)
            wx.showToast({
              title: '下载成功，已保存至相册',
              icon: 'none',
              duration: 2000
            })
          },
        })
      }

    } else {
      wx.showToast({
        title: '下载失败',
        icon: 'none',
        duration: 2000
      })
    }


  },

  // 下载素材授权
  down: function (material_url) {

    var that = this

    var material_url = that.data.material_url

    wx.getSetting({
      success: function (res) {
        //如果第一次授权
        if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          //未授权
          wx.authorize({
            scope: "scope.writePhotosAlbum",
            success(res) {
              //授权成功
              that.setData({
                isalert: false,
              });
              that.downfile(material_url);
            },
            fail(res) {
              return;
            }


          })
          return;

        }


        //如果拒绝过授权  则再次调起授权
        if (res.authSetting['scope.writePhotosAlbum'] === false) {
          that.setData({
            isalert: true,
          });
          return;
        }

        if (that.data.isalert) {
          that.setData({
            isalert: false,
          });
        }

        that.downfile(material_url);

      },

    });

  },

  //下载素材
  downfile: function (file) {
    var that = this
    wx.showLoading({
      title: '正在下载...',
      mask: true,
    })

    wx.downloadFile({
      url: file,
      success(res) {
        if (that.data.mtype == 2) {
          //如果是视频
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.showToast({
                title: '素材已保存至相册',
                icon: 'success',
                duration: 2000
              })
            },
            fail: function (err) {

              wx.showToast({
                title: '下载失败...',
                icon: 'none',
                duration: 2000
              })

            },
            complete(res) {
              console.log(res);
            }
          })
        } else {
          //默认是图片
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function (data) {
              wx.showToast({
                title: '素材已保存至相册',
                icon: 'success',
                duration: 2000
              })
            },
            fail: function (err) {

              wx.showToast({
                title: '下载失败...',
                icon: 'none',
                duration: 2000
              })

            },
            complete(res) {
              console.log(res);
            }
          })
        }



        wx.hideLoading()

      },
      fail(res) {
        wx.showToast({
          title: '下载失败',
          icon: 'none',
        })

        wx.hideLoading()
      },

    })
  },

  // 获取素材详情数据
  getdetdata: function () {
    var that = this

    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    var data = {
      id: that.data.mid
    }

    http.ordinary.call(this, 'material/one', data, this.dataToPage, 1);
   
  },

  dataToPage:function(data){

    console.log(data)

    this.setData({
      material_url: data.url,
      contents: data.share_desc
    })
  },


  copyText: function (e) {
    console.log(e)
    let content = e.currentTarget.dataset.text;

    if (content == "") {
      wx.showToast({
        title: '暂无可复制的文案',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return false;
    }

    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },


})