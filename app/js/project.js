$(function () {
    $("header .back:not(.noClick)").on("click", function () {
        history.go(-1)
    });

    /* 封装一个手风琴插件 --start */
    $('[data-toggle="dropdown"]').on('click',function (e) {
        $(e.target).parent().toggleClass('show');
    });
    $('.icon-fangxiangshang').on('click',function (e) {
        $(e.target).parent().parent().toggleClass('show');
    });
    /* 封装一个手风琴插件 --end */
});

/* 身份证识别 */
function getIdentifyMsg() {
        showInfo('该功能正在开发');
        /* TODO:调用微信摄像头,识别身份证信息 */
        /*wx.chooseImage({
         count: 1, // 默认9
         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         success: function (res) {
         var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

         }
         });*/

        return {}
}

function showInfo(text) {
    var body = $('body');
    $('.weui_toast_text').remove();
    var template = `<div class="weui_toast weui_toast_text weui_toast_visible" style="height: auto;">
        <i class="weui_icon_toast"></i>
        <p class="weui_toast_content" >`+text+`</p>
    </div>`;
    $(body).append(template);

    setTimeout(function () {
        $('.weui_toast_text').remove();
    },2000);
}