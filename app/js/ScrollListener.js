(function(){

    var _cbOnBottom,
        $body,
        $menu,
        $logo,
        $backToTop,
        _markerDom,
        _offsetY,
        _backTopOn = false,
        _isLocking = false,
        _tweenDic = {scrollTop:0};

    var self = window.ScrollListener =
    {
        _isActive: false,

        init: function()
        {
            $body = $("body");
            $menu = $("#menu");
            $logo = $("#logo");
            $backToTop = $("#back-to-top").on(_CLICK_, backToTop);
        },

        active: function(cbOnBottom, markerDom, offsetY)
        {
            _cbOnBottom = cbOnBottom;
            _markerDom = markerDom;
            _offsetY = offsetY;

            self._isActive = true;
            $(window).on('scroll', updateScrollTop);

            checkScrollTop();
        },

        disactive: function()
        {
            self._isActive = false;
            $(window).unbind('scroll', updateScrollTop);

            switchBackTop(false);
        }
    };

    function updateScrollTop()
    {
        if(_isLocking) return;
        if(!self._isActive) return;

        checkScrollTop();

        if(_cbOnBottom)
        {
            var bleedBottom = _markerDom.getBoundingClientRect().bottom + _offsetY,
                windowBottom = Main.viewport.height;

            if(bleedBottom < windowBottom)
            {
                _cbOnBottom.call();
            }
        }
    }

    function switchBackTop(b)
    {
        var oldBackTopOn = _backTopOn;
        _backTopOn = b;

        if(oldBackTopOn === _backTopOn) return;

        $menu.toggleClass('hide-mode', _backTopOn);
        $logo.toggleClass('hide-mode', _backTopOn);
        $backToTop.toggleClass("active-mode", _backTopOn);
    }

    function checkScrollTop()
    {
        var doc = document.documentElement;
        //var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        switchBackTop(top > 235);
    }

    function backToTop()
    {
        if(_isLocking) return;

        _isLocking = true;

        var duration = .5;

        TweenMax.killTweensOf(_tweenDic);

        _tweenDic.scrollTop = $(window).scrollTop();

        TweenMax.to(_tweenDic,duration, {scrollTop: 0, onUpdate: function()
        {
            window.scrollTo($(window).scrollLeft(), _tweenDic.scrollTop);
            checkScrollTop();
        }, onComplete: function()
        {
            _isLocking = false;
        }});
    }

}());
