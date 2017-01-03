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
        var arr = ['我只是一只小母鸡','我只是用来看的','点我没什么用','来打我呀~'];
        showInfo(arr[Math.floor(Math.random()*4)]);
        $( id ).css( {
            WebkitTransform: 'translate3d(0,0,0)scale(1)',
            transform: 'translate3d(0,0,0)scale(1)'
        } );
    } ).on( 'touchstart', function ( e ) {
        // 禁止浏览器默认选中事件
        e.preventDefault();
    } );

    hammer.on( 'press', function ( e ) {
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
    var template = $('<div class="weui_toast weui_toast_text weui_toast_visible" style="height: auto;"><p class="weui_toast_content" >' + text + '</p></div>');
    $( body ).append( template );
    setTimeout( function () {
        $(template).remove();
    },1500);
}

/* 验证邮箱邮箱性 */
function isEmail(val) {
    var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    return reg.test(val)
}