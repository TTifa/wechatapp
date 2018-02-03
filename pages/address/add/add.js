var API = require('../../../utils/apiclient.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
	isDefault: false,
	data: {
		current: 0,
		province: [],
		city: [],
		region: [],
		town: [],
		provinceObjects: [],
		cityObjects: [],
		regionObjects: [],
		townObjects: [],
		areaSelectedStr: '请选择省市区',
		areaCode: '',
		maskVisual: 'hidden',
		provinceName: '请选择'
	},
	formSubmit: function (e) {
		// user 
		var user = 1;
		// detail
		var detail = e.detail.value.detail;
		// realname
		var realname = e.detail.value.realname;
		// mobile
		var mobile = e.detail.value.mobile;
		// 表单验证
		if (this.data.areaSelectedStr == '请选择省市区') {
			wx.showToast({
				title: '请输入区域'
			});
			return;
		}
		if (detail == '') {
			wx.showToast({
				title: '请填写详情地址'
			});
			return;
		}
		if (realname == '') {
			wx.showToast({
				title: '请填写收件人'
			});
			return;
		}
		if (!(/^1[34578]\d{9}$/.test(mobile))) {
			wx.showToast({
				title: '请填写正确手机号码'
			});
			return;
		}
		// save address to leanCloud
		var address = new Object;
		// 如果是编辑地址而不是新增
		if (this.data.address != undefined) {
			address = this.data.address;
		}

		// set province city region
		address.province = this.data.province[this.data.provinceIndex];
		address.city = this.data.city[this.data.cityIndex];
		address.region = this.data.region[this.data.regionIndex];
		address.town = this.data.town[this.data.townIndex];

		// if isDefault address
		address.State = this.isDefault ? 1 : 0;
		address.Detail = detail;
		address.UserId = user;
		address.Contact = realname;
		address.Telphone = mobile;
		address.AreaCode = this.data.areaCode;
		address.AreaText = `${address.province}-${address.city}-${address.region}`
		var that = this;

		console.log(JSON.stringify(address));
		//保存地址
		API.Post('/api/address', address, (e) => {
			console.log(e);
			wx.showToast({
				title: '保存成功',
				duration: 500
			});
			// 等待半秒，toast消失后返回上一页
			setTimeout(function () {
				wx.navigateBack();
			}, 500);
		})
	},
	getArea: function (pid, cb) {
		var that = this;
		// query area by pid

		API.Get('/api/address/area', { pid: pid }, (res) => {
			if (res.status == 1)
				cb(res.data);
		})
	},
	onLoad: function (options) {
		// 实例化API核心类
		qqmapsdk = new QQMapWX({
			key: 'BJFBZ-ZFTHW-Y2HRO-RL2UZ-M6EC3-GMF4U'
		});
		var that = this;
		// load province
		this.getArea(0, function (area) {
			var array = [];
			for (var i = 0; i < area.length; i++) {
				array[i] = area[i].Name;
			}
			that.setData({
				province: array,
				provinceObjects: area
			});
		});
		// if isDefault, address is empty
		this.setDefault();
		// this.cascadePopup();
		this.loadAddress(options);
		// TODO:load default city...
	},
	loadAddress: function (options) {
		var that = this;
		if (options.id != undefined) {
			API.Get('/api/address/id', { userId: 1, id: options.id }, (res) => {
				if (res.status == 1) {
					var address = res.data;
					that.setData({
						address: address,
						areaSelectedStr: address.AreaText
					});
				}
			})
		}
	},
	setDefault: function () {
		var that = this;
		var user = 1;
		// if user has no address, set the address for default

	},
	cascadePopup: function () {
		var animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'ease-in-out',
		});
		this.animation = animation;
		animation.translateY(-285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'show'
		});
	},
	cascadeDismiss: function () {
		this.animation.translateY(285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'hidden'
		});
	},
	provinceTapped: function (e) {
		// 标识当前点击省份，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		// current为1，使得页面向左滑动一页至市级列表
		// provinceIndex是市区数据的标识
		this.setData({
			provinceName: this.data.province[index],
			regionName: '',
			townName: '',
			provinceIndex: index,
			cityIndex: -1,
			regionIndex: -1,
			townIndex: -1,
			region: [],
			town: []
		});
		var that = this;
		//provinceObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
		// getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
		this.getArea(this.data.provinceObjects[index].Id, function (area) {
			var array = [];
			for (var i = 0; i < area.length; i++) {
				array[i] = area[i].Name;
			}
			// city就是wxml中渲染要用到的城市数据，cityObjects是LeanCloud对象，用于县级标识取值
			that.setData({
				cityName: '请选择',
				city: array,
				cityObjects: area
			});
			// 确保生成了数组数据再移动swiper
			that.setData({
				current: 1
			});
		});
	},
	cityTapped: function (e) {
		// 标识当前点击县级，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		// current为1，使得页面向左滑动一页至市级列表
		// cityIndex是市区数据的标识
		this.setData({
			cityIndex: index,
			regionIndex: -1,
			townIndex: -1,
			cityName: this.data.city[index],
			regionName: '',
			townName: '',
			town: []
		});
		var that = this;
		//cityObjects是一个LeanCloud对象，通过遍历得到纯字符串数组
		// getArea方法是访问网络请求数据，网络访问正常则一个回调function(area){}
		this.getArea(this.data.cityObjects[index].Id, function (area) {
			var array = [];
			for (var i = 0; i < area.length; i++) {
				array[i] = area[i].Name;
			}
			// region就是wxml中渲染要用到的城市数据，regionObjects是LeanCloud对象，用于县级标识取值
			that.setData({
				regionName: '请选择',
				region: array,
				regionObjects: area
			});
			// 确保生成了数组数据再移动swiper
			that.setData({
				current: 2
			});
		});
	},
	regionTapped: function (e) {
		// 标识当前点击镇级，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		// current为1，使得页面向左滑动一页至市级列表
		// regionIndex是县级数据的标识
		this.setData({
			regionIndex: index,
			townIndex: -1,
			regionName: this.data.region[index],
			townName: '',
			areaSelectedStr: areaSelectedStr
		});

		//目前只有3级
		var areaSelectedStr = this.data.provinceName + this.data.cityName + this.data.regionName;
		this.setData({
			areaSelectedStr: areaSelectedStr,
			areaCode: this.data.regionObjects[index].Id

		});
		console.log(this.data.areaCode);
		this.cascadeDismiss();
		return;
		//如果还有下一级
		/*
		var that = this;
		this.getArea(this.data.regionObjects[index].Id, function (area) {
			// 假如没有镇一级了，关闭悬浮框，并显示地址
			if (area.length == 0) {
				var areaSelectedStr = that.data.provinceName + that.data.cityName + that.data.regionName;
				that.setData({
					areaSelectedStr: areaSelectedStr,
				});
				that.cascadeDismiss();
				return;
			}
			var array = [];
			for (var i = 0; i < area.length; i++) {
				array[i] = area[i].Name;
			}
			// region就是wxml中渲染要用到的县级数据，regionObjects是LeanCloud对象，用于县级标识取值
			that.setData({
				townName: '请选择',
				town: array,
				townObjects: area
			});
			// 确保生成了数组数据再移动swiper
			that.setData({
				current: 3
			});
		});
		*/
	},
	townTapped: function (e) {
		// 标识当前点击镇级，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		// townIndex是镇级数据的标识
		this.setData({
			townIndex: index,
			townName: this.data.town[index]
		});
		var areaSelectedStr = this.data.provinceName + this.data.cityName + this.data.regionName + this.data.townName;
		this.setData({
			areaSelectedStr: areaSelectedStr
		});
		this.cascadeDismiss();
	},
	currentChanged: function (e) {
		// swiper滚动使得current值被动变化，用于高亮标记
		var current = e.detail.current;
		this.setData({
			current: current
		});
	},
	changeCurrent: function (e) {
		// 记录点击的标题所在的区级级别
		var current = e.currentTarget.dataset.current;
		this.setData({
			current: current
		});
	},
	fetchPOI: function () {
		var that = this;
		// 调用接口
		qqmapsdk.reverseGeocoder({
			poi_options: 'policy=2',
			get_poi: 1,
			success: function (res) {
				console.log(res);
				that.setData({
					areaSelectedStr: res.result.address,
					areaCode: res.result.ad_info.adcode
				});
			},
			fail: function (res) {
				//         console.log(res);
			},
			complete: function (res) {
				//         console.log(res);
			}
		});
	}
})