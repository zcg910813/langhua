// page/component/shipping_address/shipping_address.js
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
  
  /**
   * 页面的初始数据
   */
  data: {
    dizhiList:null,
    Area:"",
    multiArray: [['北京市'], ['东城区', '西城区', '海淀区', '朝阳区', '丰台区', '门头沟区', '石景山区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '延庆区', '密云区']],
    multiIndex: [0, 0],
    door: "街道门牌信息",
    sourcePage: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sourcePage: options.sourcePage
    })
    let self = this;
    wx.getStorage({
      key: 'addressList',
      success: function (res) {
        let Area = res.data.RecvAddr.slice(7);
        let Chengqu = res.data.RecvAddr.slice(4,7)
        self.setData({
          dizhiList: res.data,
          Area: Area
        })
      }
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
  formSubmit(e) {
    const value = e.detail.value;
    var that = this;
    var indexs = that.data.multiIndex;
    console.log(indexs)
    let name = encodeURIComponent(value.name), phone = value.phone, province = indexs[0], city = indexs[1], addr = encodeURIComponent(value.city + value.door);
    if (name && phone && value.door) {
      wx.request({
        url: app.baseUrl + '/mvaddr',
        data: {
          openid: app.openId,
          id:that.data.dizhiList.Id,
          addr: addr,
          name: name,
          phone: phone,
          province: province,
          city: city,
          sign: utilMd5.hexMD5('mvaddr?openid' + app.openId + 'id' + that.data.dizhiList.Id+'addr' + addr + 'name' + name + 'phone' + phone   + 'province' + province + 'city' + city + app.solt)
        },
        success: function (res) {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          wx.navigateBack({     //返回上一页面或多级页面
            delta: 1
          })   
          // wx.redirectTo({
          //   url: '/page/component/addrList/addrList'
          // });    
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整的收货地址',
        showCancel: false
      })
    }
  } ,
  onReady: function () {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})