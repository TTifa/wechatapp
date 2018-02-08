const API = require('../../../utils/apiclient.js');
var app = getApp()
Page({
	data: {
		orderId: ''
	},
	onLoad: function (options) {
		var orderId = options.orderId;
		var totalFee = options.totalFee;
		this.setData({
			orderId: orderId,
			totalFee: totalFee
		})
		console.log(options);
	},
	pay: function () {
		var that = this;
		var paramsJson = {
			body: 'kimo',
			tradeNo: that.data.orderId,
			totalFee: parseFloat(that.data.totalFee) * 100
		}

		API.Post('/api/wxopen/paysign', {
			id: app.globalData.waId
		}, (resp) => {
			// 调用成功，得到成功的应答 data
			if (resp.status != 1)
				return;

			// 发起支付
			wx.requestPayment({
				timeStamp: resp.data.timeStamp,
				nonceStr: resp.data.nonceStr,
				package: resp.data.package,
				signType: 'MD5',
				paySign: resp.data.paySign,
				success: function (res) {
					wx.showToast({
						title: '支付成功'
					});
					wx.navigateTo({
						url: '../list/list?status=1'
					});
				},
				error: function (e) {
					console.log(e);
				}
			})
		})
	}
})