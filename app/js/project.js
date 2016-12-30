$( function () {
    $( "header .back:not(.noClick)" ).on( "click", function () {
        history.go( -1 )
    } );
    $( "header .more:not(.noClick)" ).on( "click", function () {
        window.location.href = 'mySchool-more.html'
    } );

    /* 手风琴 --start */
    $( '[data-toggle="dropdown"]' ).on( 'click', function ( e ) {
        $( e.target ).parent().toggleClass( 'show' );
    } );
    $( '.icon-fangxiangshang' ).on( 'click', function ( e ) {
        $( e.target ).parent().parent().toggleClass( 'show' );
    } );
    /* 手风琴 --end */

    /* 初始化客服按钮 */
    $( '#app' ).append( '<div class="btn_kefu" id="btn_kefu"></div>' ).show();

    setTimeout( function () {
        initDrag( '#btn_kefu' );
    }, 300 );
} );

/* 初始化拖拽插件 */
function initDrag ( id ) {
    delete Hammer.defaults.cssProps.userSelect;
    var kefu = $( id )[ 0 ];
    var hammer = new Hammer( kefu );

    $( id ).on( 'touchend', function () {
        console.log( 'end' );
        $( id ).css( {
            WebkitTransform: 'translate3d(0,0,0)scale(1)',
            transform: 'translate3d(0,0,0)scale(1)'
        } );
    } ).on( 'touchstart', function ( e ) {
        // 禁止浏览器默认选中事件
        e.preventDefault();
    } );

    hammer.on( 'press', function ( e ) {
        console.log( 'press' );
        $( id ).css( {
            WebkitTransform: 'translate3d(0,0,0) scale(1.1)',
            transform: 'translate3d(0,0,0) scale(1.1)',
            transition: 'all .3s ease-in-out',
            opacity: 0.8
        } );
    } ).on( 'pan swipe', function ( e ) {
        e.srcEvent.preventDefault();
        /* 移动距离 */
        var x = e.deltaX;
        var y = e.deltaY;

        $( id ).css( {
            WebkitTransform: 'translate3d(' + x + 'px,' + y + 'px,' + 0 + ')scale(1.1)',
            transform: 'translate3d(' + x + 'px,' + y + 'px,' + 0 + ')scale(1.1)',
            transition: 'opacity .3s ease-in-out',
        } );
        if ( e.isFinal ) {
            var w = $( id ).width() / 2;
            var h = $( id ).height() / 2;
            var left = e.center.x;
            var right = e.center.y;

            $( id ).css( {
                left: left - w,
                top: right - h,
                WebkitTransform: 'translate3d(0,0,0)scale(1)',
                transform: 'translate3d(0,0,0)scale(1)',
            } );
            console.log( e, '拖拽结束' );
        }
    } )
}


/* 封装toast弹框 */
function showInfo ( text ) {
    var body = $( 'body' );
    $( '.weui_toast_text' ).remove();
    var template = '<div class="weui_toast weui_toast_text weui_toast_visible" style="height: auto;"><p class="weui_toast_content" >' + text + '</p></div>';
    $( body ).append( template );

    setTimeout( function () {
        $( '.weui_toast_text' ).remove();
    }, 2000 );
}

/* 渲染PDF文件 */
function initPDF ( id, url ) {
    PDFJS.workerSrc = 'js/libs/pdf.worker.min.js';
    PDFJS.getDocument( url ).then( function getPdfHelloWorld ( pdf ) {
        pdf.getPage( 1 ).then( function getPageHelloWorld ( page ) {
            var scale = 1.5;
            var viewport = page.getViewport( scale );
            var canvas = document.getElementById( id );
            var context = canvas.getContext( '2d' );
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render( renderContext );
        } );
    } );
}