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
        window.location.href = 'tel:075522164956';
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
function checkidCard(idCard) {
    var Errors = new Array(
        {state: true, errMsg: "验证通过!"},
        {state: false, errMsg: "身份证号码位数不对!"},
        {state: false, errMsg: "身份证号码出生日期超出范围或含有非法字符!"},
        {state: false, errMsg: "身份证号码校验错误!"},
        {state: false, errMsg: "身份证地区非法!"}
    );
    return idCardNoUtil.checkIdCardNo(idCard)
}

/*
* 功能：根据身份证号获得出生日期
* @param idCard 身份证号
* @return birthday 出身日期 '1992-11-03'
* */
function getBirthday(idCard){
    idCard = idCard.toString();
    return idCardNoUtil.getIdCardInfo(idCard).birthday
}

/*
 * 功能：根据身份证号获得性别
 * @param idCard 身份证号
 * @return sex 性别
 * */
function getSex(idCard) {
    return idCardNoUtil.getIdCardInfo(idCard).gender
}

function getAge(strBirthday){
    var returnAge;
    var strBirthdayArr=strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
    }
    else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }

    return returnAge;//返回周岁年龄

}


var idCardNoUtil = {
    /*省,直辖市代码表*/
    provinceAndCitys: {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
        31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",
        45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
        65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},

    /*每位加权因子*/
    powers: ["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"],

    /*第18位校检码*/
    parityBit: ["1","0","X","9","8","7","6","5","4","3","2"],

    /*性别*/
    genders: {male:"M",female:"F"},

    /*校验地址码*/
    checkAddressCode: function(addressCode){
        var check = /^[1-9]\d{5}$/.test(addressCode);
        if(!check) return false;
        if(idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0,2))]){
            return true;
        }else{
            return false;
        }
    },

    /*校验日期码*/
    checkBirthDayCode: function(birDayCode){
        var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
        if(!check) return false;
        var yyyy = parseInt(birDayCode.substring(0,4),10);
        var mm = parseInt(birDayCode.substring(4,6),10);
        var dd = parseInt(birDayCode.substring(6),10);
        var xdata = new Date(yyyy,mm-1,dd);
        if(xdata > new Date()){
            return false;//生日不能大于当前日期
        }else if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) ){
            return true;
        }else{
            return false;
        }
    },

    /*计算校检码*/
    getParityBit: function(idCardNo){
        var id17 = idCardNo.substring(0,17);
        /*加权 */
        var power = 0;
        for(var i=0;i<17;i++){
            power += parseInt(id17.charAt(i),10) * parseInt(idCardNoUtil.powers[i]);
        }
        /*取模*/
        var mod = power % 11;
        return idCardNoUtil.parityBit[mod];
    },

    /*验证校检码*/
    checkParityBit: function(idCardNo){
        var parityBit = idCardNo.charAt(17).toUpperCase();
        if(idCardNoUtil.getParityBit(idCardNo) == parityBit){
            return true;
        }else{
            return false;
        }
    },

    /*校验15位或18位的身份证号码*/
    checkIdCardNo: function(idCardNo){
        //15位和18位身份证号码的基本校验
        var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
        if(!check) return false;
        //判断长度为15位或18位
        if(idCardNo.length==15){
            return idCardNoUtil.check15IdCardNo(idCardNo);
        }else if(idCardNo.length==18){
            return idCardNoUtil.check18IdCardNo(idCardNo);
        }else{
            return false;
        }
    },

    //校验15位的身份证号码
    check15IdCardNo: function(idCardNo){
        //15位身份证号码的基本校验
        var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
        if(!check) return false;
        //校验地址码
        var addressCode = idCardNo.substring(0,6);
        check = idCardNoUtil.checkAddressCode(addressCode);
        if(!check) return false;
        var birDayCode = '19' + idCardNo.substring(6,12);
        //校验日期码
        check = idCardNoUtil.checkBirthDayCode(birDayCode);
        if(!check) return false;
        //验证校检码
        return idCardNoUtil.checkParityBit(idCardNo);
    },

    //校验18位的身份证号码
    check18IdCardNo: function(idCardNo){
        //18位身份证号码的基本格式校验
        var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
        if(!check) return false;
        //校验地址码
        var addressCode = idCardNo.substring(0,6);
        check = idCardNoUtil.checkAddressCode(addressCode);
        if(!check) return false;
        //校验日期码
        var birDayCode = idCardNo.substring(6,14);
        check = idCardNoUtil.checkBirthDayCode(birDayCode);
        if(!check) return false;
        //验证校检码
        return idCardNoUtil.checkParityBit(idCardNo);
    },

    formateDateCN: function(day){
        var yyyy =day.substring(0,4);
        var mm = day.substring(4,6);
        var dd = day.substring(6);
        return yyyy + '-' + mm +'-' + dd;
    },

    //获取信息
    getIdCardInfo: function(idCardNo){
        var idCardInfo = {
            gender:"",  //性别
            birthday:"" // 出生日期(yyyy-mm-dd)
        };
        if(idCardNo.length==15){
            var aday = '19' + idCardNo.substring(6,12);
            idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
            if(parseInt(idCardNo.charAt(14))%2==0){
                idCardInfo.gender=idCardNoUtil.genders.female;
            }else{
                idCardInfo.gender=idCardNoUtil.genders.male;
            }
        }else if(idCardNo.length==18){
            var aday = idCardNo.substring(6,14);
            idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
            if(parseInt(idCardNo.charAt(16))%2==0){
                idCardInfo.gender=idCardNoUtil.genders.female;
            }else{
                idCardInfo.gender=idCardNoUtil.genders.male;
            }

        }
        return idCardInfo;
    },

    /*18位转15位*/
    getId15: function(idCardNo){
        if(idCardNo.length==15){
            return idCardNo;
        }else if(idCardNo.length==18){
            return idCardNo.substring(0,6) + idCardNo.substring(8,17);
        }else{
            return null;
        }
    },

    /*15位转18位*/
    getId18: function(idCardNo){
        if(idCardNo.length==15){
            var id17 = idCardNo.substring(0,6) + '19' + idCardNo.substring(6);
            var parityBit = idCardNoUtil.getParityBit(id17);
            return id17 + parityBit;
        }else if(idCardNo.length==18){
            return idCardNo;
        }else{
            return null;
        }
    }
};



//获取身份证信息
//var idCardInfo = idCardNoUtil.getIdCardInfo(idCardNo);

//注：录入并判断数据库中是否已存在同样的身份证时
//(1) 若输入的是15位的身份证：先查找15位的ID是否存在，若不存在还需要将15位的身份证转成18位的身份证，仍不存在的话才可录入系统。
//(2) 若输入的是18位的身份证：先查找18位的ID是否存在，若不存在还需要将18位的身份证转成15位的身份证，仍不存在的话才可录入系统。
//如果找到对应的15位身份证，需要将15位的更新到18位。

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