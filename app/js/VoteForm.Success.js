(function(){

    var $container,
        $content,
        _tl,
        _isHiding = true,
        _shareEntrySerial,
        _shareImageUrl;

    var self = window.VoteForm.Success =
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
                FB.ui
                (
                    {
                        method:"feed",
                        display: "iframe",
                        link: Utility.getPath() + "?serial=" + _shareEntrySerial,
                        title: "vote success share title",
                        description: 'vote success share text',
                        //picture: _shareImageUrl
                        picture: _shareImageUrl + "?v=" + new Date().getTime()
                    },function(response)
                    {
                        //console.log(JSON.stringify(response));

                        if(response && response.post_id)
                        {
                            //ga('send', 'event', '作品瀏覽及投票 - 投票成功', "分享成功", response.post_id);

                            self.hide();
                            VoteForm.ShareSuccess.show();
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

        setShareImageUrl: function(url)
        {
            _shareImageUrl = url;
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