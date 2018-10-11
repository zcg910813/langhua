var utilMd5 = require('../../../md5.js');
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
  data:{
    goods: {},//商品对象
    productId: '',
    goodsMoney: 0,
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },
  onLoad: function (options) {
    this.setData({
      productId: options.id
    })
  },
  onShow:function(){
    this.down_xiangqing();
  },
  down_xiangqing: function () {
    var that = this;
    wx.request({
      url: app.baseUrl + '/goodsinfo',
      data:{
        goodsid: that.data.productId,
        sign: utilMd5.hexMD5('goodsinfo?goodsid' + that.data.productId + app.solt)
      },
      success: function (res) {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        if (res.data.data){
          that.setData({
            goods: res.data.data,
          });
          that.setData({
            goodsMoney: app.fen2Yuan(that.data.goods.Price),
          });
        }
      }
    })
  },
  addCount() {
    let num = this.data.num;
    if (num >= this.data.goods.num) {
      num--;
    }
    num++;
    this.setData({
      num : num
    })
  },
  subCount() {
    let num = this.data.num;
    if(num > 1){
      num--;
    }
    this.setData({
      num: num
    })
  },
  addToCart() {
    const self = this;
    const num = this.data.num;
    const productId = this.data.productId;
    let total = this.data.totalNum;
    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300),
    wx.request({
      url: app.baseUrl + '/addcart',
      data: {
        openid: app.openId,
        goodsid: productId,
        count: self.data.num,
        sign: utilMd5.hexMD5('addcart?openid' + app.openId + 'goodsid' + productId + 'count' + self.data.num + app.solt)
      },
      success: res => {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
      }
    }) 
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
})