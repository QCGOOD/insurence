/**
 * @author Allen
 * 表单封装工具类,当表单数据都合乎条件,则返回表单的json对象,否则返回null
 * 此工具并不适合表单会动态变化的场景
 * <pre>
 * 元素分类: input(text, password, hidden, checkbox), textarea, select, radiobox
 *
 * 约定写法:
 * 对于需要作为表单元素的input-text标签:
 * <input type="text" name="vo.name" fd="true" dt="text" tip="姓名" minl="2" maxl="4"/>
 *
 * 对于需要作为表单元素的input-password标签:
 * <input type="password" name="vo.password" fd="true" dt="text" tip="密码" minl="6" maxl="15"/>
 *
 * 对于需要作为表单元素的input-hidden标签:
 * <input type="hidden" name="vo.name" fd="true" dt="text" tip="姓名" minl="2" maxl="4"/>
 *
 * 对于需要作为表单元素的input-checkbox标签:
 * <input type="checkbox" name="vo.hobby" value="乒乓球" fd="true" tip="爱好" minl="1" maxl="2"/>
 * <input type="checkbox" name="vo.hobby" value="羽毛球" fd="true" tip="爱好" minl="1" maxl="2"/>
 * <input type="checkbox" name="vo.hobby" value="乒乓球" fd="true" tip="爱好" minl="1" maxl="2"/>
 *
 * 对于需要作为表单元素的textarea标签:
 * <textarea type="textarea" name="vo.description" fd="true" dt="text" minl="10" maxl="200" tip="详细"/>
 *
 *
 *
 * 属性解释:
 * name      : 必填项
 * fd="true" : 标记此属性,才会被此类加载,true是form的名称或者任意自定义名称
 *
 * dt="text" : 数据类型,可选值有text(文本,不为空),required(必填),null(选填)(弃用),mobile(手机号),int(整数),float(浮点数)
 *
 *
 * minl="2" : 属性值最小长度,当dt="mobile"时,此属性无效;checkbox使用时,表示最小勾选数量;int时表示最大值和最小值
 * maxl="5" : 属性值最大长度,当dt="mobile"时,此属性无效;checkbox使用时,表示最大勾选数量;
 * tip="姓名" : 属性值的说明
 * multi="true" : 允许重名的input元素,处理此类input元素会把值用", "拼接起来,如果为false,则后面的值替换前面的
 * </pre>
 */
var formSubmitted = false;
var common_statement = "不能为空";

/*
 * 表单验证
  * @param
  * */
function formCheck(marker){
    // 表单
    var form = {};
    // 多选框勾选状态:{name:数量}
    var checkboxStatus = {};
    // 单选框勾选状态:{name:数量}
    var radioboxStatus = {};
    // 收集表单元素
    //marker = marker||"true";
    if( typeof(marker)== undefined || marker == undefined || marker == null || marker.length == 0 ){
        marker = "true";
    }
    var list = $("input[fd='"+marker+"']");

    for (var i = 0;i < list.length;i++) {
        var tagName = list[i].tagName;
        var input = $(list[i]);
        var type = input.attr("type");
        /** 字段提示 */
        var tip = input.attr("tip");
        /** 字段类型:text(文本),mobile(手机),null(选填) */
        var dataType = input.attr("dt");
        /** 字段长度限定:最短长度 */
        var minLength = input.attr("minl") * 1;
        /** 字段长度限定:最长长度 */
        var maxLength = input.attr("maxl") * 1;
        /** 字段名是否允许重复,如果true,那么重复的会用", "拼接起来,否则会替换 */
        var multi = input.attr("multi");
        /* 正则验证 */
        var pattern = input.attr('pattern');


        var name = input.attr("name");
        var value = input.val();
        if ((type == "text") || (type == "hidden") || tagName == "TEXTAREA" || (type == "password") || (type == "number") || (type == "date")) {
            // 处理text和textarea和password
            if (dataType == "mobile") {
                var result = isMobile(value);
                if(!result){
                    showInfo("请输入正确的" + tip);
                    return null;
                }else{
                    createJson(multi, form, name, value);
                }
            } else if (dataType == "text") {
                // 验证文本内容
                if (value && value.length > 0){
                    if (minLength && maxLength){
                        // 如果填写了长度限制,则判断长度
                        var length = value.length;
                        if (length < minLength || length > maxLength) {
                            showInfo(tip + "的长度应在" + minLength + " ~ " + maxLength + "之间");
                            return null;
                        } else {
                            createJson(multi, form, name, value);
                        }
                    }else{
                        // 如果没有填写,则不做长度验证
                        createJson(multi, form, name, value);
                    }
                } else {
                    input.focus();
                    showInfo( tip + common_statement , 50000);
                    return null;
                }
            } else if (dataType == "null") {
                createJson(multi, form, name, value);
            } else if (dataType == "int") {
                if(!value){
                    showInfo( tip + common_statement );
                    return null;
                }
                if (isInt(value)) {
                    if (minLength>=0 && maxLength>=0) {
                        var min = minLength * 1;
                        var max = maxLength * 1;
                        value = value * 1;
                        if (value <= max && value >= min) {
                            createJson(multi, form, name, value);
                        } else {
                            showInfo(tip + "必须在" + min + " ~ " + max + "之间");
                            return null;
                        }
                    } else {
                        createJson(multi, form, name, value);
                    }
                } else {
                    showInfo(tip + "必须是整数");
                    return null;
                }
            } else if (dataType == "float"){
                if(!value){
                    showInfo( tip + common_statement );
                    return null;
                }
                if (isFloat(value)) {
                    if (minLength>=0 && maxLength>=0) {
                        var min = minLength * 1;
                        var max = maxLength * 1;
                        value = value * 1;
                        if (value <= max && value >= min) {
                            createJson(multi, form, name, value);
                        } else {
                            showInfo(tip + "必须在" + min + " ~ " + max + "之间");
                            return null;
                        }
                    } else {
                        createJson(multi, form, name, value);
                    }
                } else {
                    showInfo(tip + "必须是数字");
                    return null;
                }
            }
        } else if (type == "checkbox") {
            // 处理checkbox
            var checked = input.is(":checked");

            var checkedNum = checkboxStatus[name];
            if (checkedNum) {
                checkedNum = Number(checkedNum);
            } else {
                checkedNum = 0;
            }
            if (checked) {
                checkedNum++;
                if(isBlank(value)){
                    createJson(true, form, name, true);
                } else {
                    createJson(true, form, name, value);
                }
            }
            createJson(false, checkboxStatus, name, checkedNum);
        } else if (type == "radio") {
            var checked = input.is(":checked");
            var checkedNum = radioboxStatus[name];
            if (checkedNum) {
                checkedNum = Number(checkedNum);
            } else {
                checkedNum = 0;
            }
            if (checked) {
                checkedNum++;
                createJson(false, form, name, value);
            }

            //createJson(false, radioboxStatus, name, checkedNum);
        } else if (tagName == "SELECT") {
            // 处理select
            var selected = input.find(":selected");
            if ( dataType == "text" && !selected ) {
                showInfo("请选择" + tip);
                return null;
            } else {
                value = selected.val();
                createJson(multi=="true", form, name, value);
            }
        }
    }

    // 检查checkbox勾选情况
    for (var name in checkboxStatus) {
        var checkedNum = checkboxStatus[name];
        var input = $('input[type="checkbox"][name="'+name+'"]')[0];
        input = $(input);
        var maxl = Number(input.attr("maxl"));
        var minl = Number(input.attr("minl"));
        var tip = input.attr("tip");
        if (checkedNum < minl) {
            showInfo("请至少勾选" + minl + "个" + tip + "选项");
            return null;
        }
        if (checkedNum > maxl) {
            showInfo(tip + "选项不能选择超过" + maxl + "个");
            return null;
        }
    }

    // 检查radiobox勾选情况
    for (var name in radioboxStatus) {
        var checkedNum = radioboxStatus[name];
        var input = $('input[type="radio"][name="'+name+'"]')[0];
        input = $(input);
        var tip = input.attr("tip");
        if (checkedNum == 0) {
            showInfo("请选择" + tip);
            return null;
        }
    }
    return form;
}

// 通用提交表单方法
function formSubmit(form, postUrl, successCallBack, failedCallBack, errorCallBack, arrayHandler){
    if(formSubmitted){
        showInfo("正在提交,请勿重复提交...");
        return;
    }
    formSubmitted = true;
    setTimeout(function(){
        $.ajax({
            type : "POST", dataType : "JSON", data : form, url : postUrl, traditional : true,
            success : function (obj) {
                formSubmitted = false;
                if (obj && obj.successMsg) {
                    if (successCallBack) {
                        successCallBack(obj);
                    } else {
                        showInfo(obj.successMsg, 5);
                    }
                } else if (obj && obj.errorMsg) {
                    if (failedCallBack) {
                        failedCallBack(obj);
                    } else {
                        showInfo(obj.errorMsg, 5);
                    }
                } else if (obj instanceof Array) {
                    if (arrayHandler) {
                        arrayHandler(obj);
                    }
                } else if (obj) {
                    errorCallBack(obj);
                }
            },
            error : function(){
                formSubmitted = false;
                if(errorCallBack){
                    errorCallBack();
                } else {
                    showInfo("保存出错", 5);
                }
            }
        });
    },200);
}

// 判断是不是手机号
function isMobile(phone) {
    if (phone.length != 11)
        return false;
    else if (phone.substring(0, 1) != "1")
        return false;
    else if (isNaN(phone))
        return false;
    return true;
}

// 判断整数
function isInt(str) {
    var g = /^-?\d+$/;
    return g.test(str);
}

//判断浮点数
function isFloat(str) {
    return !isNaN(str);
}



function createJson(multi, json, key, value) {
    if (multi) {
        createJsonWithAdd(json, key, value);
    } else {
        createJsonWithReplace(json, key, value);
    }
}

// 拼接json,如果有重复的key则覆盖
function createJsonWithReplace(json, key, value){
    if(typeof value === "undefined"){
        // 删除属性
        showInfo('数据未定义');
        delete json[key];
    } else{
        strToObject(json, key,value);
    }
}

// 拼接json,如果有重复的key则继续拼接值
function createJsonWithAdd(json, key, value){
    if(typeof value === "undefined") {
        // 删除属性
        delete json[key];
    } else {
        // 添加 或 修改
        var orgValue = json[key];
        if(orgValue){
            strToObject(json, key,orgValue + ", " + value);
            //json[key] = orgValue + ", " + value;
        }else{
            strToObject(json, key, value);
            //json[key] = value;
        }
    }
}

/* 将字符串转化为js对象,并赋值
* 例如 strToObject('vo.name'),返回vo:{name:''}
* */
function strToObject(json, str, val) {
    var arr = str.split(".");
    if(arr.length>1){
        json[arr[0]] = {};
        json[arr[0]][arr[1]] = val;
    }else {
        json[arr[0]] = val;
    }
}


function setValue(fieldId, value) {
    var field = $("#" + fieldId);
    field.val(value);
    console.log(field.attr("tip")+"被设值为"+value);
}

function setText(fieldId, text) {
    $("#" + fieldId).text(text);
}