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
                SceneHandler.toHash("/Index");
                self.close();
            });

            $doms.btnParticipate = $doms.menuContainer.find(".button:nth-child(3)").on(_CLICK_, function()
            {
                //SceneHandler.toHash("/Participate");
                Main.loginFB('/Participate');
                self.close();
            });

            $doms.btnEntries = $doms.menuContainer.find(".button:nth-child(5)").on(_CLICK_, function()
            {
                SceneHandler.toHash("/Entries");
                self.close();
            });

            $doms.btnReviewer = $doms.menuContainer.find(".button:nth-child(7)").on(_CLICK_, function()
            {
                SceneHandler.toHash("/Reviewers");
                self.close();
            });

            $doms.btnRule = $doms.menuContainer.find(".button:nth-child(9)").on(_CLICK_, function()
            {
                SceneHandler.toHash("/Rule");
                self.close();
            });

            $doms.btnWinners = $doms.menuContainer.find(".button:nth-child(11)").on(_CLICK_, function()
            {
                alert("單元尚未開放, 敬請期待");
                //SceneHandler.toHash("/Winners");
                //self.close();
            });

            $doms.btnTShow = $doms.menuContainer.find(".button:nth-child(13)").on(_CLICK_, function()
            {
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
