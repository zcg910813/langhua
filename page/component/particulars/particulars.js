// page/component/particulars/particulars.js
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
    imgurl:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    if(self.options.id == 1){
      self.setData({
        imgurl: "https://mp.wavehops.com/goodsimg/huang.jpg"
      })
    }
    if(self.options.id == 2){
      self.setData({
        imgurl: "https://mp.wavehops.com/goodsimg/bai.jpg"
      })
    }
    if (self.options.id == 3) {
      self.setData({
        imgurl: "https://mp.wavehops.com/goodsimg/hei.jpg"
      })
    }
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