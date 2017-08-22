(function(){

    var $container,
        $content,
        _tl,
        _isHiding = true;

    var self = window.VoteForm.ShareSuccess =
    {
        init: function($dom)
        {
            $container = $dom;

            $container.find(".btn-close").on(_CLICK_, function()
            {
                self.hide();
                SceneHandler.toHash('/Entries');
            });

            $container.find(".btn-participate").on("click", function()
            {
                ga("send", "event", "投票表單-下一步對話框", "按鈕點擊", "我也要投稿");
                self.hide();
                SceneHandler.toHash('/Participate');
            });

            $container.find(".btn-entries").on("click", function()
            {
                ga("send", "event", "投票表單-下一步對話框", "按鈕點擊", "看其他班服");
                self.hide();
                SceneHandler.toHash('/Entries');
            });

            $content = $container.find(".content");

            $container.detach();
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