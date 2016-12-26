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


/* 封装toast弹框 */
function showInfo(text) {
    var body = $('body');
    $('.weui_toast_text').remove();
    var template = '<div class="weui_toast weui_toast_text weui_toast_visible" style="height: auto;"><p class="weui_toast_content" >'+text+'</p></div>';
    $(body).append(template);

    setTimeout(function () {
        $('.weui_toast_text').remove();
    },2000);
}

/* 渲染PDF文件 */
function initPDF(id, url) {
    PDFJS.workerSrc = 'js/libs/pdf.worker.min.js';
    PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
        pdf.getPage(1).then(function getPageHelloWorld(page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);
            var canvas = document.getElementById(id);
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    });
}