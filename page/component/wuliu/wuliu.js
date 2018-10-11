var utilMd5 = require('../../../md5.js');
var index = 0;
var li = [];
var app = getApp();
Page({
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '浪花鲜酿',
      path: '/page/component/category/category'
    }
  },
  data: {
    bagList:[],
  },
  onLoad: function (options) {
    var self = this;
    self.setData({
      sourcePage: options.sourcePage
    });
    //加载购物列表数据
    wx.request({
      url: app.baseUrl + '/getallredpack',
      data: {
        openid: app.openId,
        sign: utilMd5.hexMD5('getallredpack?openid' + app.openId + app.solt)
      },
      success: function (res) {
        self.setData({
          bagList: res.data.data
        });
      }
    })
  }
})