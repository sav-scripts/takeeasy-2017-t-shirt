(function(){

    var $container,
        $content,
        _tl,
        _isHiding = true,
        _shareEntrySerial;

    var self = window.ParticipateForm.Success =
    {
        init: function($dom)
        {
            $container = $dom;

            $container.find(".btn-close").on(_CLICK_, function()
            {
                self.hide();
                SceneHandler.toHash('/Entries');
            });

            $container.find(".btn-share").on("click", function()
            {
                ga("send", "event", "投稿表單-分享對話框", "按鈕點擊", "叫同學來衝票");
                FB.ui
                (
                    {
                        method:"feed",
                        display: "iframe",
                        link: Utility.getPath() + "?serial=" + _shareEntrySerial
                    },function(response)
                    {
                        if(response)
                        {
                            self.hide();
                            SceneHandler.toHash('/Entries');
                        }
                    }
                );
            });

            $content = $container.find(".content");

            $container.detach();
        },

        setShareEntrySerial: function(serial)
        {
            _shareEntrySerial = serial;
        },

        show: function()
        {
            if(!_isHiding) return;
            _isHiding = false;

            if(_tl) _tl.kill();

            var tl = _tl = new TimelineMax;
            tl.set($container, {autoAlpha:0});
            tl.set($content, {autoAlpha:0, y: 50});
            tl.to($container,.3, {autoAlpha:1});
            tl.to($content,.3,{autoAlpha:1, y: 0});

            $('body').append($container);
        },

        hide: function()
        {
            if(_isHiding) return;
            _isHiding = true;

            if(_tl) _tl.kill();

            var tl = _tl = new TimelineMax;
            tl.to($content,.3,{autoAlpha:0, y: -50});
            tl.to($container,.3,{autoAlpha:0});
            tl.add(function()
            {
                $container.detach();
            });

        }
    };

}());