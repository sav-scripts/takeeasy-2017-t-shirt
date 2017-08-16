(function(){

    "use strict";
    var self = window.Main =
    {
        localSettings:
        {
            fb_appid: "141103743143422"
        },

        settings:
        {
            isLocal: false,
            isMobile: false,

            useFakeData: false,
            debug: false,

            fb_appid: "1876517482676293",
            fbPermissions: [],

            fbToken: null,
            fbUid: null,

            fbState: null,

            isiOS: false,
            isLineBrowser: false,

            isEnd: false,
            endMessage: '活動已經結束，感謝您的參與'
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
            "/ParticipateForm",
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
                if(Utility.urlParams.debug == '1') Main.settings.debug = true;
            }


            self.settings.isLineBrowser = Boolean(navigator.userAgent.match('Line'));

            self.settings.isiOS = Utility.isiOS();
            window._CLICK_ = (self.settings.isiOS)? "touchend": "click";

            Menu.init();


            FBHelper.init(Main.settings.fb_appid,
            {
                useRedirectLogin: (Main.settings.isiOS || Main.settings.isLineBrowser)
            });

            startApp();

            $(window).on("resize", onResize);
            onResize();

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
                    },

                    hashChangeTester: function(hashName)
                    {
                        if(!Main.settings.debug)
                        {
                            if(hashName == '/Participate')
                            {
                                if(!FBHelper._token)
                                {
                                    //console.log("no token");
                                    SceneHandler.setHash(Main.defaultHash);
                                    return null;
                                }
                            }
                        }

                        if(hashName == '/ParticipateForm')
                        {
                            if(!Main.settings.debug)
                            {
                                if(!Participate.getIsReadySend() || !FBHelper._token)
                                {
                                    SceneHandler.setHash(Main.defaultHash);
                                    return null;
                                }
                            }
                        }

                        if(hashName == '/Participate')
                        {
                            if(Main.settings.isEnd)
                            {
                                alert(Main.settings.endMessage);

                                SceneHandler.setHash(Main.defaultHash);
                                return null;
                            }


                            if(!Main.settings.debug && !FBHelper._token)
                            {
                                if(!FBHelper._token)
                                {
                                    SceneHandler.setHash(Main.defaultHash);
                                    return null;
                                }
                            }


                            if(!Modernizr.canvas)
                            {
                                alert('您的瀏覽器不支援 html5 canvas, 請使用其他的瀏覽器瀏覽此單元');
                                SceneHandler.setHash(Main.defaultHash);
                                return null;
                            }

                            if(self.settings.isLineBrowser)
                            {
                                alert('您的瀏覽器不支援上傳檔案, 請使用其他的瀏覽器瀏覽此單元');
                                SceneHandler.setHash(Main.defaultHash);
                                return null;
                            }
                        }

                        return hashName;
                    }
                });

                SceneHandler.toFirstHash();
            }
        },

        loginFB: function(nextHash, redirectUri)
        {
            Loading.progress("登入 facebook 中").show();

            FBHelper.loginFB(nextHash, redirectUri, function(error)
            {
                Loading.hide();

                if(error && error == 'unauthorized')
                {
                    alert('您必須登入 facebook 才能參加活動喔');
                }
                else if(error)
                {
                    alert(error);
                }
                else
                {
                    SceneHandler.toHash(nextHash);
                }
            });
        }
    };

    function onResize()
    {
        //var width = $(window).width(),
        //    height = $(window).height();
    }

}());
