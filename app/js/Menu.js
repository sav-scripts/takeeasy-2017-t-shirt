(function(){

    var $doms = {},
        _iconTL,
        _isOpen = false;

    var self = window.Menu =
    {
        init: function()
        {
            $doms.container = $("#menu");

            $doms.menuContainer = $doms.container.find(".menu-base");

            $doms.container.find(".menu-icon").on(_CLICK_, function()
            {
                self.open();
            });

            $doms.menuCover = $('#menu-cover').on(_CLICK_, function()
            {
                self.close();
            });

            $doms.btnIndex = $doms.menuContainer.find(".button:nth-child(1)").on(_CLICK_, function()
            {
                ga("send", "event", "選單", "按鈕點擊", "首頁");
                SceneHandler.toHash("/Index");
                self.close();
            });

            $doms.btnParticipate = $doms.menuContainer.find(".button:nth-child(3)").on(_CLICK_, function()
            {
                ga("send", "event", "選單", "按鈕點擊", "我要投稿");
                Main.loginFB('/Participate');
                self.close();
            });

            $doms.btnEntries = $doms.menuContainer.find(".button:nth-child(5)").on(_CLICK_, function()
            {
                ga("send", "event", "選單", "按鈕點擊", "作品瀏覽+投票");
                SceneHandler.toHash("/Entries");
                self.close();
            });

            $doms.btnReviewer = $doms.menuContainer.find(".button:nth-child(7)").on(_CLICK_, function()
            {
                ga("send", "event", "選單", "按鈕點擊", "評審陣容");
                SceneHandler.toHash("/Reviewers");
                self.close();
            });

            $doms.btnRule = $doms.menuContainer.find(".button:nth-child(9)").on(_CLICK_, function()
            {
                ga("send", "event", "選單", "按鈕點擊", "活動辦法");
                SceneHandler.toHash("/Rule");
                self.close();
            });

            $doms.btnWinners = $doms.menuContainer.find(".button:nth-child(11)").on(_CLICK_, function()
            {
                ga("send", "event", "選單", "按鈕點擊", "得獎名單");
                alert("單元尚未開放, 敬請期待");
                //SceneHandler.toHash("/Winners");
                //self.close();
            });

            $doms.btnTShow = $doms.menuContainer.find(".button:nth-child(13)").on(_CLICK_, function()
            {
                ga("send", "event", "選單", "按鈕點擊", "班服展");
                SceneHandler.toHash("/TShow");
                self.close();
            });

            setupIcon();
        },

        open: function()
        {
            if(_isOpen) return;
            _isOpen = true;

            self.update();
        },

        close: function()
        {
            if(!_isOpen) return;
            _isOpen = false;

            self.update();

        },

        update: function()
        {
            $doms.menuContainer.toggleClass("open-mode", _isOpen);

            $doms.menuCover.toggleClass("active-mode", _isOpen);
        },

        resize: function()
        {

        }

    };

    function setupIcon()
    {
        var $icon = $doms.container.find(".menu-icon"),
            $bar1 = $icon.find(".bar-1"),
            $bar2 = $icon.find(".bar-2"),
            $bar3 = $icon.find(".bar-3"),
            bars = [$bar1[0], $bar2[0], $bar3[0]];

        //console.log($icon.length);

        var duration = .35;

        var tl = _iconTL = new TimelineMax({paused:true});

        tl.set(bars, {transformOrigin:"50% 50%"});

        tl.to($bar2,duration,{rotation:45, scaleX:1, marginTop: -6+15, marginLeft: -12}, 0);
        tl.to($bar3,duration,{rotation:-45, scaleX:1, marginTop:-6, marginLeft: 12}, 0);

        tl.to($bar1,duration,{rotation:90, marginTop: 15}, 0);

        $icon.on('mouseover', function()
        {
            _iconTL.play();
        });

        $icon.on('mouseout', function()
        {
            _iconTL.reverse();
        });
    }

}());
