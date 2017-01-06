var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var router = express.Router();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var PATH = path.join(__dirname , './data');

// 获取学校信息 getSchool
app.get('/getSchool', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    fs.readFile(PATH + '/school.json', 'utf8', function (err, data) {
        if(err){return console.error(err);}
        res.end(data);
    })
});

// 根据地址查询学校 getSchoolList
app.post('/getSchoolList', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    fs.readFile(PATH + '/school.json', 'utf8', function (err, data) {
        if(err){
            return res.send({
                status:1,
                errMsg: '读取文件失败'
            });
        }
        res.end(data);
    })
});

// 保存学校 setSchool
app.post('/setSchool', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // 关键字段
    var school = req.body;
    // 读取文件
    var filePath  = PATH + '/school.json';
    fs.readFile(filePath, 'utf8', function (err, data) {
        if(err){
            return res.send({
                status:1,
                errMsg: '读取文件失败'
            });
        }
        var newData = JSON.parse(data);
        newData.school = school;
        // 写入文件
        newData = JSON.stringify(newData);
        console.log(newData);
        fs.writeFile(filePath, newData, function(err){
            if(err){
                return res.send({
                    status:1,
                    errMsg: '写入文件失败'
                });
            }
            return res.json({
                code:0,
                errMsg: "保存成功"
            });
        });
    })
});

// 获取产品信息 getProduct
app.get('/getProduct', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
   fs.readFile(PATH + '/product.json', 'utf8', function (err, data) {
       if(err){return console.error(err);}
       res.end(data);
   })
});

// 创建订单 createOrder
app.post('/createOrder', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // 关键字段
    var protectedPerson = req.body.protectedPerson;
    var payProtectedPerson = req.body.payProtectedPerson;
    var productId = req.body.productId;
    var product = {};

    // 读取文件
    var filePath  = PATH + '/orderList.json';
    var orderId = guidGenerate();
    if(!productId || !protectedPerson.insurantName || !protectedPerson.insurantGender || !protectedPerson.insurantBirthday || !payProtectedPerson || !payProtectedPerson.holderName || !payProtectedPerson.holderPhone){
       return res.send({
            status:1,
            errMsg: '数据不全,订单创建失败'
        });
    }

    // 获取保险产品的信息
    fs.readFile(PATH + '/product.json', 'utf8', function (err, data) {
        if (err) {
            return res.send({
                status: 1,
                errMsg: '读取文件失败'
            });
        }
        var newData = JSON.parse(data);
        var result =  newData.products.map(function (item) {
            if(item.productId == productId){
                return item
            }
        });
        if(result.length){
            product = result[0];
        }else {
          return  res.send({
                code:1,
                errMsg:'产品Id错误'
            });
        }
    });

    fs.readFile(filePath, 'utf8', function (err, data) {
        if(err){
            return res.send({
                status:1,
                errMsg: '读取文件失败'
            });
        }
        var newData = JSON.parse(data);
        newData.unPayList.push({
            product:product,
            protectedPerson: protectedPerson,
            payProtectedPerson: payProtectedPerson,
            orderId: orderId,
            orderState: false
        });
        // 写入文件
        newData = JSON.stringify(newData);
        fs.writeFile(filePath, newData, function(err){
            if(err){
                return res.send({
                    status:1,
                    errMsg: '写入文件失败'
                });
            }
            return res.send({
                code:0,
                errMsg:'创建订单成功',
                orderId: orderId
            });
        });
    })
});

// 查看未支付订单
app.get('/getOrder', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var orderId = req.query.orderId;
    // 读取文件
    var filePath  = PATH + '/orderList.json';
    fs.readFile(filePath, 'utf8', function (err, data) {
        if(err){
            return res.send({
                status:1,
                errMsg: '读取文件失败'
            });
        }
        var newData = JSON.parse(data);
        var result = {};
       newData.unPayList.map(function (item) {
            if(item.orderId == orderId){
                result = item
            }
        });
        if(result){
            return res.send(result);
        }else {
            return res.send({
                code:1,
                errMsg:'未找到订单'
            })
        }

    })
});

// 支付成功，更新订单 updataOrder
app.get('/updataOrder', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    // 订单状态
    var orderId = req.query.orderId;

    // 读取文件
    var filePath  = PATH + '/orderList.json';
    fs.readFile(filePath, 'utf8', function (err, data) {
        if(err){
            return res.send({
                status:1,
                errMsg: '读取文件失败'
            });
        }
        var newData = JSON.parse(data);
        var product = {};
        newData.unPayList = newData.unPayList.map(function (item) {
            console.log(item.orderId, orderId);
            if(item.orderId != orderId){
                return item
            }else {
                product = item
            }
        });
        product.policyNo = guidGenerate();
        newData.effectList.push(product);

        // 写入文件
        newData = JSON.stringify(newData);
        console.log(newData);
        fs.writeFile(filePath, newData, function(err){
            if(err){
                return res.send({
                    status:1,
                    errMsg: '写入文件失败'
                });
            }
            return res.send({
                code:0,
                errMsg:'订单更新成功'
            });
        });
    })
});


var server = app.listen(3000, function () {
    var port = server.address().port || 3000;
    console.log("应用实例，访问地址为 http://192.168.1.27:%s", port)
});


/* 随机生成ID */
function guidGenerate() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}