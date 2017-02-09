/* 相书保险全局js文件 */
$( function () {
    // 点击返回事件
    $( "header .back:not(.noClick)" ).on( "click", function () {
        history.go( -1 )
    } );
    // 点击查看更多事件
    $( "header .more:not(.noClick)" ).on( "click", function () {
        window.location.href = "other.html"
    } );

    // 手风琴,点击事件
    $( "[data-toggle='dropdown']" ).on( "click", function ( e ) {
        $( e.target ).parent().toggleClass( "show" );
    } );
    $( ".icon-fangxiangshang" ).on( "click", function ( e ) {
        $( e.target ).parent().parent().toggleClass( "show" );
    } );

    // 创建一个客服按钮
    $( "body" ).append( "<div class='btn_kefu' id='btn_kefu'></div>" );
    setTimeout( function () {
        // 初始化客服按钮
        initDrag( "#btn_kefu" );
        // 显示页面
        $("#app").show();
    }, 100 );
} );

/* 封装本地存储 */
var store ={
    /* 获取name的值 */
    getItem: function (name) {
        return  localStorage.getItem(name)? JSON.parse(localStorage.getItem(name)):false;
    },
    /* 设置name值为val */
    setItem: function (name,val) {
        localStorage.setItem(name,JSON.stringify(val))
    },
    /* 删除指定的值name */
    removeItem: function (name) {
        localStorage.removeItem(name);
    },
    /* 清除所有 */
    clear: function () {
        localStorage.clear();
    },
    /* 获取所有 */
    getAll: function () {
        return localStorage
    }
};

/* 拖拽插件,参考hammer.js(http://hammerjs.github.io/)
 * @param id 被拖拽元素的id
 * @return null
 * */
function initDrag ( id ) {
    delete Hammer.defaults.cssProps.userSelect;
    var kefu = $( id )[ 0 ];
    var hammer = new Hammer( kefu );

    // 初始化被拖拽元素的top和left
    var css = store.getItem("position");
    css ? $( id ).css(css) : $( id ).css({left:"10px", bottom:"50px"});
    $(id).css({opacity:1});

    var w = $( id ).width() / 2;
    var h = $( id ).height() / 2;
    // 计算最大左边距maxL,最大上边距maxT
    var maxL = $(window).width() - 2 * w;
    var maxT = $(window).height() - 2 * h;

    // 元素触摸结束时，
    $( id ).on( "touchend", function () {
        console.log( "end" );

    })
        // 禁止长按默认事件
        .on( "touchstart", function ( e ) {
        // 禁止浏览器默认选中事件
        e.preventDefault();
    } );

    // 长按事件press
    // 拖拽事件pan 快速移动事件swipe
    hammer.on("tap", function () {
        //console.log('点击事件');
        window.location.href = 'tel:18825144569';
    }).on("press", function () {
        //console.log('长按事件');
        $(id).css({
            WebkitTransform: "translate3d(0,0,0) scale(1.1)",
            transform: "translate3d(0,0,0) scale(1.1)",
            transition: "all .3s ease-in-out",
            opacity: 0.8
        });
    }).on("pan swipe", function (e) {
        //console.log('拖动事件');
        e.srcEvent.preventDefault();
        // 移动距离
        var x = e.deltaX;
        var y = e.deltaY;

        // 改变元素的translate3d属性来移动元素
        $(id).css({
            WebkitTransform: "translate3d(" + x + "px," + y + "px," + 0 + ")scale(1.1)",
            transform: "translate3d(" + x + "px," + y + "px," + 0 + ")scale(1.1)",
            transition: "opacity .3s ease-in-out"
        });
        // 拖拽结束
        if (e.isFinal) {
            // 获取当前position的left和top
            var left = e.center.x - w;
            var top = e.center.y - h;

            // 当超出页面边界时，修正left和top
            left = correctPosition(left, maxL);
            top = correctPosition(top, maxT);

            // 渲染样式
            $(id).css({
                left: left,
                top: top,
                WebkitTransform: "translate3d(0,0,0)scale(1)",
                transform: "translate3d(0,0,0)scale(1)"
            });
            // 保存当前的position
            store.setItem("position", {left: left, top: top});
            console.log(e, "拖拽结束");
        }
    });

    /* 修正当前的left和top值
     * @param val left/top 左边距或上边距
     * @return newVal 修正后的值
     * */
    function correctPosition(val,max) {
        return (val < 0) ? 0 : ((val > max) ? max : val );
    }
}

/* 封装toast弹框
 * @param text 要显示文本
 * @param time 显示的时间，默认为1500ms
  * */
function showInfo ( text, time ) {
    var body = $( "body" );
    $( ".weui_toast_text" ).remove();
    var template = $("<div class='weui_toast weui_toast_text weui_toast_visible' style='height: auto;'><p class='weui_toast_content' >" + text + "</p></div>");
    if(!text){ return false }
    $( body ).append( template );
    setTimeout( function () {
        $(template).remove();
    },time || 1500 );
}

/* 验证邮箱邮箱性
 * @param val 邮箱的值
  * */
function isEmail(val) {
    var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    return reg.test(val)
}

/* 从当前链接地址获取查询参数
 * @param name 要获取的对象名
 * @return val name的值
 * 例如当前链接为www.xxx.com?type=123，getUrlParam("type")返回123
  * */
function getUrlParam(name) {
    var result = "";
    var searchArr =  window.location.search.slice(1).split("&");
    searchArr.map(function (item) {
        var arr = item.split("=");
        if(arr[0] == name){
            result = decodeURIComponent(arr[1]);
        }
    });
    return result
}

/* obj对象拼接,es6语法 */
if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
            "use strict";
            if (target === undefined || target === null)
                throw new TypeError("Cannot convert first argument to object");
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) continue;
                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
                }
            }
            return to;
        }
    });
}

/* 功能：检查身份证号码
 * @param idCard [string]
 * @return {state: true, errMsg: "验证通过!"}
 */
function checkidCard(idCard){
    var Errors = new Array(
        {state: true, errMsg: "验证通过!"},
        {state: false, errMsg: "身份证号码位数不对!"},
        {state: false, errMsg: "身份证号码出生日期超出范围或含有非法字符!"},
        {state: false, errMsg: "身份证号码校验错误!"},
        {state: false, errMsg: "身份证地区非法!"}
    );
    var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
        31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
        41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
        61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}

    var Y,JYM,S,M,ereg;
    var idCard_array = idCard.toString().split("");

    //地区检验
    if(area[parseInt(idCard.substr(0,2))]==null) return Errors[4];
    //身份号码位数及格式检验
    switch(idCard.length){
        case 15:
            if ( (parseInt(idCard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idCard.substr(6,2))+1900) % 100 == 0 &&
                (parseInt(idCard.substr(6,2))+1900) % 4 == 0 )){
                ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
            } else {
                ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
            }
            if(ereg.test(idCard)) return Errors[0];
            else return Errors[2];

            break;
        case 18:
            //18位身份号码检测
            //出生日期的合法性检查
            //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
            //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
            if ( parseInt(idCard.substr(6,4)) % 4 == 0 || (parseInt(idCard.substr(6,4)) % 100 == 0 &&
                parseInt(idCard.substr(6,4))%4 == 0 )){
                ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
            } else {
                ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
            }
            if(ereg.test(idCard)){//测试出生日期的合法性
                //计算校验位
                S = (parseInt(idCard_array[0]) + parseInt(idCard_array[10])) * 7
                    + (parseInt(idCard_array[1]) + parseInt(idCard_array[11])) * 9
                    + (parseInt(idCard_array[2]) + parseInt(idCard_array[12])) * 10
                    + (parseInt(idCard_array[3]) + parseInt(idCard_array[13])) * 5
                    + (parseInt(idCard_array[4]) + parseInt(idCard_array[14])) * 8
                    + (parseInt(idCard_array[5]) + parseInt(idCard_array[15])) * 4
                    + (parseInt(idCard_array[6]) + parseInt(idCard_array[16])) * 2
                    + parseInt(idCard_array[7]) * 1
                    + parseInt(idCard_array[8]) * 6
                    + parseInt(idCard_array[9]) * 3 ;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y,1);//判断校验位
                if(M == idCard_array[17]) return Errors[0]; //检测ID的校验位
                else return Errors[3];
            }
            else return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
}

/*
* 功能：根据身份证号获得出生日期
* @param idCard 身份证号
* @return birthday 出身日期 '1992-11-03'
* */
function getBirthday(idCard){
    idCard = idCard.toString();
    var birthdayno,birthdaytemp
    if(idCard.length==18){
        birthdayno=idCard.substring(6,14)
    }else if(idCard.length==15){
        birthdaytemp=idCard.substring(6,12)
        birthdayno="19"+birthdaytemp
    }else{
        alert("错误的身份证号码，请核对！")
        return false
    }
    var birthday=birthdayno.substring(0,4)+"-"+birthdayno.substring(4,6)+"-"+birthdayno.substring(6,8)
    return birthday
}

/*
 * 功能：根据身份证号获得性别
 * @param idCard 身份证号
 * @return sex 性别
 * */
function getSex(idCard){
    var sexno,sex;
    idCard = idCard.toString();
    if(idCard.length==18){
        sexno=idCard.substring(16,17)
    }else if(idCard.length==15){
        sexno=idCard.substring(14,15)
    }else{
        alert("错误的身份证号码，请核对！")
        return false
    }
    var tempid=sexno%2;
    if(tempid==0){
        sex='F'
    }else{
        sex='M'
    }
    return sex
}

/* 学校类型解码
 * 0：幼儿园
 * 1：小学
 * 2：初中
 * 3：高中
 * 4：大学
 * @参数为数字，则返回学校名
 * @参数为学校名，则返回数字
 * */
function transformSchoolCode(val,type) {
    var result = val;
    if(typeof val == 'number' && type == 'str'){
        switch (val){
            case 0:
                result = '幼儿园';break;
            case 1:
                result = '小学';break;
            case 2:
                result = '初中';break;
            case 3:
                result = '高中';break;
            case 4:
                result = '大学';break;
            default:
                result = '-----'
        }
    }else if(typeof val == 'string' && type == 'num'){
        switch (val){
            case '幼儿园':
                result = 0;break;
            case '小学':
                result = 0;break;
            case '初中':
                result = 0;break;
            case '高中':
                result = 0;break;
            case '大学':
                result = 0;break;
            default:
                result = -1;
        }
    }
    return result
}

/* 性别解码
 *
  * */
function transformSex(val) {
    var result ;
    if(/[MF]/.test(val)){
        switch (val){
            case 'M':
                result = '男';break;
            case 'F':
                result = '女';break;
            default:
                result = ''
        }
    }else if(/['男''女']/.test(val)){
        switch (val){
            case '男':
                result = 'M';break;
            case '女':
                result = 'F';break;
            default:
                result = '';
        }
    }
    return result;
}