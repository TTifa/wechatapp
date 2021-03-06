const API = require('../../../utils/apiclient.js')
var app = getApp()
Page({
	data: {
		userInfo: {}
	},
	navigateToAddress: function () {
		wx.navigateTo({
			url: '../../address/list/list'
		});
	},
	navigateToLog: function () {
		wx.navigateTo({
			url: '../../logs/logs'
		});
	},
	navigateToOrder: function (e) {
		var status = e.currentTarget.dataset.status
		wx.navigateTo({
			url: '../../order/list/list?status=' + status
		});
	},
	signOut: function () {
		wx.showToast({
			title: '退出成功'
		});
		app.globalData.userInfo = null;
		this.setData({
			userInfo: null
		});
	},
	signIn: function () {
		wx.getUserInfo({
			success: res => {
				wx.showToast({
					title: '退出成功'
				});
				app.globalData.userInfo = res.userInfo
				this.setData({
					userInfo: res.userInfo,
				})
			}
		})
	},
	onShow: function () {
		this.loadUser();
	},
	loadUser: function () {
		var that = this;
		var user = app.globalData.userInfo;
		that.setData({
			userInfo: user
		});
		/*
		// 获得当前登录用户

		// 调用小程序 API，得到用户信息
		wx.getUserInfo({
			success: ({userInfo}) => {
				// 更新当前用户的信息，昵称头像等
                user.set(userInfo).save().then(user => {
			    	// 成功，此时可在控制台中看到更新后的用户信息
					that.setData({
						userInfo: userInfo
					});
			    }).catch(console.error);
			}
		});
		*/
	},
	chooseImage: function () {
		var that = this;
		this.download();
		return;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				var tempFilePath = res.tempFilePaths[0];
				wx.uploadFile({
					url: `${API.Host}/api/File/Upload2Qiniu`,
					filePath: tempFilePath,
					name: 'file',
					success: function (res) {
						console.log(res.data);
					}
				})
			}
		})
	},
	download: function () {
		var url = 'http://owrlb7i7j.bkt.clouddn.com/04dc2c41ba99447296e64457617d799c.png';
		wx.downloadFile({
			url: url,
			success: function (res) {
				console.log(res.tempFilePath);
				if (res.statusCode === 200) {
					wx.saveFile({
						tempFilePath: res.tempFilePath,
						success: (result) => {
							console.log(result.savedFilePath);
						}
					})
				}
			}
		})
	},
	navigateToAboutus: function () {
		wx.navigateTo({
			url: '/pages/member/aboutus/aboutus'
		});
	},
	navigateToDonate: function () {
		wx.navigateTo({
			url: '/pages/member/donate/donate'
		});
	},
	navigateToMap: function () {
		wx.navigateTo({
			url: '/pages/address/map/map'
		});
	},
	navigateToShare: function () {
		wx.navigateTo({
			url: '/pages/member/share/share?uid=1'
		});
	},
	navigateToRegister: function () {
		wx.navigateTo({
			url: '/pages/member/register/register'
		});
	},
	navigateToIcon: function () {
		wx.navigateTo({
			url: '/pages/component/icon/icon'
		});
	}
})