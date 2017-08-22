(function(){

    var $container,
        $content,
        $avaiableVotes,
        _tl,
        _isHiding = true,
        _shareEntrySerial,
        _shareUrl,
        _avaiableVotes;

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
                ga("send", "event", "投票表單-分享對話框", "按鈕點擊", "叫同學來衝票");

                FB.ui
                (
                    {
                        method:"feed",
                        display: "iframe",
                        //link: Utility.getPath() + "?serial=" + _shareEntrySerial,
                        link: _shareUrl
                        //title: "同學！快來幫我們的班服投票啊！！",
                        //description: '【你們班服不服？輕鬆小品班服好fun 募集大賞】天天幫你的班服投票，就有機會抽中幸運大獎，還能幫全班贏得榮耀',
                        //picture: _shareImageUrl + "?v=" + new Date().getTime()
                    },function(response)
                    {
                        //console.log(JSON.stringify(response));
                        if(response)
                        {
                            self.hide();
                            VoteForm.ShareSuccess.show();
                        }
                    }
                );
            });


            $avaiableVotes = $container.find(".avaiable-votes");

            $content = $container.find(".content");

            $container.detach();
        },

        setShareEntrySerial: function(serial)
        {
            _shareEntrySerial = serial;
        },

        setShareUrl: function(url)
        {
            _shareUrl = url;
        },

        setAvaiableVotes: function(v)
        {
            _avaiableVotes = v;
            $avaiableVotes.text(v);
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