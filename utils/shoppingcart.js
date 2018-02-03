const add = function (userId, goods) {
    var list = new Array;
    wx.getStorage({
        key: `ShoppingCart_${userId}`,
        success: function (res) {
            list = res.data;
            var added = false;
            for (var i = 0; i < list.length; i++) {
                if (list[i].goodsId == goods.Id) {
                    list[i].quantity++;
                    added = true;
                    break;
                }
            }
            if (!added) {
                list.push({
                    goodsId: goods.Id,
                    avatar: goods.Avatar,
                    title: goods.Name,
                    price: goods.Price,
                    selected: true,
                    quantity: 1
                });
            }

            wx.setStorage({
                key: `ShoppingCart_${userId}`,
                data: list,
                success: function () {
                    console.log('add success')
                }
            });
        },
        //不存在购物车数据时
        fail: function (res) {
            list.push({
                goodsId: goods.Id,
                avatar: goods.Avatar,
                title: goods.Name,
                price: goods.Price,
                selected: true,
                quantity: 1
            });
            wx.setStorage({
                key: `ShoppingCart_${userId}`,
                data: list,
                success: function () {
                    console.log('add success')
                }
            });
        }
    })
}

const remove = function (userId, goodsId, index) {
    wx.getStorage({
        key: `ShoppingCart_${userId}`,
        success: function (res) {
            var list = res.data;
            if (goodsId <= 0 && index > -1)
                list.splice(index, 1);
            else {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].goodsId == goodsId) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
            wx.setStorage({
                key: `ShoppingCart_${userId}`,
                data: list,
                success: function () {
                    console.log('remove success')
                }
            });
        }
    })
}

const incr = function (userId, num, goodsId, index) {
    wx.getStorage({
        key: `ShoppingCart_${userId}`,
        success: function (res) {
            var list = res.data;
            if (goodsId <= 0)
                list[index].quantity += num;
            else {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].goodsId == goodsId) {
                        list[i].quantity += num;
                        break;
                    }
                }
            }
            wx.setStorage({
                key: `ShoppingCart_${userId}`,
                data: list,
                success: function () {
                    console.log('incr success')
                }
            });
        }
    })
}

const updateQuantity = function (userId, newQuantity, goodsId, index) {
    wx.getStorage({
        key: `ShoppingCart_${userId}`,
        success: function (res) {
            var list = res.data;
            if (goodsId <= 0)
                list[index].quantity = newQuantity;
            else {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].goodsId == goodsId) {
                        list[i].quantity = newQuantity;
                        break;
                    }
                }
            }

            wx.setStorage({
                key: `ShoppingCart_${userId}`,
                data: list,
                success: function () {
                    console.log('incr success')
                }
            });
        }
    })
}

const get = function (userId) {
    var data = wx.getStorageSync(`ShoppingCart_${userId}`);
    return data;
}

const save = function (userId, carts) {
    console.log(JSON.stringify(carts));
    console.log('save');
}

module.exports = {
    get: get,
    add: add,
    remove: remove,
    incr: incr,
    updateQuantity: updateQuantity,
    save: save
}