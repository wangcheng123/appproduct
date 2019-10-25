const app = getApp();
const http = require('../../../../utils/request.js');
let myThis

Page({
  data: {
    imgurl: app.globalData.imgurl,
    project: {}
  },
  onLoad: function(options) {
    myThis = this
    let id = options.id
    myThis.getDetails(id)
  },
  onShow() {
    
  },
  getDetails: function(id) {
    let obj = {
      id: id,
    }
    http.ordinary.call(this, 'orderDetail', obj, this.dataToDeal, 1, true);
  },
  dataToDeal: function(data) {
    if (!data) return;
    let project = data
    project.goods_info.project_image = myThis.data.imgurl + project.goods_info.project_image
    myThis.setData({ project})
  },
})