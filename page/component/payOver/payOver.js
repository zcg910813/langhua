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
  data: {
    message:'',
    showMask: false,//是否显示涂层
    showHBModal: false,//是否显示红包层
    showKBModal: false,//是否显示开包层
    money: 0,//抽奖金额
    redpackid: 0//红包Id
  },
  showDialogBtn: function () {
    this.setData({
      showHBModal: true,
      showMask: true,
    })
  },
  choujiang: function () {
    // this.setData({
    //   showKBModal:true,
    //   showHBModal:false,
    //   money:2.0
    // });
    var that = this;
    wx.request({
      url: app.baseUrl + '/choujiang',
      data: {
        openid: app.openId,
        redpackid: that.data.redpackid,
        sign: utilMd5.hexMD5('choujiang?openid' + app.openId + 'redpackid' + that.data.redpackid + app.solt)
      },
      success:res=>{
        that.setData({
          showKBModal: true,
          showHBModal: false,
          money: app.fen2Yuan(res.data.data.add_jifen)
        });
        //console.log(that.data.money);
      }
    })
  },
  onConfirm: function (e) {
    this.hideModal();
  }, 
  hideModal:function(){
    this.setData({
      showHBModal: false,
      showMask: false,
      showKBModal:false
    })
  },
  gobuy:function(){
    wx.redirectTo({
      url: '/page/component/category/category',
    })
  },
  // gouser: function () {
  //   wx.redirectTo({
  //     url: '/page/component/user/user',
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      redpackid: options.redpackid
    });
    let hongbao_show = JSON.parse(sessionStorage.getItem('showMask')) || '';
    if (hongbao_show) {
      this.showMask = false;
    }
  },
  lookOrder :function(){
    wx.navigateTo({
      url: '/page/component/order_form/order_form?skip_d=1',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var  message = '恭喜您支付成功！';
    this.setData({
      message: message
    });
    this.showDialogBtn();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function () {
  //   wx.switchTab({
  //     url: '/page/component/category/category',
  //   })
  // },

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