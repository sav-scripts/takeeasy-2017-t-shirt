(function(){

    "use strict";
    var self = window.Main =
    {
        localSettings:
        {
            fb_appid: "1896326817270897"
        },

        settings:
        {
            isLocal: false,
            isMobile: false,

            useFakeData: false,

            fb_appid: "",
            fbPermissions: [],

            fbToken: null,
            fbUid: null,

            fbState: null,

            isiOS: false,
            isLineBrowser: false
        },

        viewport:
        {
            width: 0,
            height: 0,
            ranges: [640],
            index: -1,
            changed: false
        },

        hashArray:
        [
            "/Index",
            "/Participate",
            //"/Entries",
            //"/Reviewer",
            //"/Rule",
            //"/Winners",
            //"/TShow"
        ],

        defaultHash: '/Index',

        init: function()
        {
            if( window.location.host == "local.savorks.com" || window.location.host == "socket.savorks.com")
            {
                $.extend(self.settings, self.localSettings);
                Main.settings.isLocal = true;

                if(Utility.urlParams.usefakedata == '1') Main.settings.useFakeData = true;
            }


            self.settings.isLineBrowser = Boolean(navigator.userAgent.match('Line'));

            self.settings.isiOS = Utility.isiOS();
            window._CLICK_ = (self.settings.isiOS)? "touchend": "click";

            Menu.init();

            $(window).on("resize", onResize);
            onResize();

            startApp();

            function startApp()
            {
                SceneHandler.init(Main.hashArray,
                {
                    defaultHash: self.defaultHash,
                    listeningHashChange: true,
                    loadingClass: Loading,
                    version: new Date().getTime(),

                    cbBeforeChange: function()
                    {
                        Menu.close();
                    },

                    cbBeforeStageIn: function(newHash)
                    {
                        var useFixSize = newHash != '/Entries';
                        $("#scene-container").toggleClass("fix-size-mode", useFixSize);
                    }
                });

                SceneHandler.toFirstHash();
            }
        }
    };

    function onResize()
    {
        //var width = $(window).width(),
        //    height = $(window).height();
    }

}());
