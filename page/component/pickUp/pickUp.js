// page/component/pickUp/pickUp.js
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
    pickUp:[],
    pickUp_a :[], //遍历所有商店
    pickdonw_a:[],
    show_pick : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    var pick_down = [];
    var self = this;

    wx.getStorage({
      key: 'pickUp',
      success: function(res) {
        self.setData({
          pickUp: res.data
        }) 
        for (var i  in self.data.pickUp) {
          pick_down.push(self.data.pickUp[i])         
        }
        self.setData({
          pickdonw_a: pick_down
        })
      },  
    })
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      });
  },
  pickUp:function(e){
    // console.log(e);
    var item = e.currentTarget.dataset.location;
    // wx.setStorageSync('location',location)
    wx.setStorage({
      key: 'key',
      data: item
    })
    var index = e.target.dataset.index;
    wx.navigateBack({
      // 返回的页面数
      data: 1
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
  onShow: function () {
  
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