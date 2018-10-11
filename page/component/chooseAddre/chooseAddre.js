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
    list: li,
    addressList: [],
    selectIndex: 0,
    defaultAddress: '',
    sourcePage: ''
  },
  /*新增收获地址*/
  addAddre: function (e) {
    wx.redirectTo({
      url: '../newAddre/newAddre'
    })
  },
  /*修改收获地址*/

  rmvaddr: function (e) {
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    const that = this;
    wx.request({
      url: app.baseUrl + '/rmvaddr',
      data: {
        openid: app.openId,
        id: id,
        sign: utilMd5.hexMD5('rmvaddr?openid' + app.openId + 'id' + id + app.solt)
      },
      success: res => {
        let addrs = that.data.addressList;
        addrs.splice(index, 1);
        that.setData({
          addressList: addrs
        });
        wx.getStorage({
          key: 'address',
          success(res) {
            that.setData({
              defaultAddress: res.data,
            });
            if (that.data.defaultAddress.id == id) {
              wx.removeStorage({
                key: 'address'
              });
              that.setData({
                selectIndex: 0
              });
            }
          }
        })
      }
    })
  },
  toCleanOrder: function (e) {
    let selectIndex = this.data.selectIndex
    this.setData({
      selectIndex: !selectIndex
    })
    var self = this;
    for (var i = 0; i < this.data.list.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        li[e.currentTarget.dataset.index].image = "../../image/check.jpg"
      } else {
        li[i].image = "../../image/uncheck.png"
      }
    }
    var value = {
      name: e.currentTarget.dataset.name,
      phone: e.currentTarget.dataset.phone,
      addr: e.currentTarget.dataset.addr,
      id: e.currentTarget.dataset.id
    };
    wx.setStorage({
      key: 'user_address',
      data: value,
      success() {
        wx.navigateBack({
          url: self.data.sourcePage
        })
      }
    })
  },
  redact: function (e) {
    let addressID = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    var page = getCurrentPages();
    var num = page.length;
    wx.setStorage({
      key: 'addressList',
      data: this.data.addressList[index],
      success() {
        wx.navigateTo({
          url: '/page/component/shipping_address/shipping_address',
        });
      }
    })

  },
  setList: function () {
    var self = this;
    wx.request({
      url: app.baseUrl + '/addrlist',
      data: {
        openid: app.openId,
        sign: utilMd5.hexMD5('addrlist?openid' + app.openId + app.solt)
      },
      success: function (res) {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        self.setData({
          addressList: res.data.data
        });
      }
    })
  },
  onShow: function () {
    this.setList();
  },
  onLoad: function (options) {
    var self = this;
    self.setData({
      sourcePage: options.sourcePage
    });
    //加载购物列表数据
    wx.request({
      url: app.baseUrl + '/addrlist',
      data: {
        openid: app.openId,
        sign: utilMd5.hexMD5('addrlist?openid' + app.openId + app.solt)
      },
      success: function (res) {
        if (res.data.error != 0) {
          app.validError(res.data.error);
        }
        self.setData({
          addressList: res.data.data
        });
        // wx.getStorage({
        // key: 'address',
        // success(res) {
        // self.setData({
        // selectIndex: res.data.id
        // })
        // }
        // })
      }
    })
  }
})