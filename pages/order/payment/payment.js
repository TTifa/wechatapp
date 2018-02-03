const API = require('../../../utils/apiclient.js');
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

		API.Post('/api/wechat', {}, (resp) => {
			// 调用成功，得到成功的应答 data
			console.log(resp);
			// 发起支付
			wx.requestPayment({
				'timeStamp': resp.timeStamp,
				'nonceStr': resp.nonceStr,
				'package': resp.package,
				'signType': 'MD5',
				'paySign': resp.paySign,
				'success': function (res) {
					wx.showToast({
						title: '支付成功'
					});
					wx.navigateTo({
						url: '../list/list?status=1'
					});
				}
			})
		})
	}
})