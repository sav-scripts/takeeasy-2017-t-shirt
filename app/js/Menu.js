(function(){

    var $doms = {},
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

}());
