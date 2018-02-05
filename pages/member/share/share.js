const API = require('../../../utils/apiclient.js')
Page({
	data: {
		QRCodeUrl: '',
		uid: 0
	},
	onLoad: function (options) {
		this.setData({
			uid: options.uid
		});
		this.getQRCode(options.uid);
	},
	getQRCode: function (uid) {
		var that = this;
		API.Post('/api/wechats/qrcode', {
			id: 1,
			type: 0,
			scene: uid
		}, (res) => {
			console.log(res);
			if (res.status == 1) {
				that.setData({
					QRCodeUrl: res.data
				})
			}
		})
	},
	refreshQRCode: function () {
		this.getQRCode(this.data.uid);
	}
});