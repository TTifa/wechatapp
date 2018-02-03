const API = require('../../../utils/apiclient.js')
Page({
	data: {
		addressObjects: []
	},
	add: function () {
		wx.navigateTo({
			url: '../add/add'
		});
	},
	onShow: function () {
		this.loadData();
	},
	setDefault: function (e) {
		// 设置为默认地址
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 遍历所有地址对象设为非默认
		var addressArray = that.data.addressObjects;
		addressArray[index].State = 1;
		var address = addressArray[index];
		API.Post('/api/address', address, (res) => {
			if (res.status == 1) {
				// 设置成功提示
				wx.showToast({
					title: '设置成功',
					icon: 'success',
					duration: 2000
				});
				that.setData({
					addressObjects: addressArray
				})
			}
		})
	},
	edit: function (e) {
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 取出id值
		var objectId = this.data.addressObjects[index].Id;
		wx.navigateTo({
			url: '../add/add?id=' + objectId
		});
	},
	delete: function (e) {
		var that = this;
		// 取得下标
		var index = parseInt(e.currentTarget.dataset.index);
		// 找到当前地址AVObject对象
		var address = that.data.addressObjects[index];
		// 给出确认提示框
		wx.showModal({
			title: '确认',
			content: '要删除这个地址吗？',
			success: function (res) {
				if (res.confirm) {
					// API.Post('/api/delete',{userId:1,addressId:address.Id},(e)=>{
					// })

					// 删除成功提示
					wx.showToast({
						title: '删除成功',
						icon: 'success',
						duration: 2000
					});
					// 重新加载数据
					that.loadData();

				}
			}
		})
	},
	loadData: function () {
		// 加载网络数据，获取地址列表
		var that = this;
		API.Get('/api/address', { userId: 1 }, (e) => {
			if (e.status == 1) {
				that.setData({
					addressObjects: e.data
				})
			}
		})
	}
})