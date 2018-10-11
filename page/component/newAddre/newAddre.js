var utilMd5 = require('../../../md5.js');
var app = getApp();
var index = 0;
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
    name:"请填写您的姓名",
    tel:"请填写您的联系方式",
    multiArray: [['北京市'], ['东城区', '西城区', '海淀区', '朝阳区', '丰台区', '门头沟区', '石景山区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '延庆区', '密云区']],
    multiIndex: [0, 0],
    door:"街道门牌信息",
    sourcePage:''
  },
  onLoad:function(options){
    this.setData({
      sourcePage: options.sourcePage
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
    let name = encodeURIComponent(value.name), phone=value.phone, province = indexs[0], city = indexs[1], addr = encodeURIComponent(value.city + value.door);
    if (name && phone && value.door) {
      wx.request({
        url: app.baseUrl + '/newaddr',
        data: {
          openid: app.openId,
          name: name,
          phone: phone,
          addr: addr,
          province: province,
          city: city,
          sign: utilMd5.hexMD5('newaddr?openid' + app.openId + 'name' + name + 'phone' + phone + 'addr' + addr + 'province' + province + 'city' + city + app.solt)
          },
        success: function (res) {
          if (res.data.error != 0) {
            app.validError(res.data.error);
          }
          wx.redirectTo({
            url: '/page/component/chooseAddre/chooseAddre'
          });        
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整的收货地址',
        showCancel: false
      })
    }
  }  
})