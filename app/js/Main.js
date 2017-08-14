(function(){

    "use strict";
    var self = window.Main =
    {
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
            "/Index"
        ],

        defaultHash: '/Index',

        init: function()
        {
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
                    version: new Date().getTime()
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
