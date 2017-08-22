(function ()
{
    var $doms = {},
        _isInit = false,
        _isWeekBestMode = true,
        _isLocking = false,
        _weekBestList;

    var self = window.TShow =
    {
        stageIn: function (options, cb)
        {
            (!_isInit) ? loadAndBuild(execute) : execute();
            function execute(isFromLoad)
            {
                if (isFromLoad && options.cbContentLoaded) options.cbContentLoaded.call();
                show(cb);
            }

            function loadAndBuild(cb)
            {
                var templates =
                    [
                        {url: "_tshow.html", startWeight: 0, weight: 100, dom: null}
                    ];

                SceneHandler.loadTemplate(null, templates, function loadComplete()
                {
                    ApiProxy.callApi('get_weekly_best', {}, true, function(response)
                    {
                        if(response.error)
                        {
                            alert(response.error);
                        }
                        else
                        {
                            _weekBestList = response.examples;

                            if(_weekBestList.length == 0)
                            {
                                _weekBestList = ["./images/t-show-demo.png"];
                            }

                            build(templates);
                            _isInit = true;
                            cb.apply(null);
                        }
                    });
                }, 0);
            }
        },

        stageOut: function (options, cb)
        {
            hide(cb);
        },

        resize: function ()
        {

        }
    };


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#t-show");

        $doms.tabWeek = $doms.container.find(".tab-week").on(_CLICK_, function()
        {
            ga("send", "event", "班服展", "按鈕點擊", "每週佳作");
            switchTab(true);
        });
        $doms.tabWinners = $doms.container.find(".tab-winners").on(_CLICK_, function()
        {
            ga("send", "event", "班服展", "按鈕點擊", "獲獎班服");
            alert("得獎作品尚未選出, 盡情期待");
            //switchTab(false);
        });

        $doms.contentContainer = $doms.container.find(".container");

        addWeekBest();

        $doms.container.detach();
    }

    function switchTab(isWeekBest)
    {
        if(_isLocking) return;

        var oldisWeekBest = _isWeekBestMode;
        _isWeekBestMode = isWeekBest;

        if(oldisWeekBest === _isWeekBestMode) return;

        $doms.tabWeek.toggleClass('active-mode', _isWeekBestMode);
        $doms.tabWinners.toggleClass('active-mode', !_isWeekBestMode);

        clearContainer();

        _isWeekBestMode? addWeekBest(): addWinners();
    }

    function clearContainer()
    {
        $doms.contentContainer.empty();
    }

    function addWeekBest()
    {
        _isLocking = true;

        var index = 0;

        loadOne();
        function loadOne()
        {
            if(index >= _weekBestList.length)
            {
                _isLocking = false;
                return;
            }

            var image = new Image();

            image.onload = function()
            {
                $doms.contentContainer.append(image);
                TweenMax.from(image,.5,{autoAlpha:0});



                index++;
                loadOne();
            };

            image.src = _weekBestList[index];


        }


    }

    function addWinners()
    {

    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize();

        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .4, {autoAlpha: 1});
        tl.add(function ()
        {
            ScrollListener.active();
            cb.apply();
        });
    }

    function hide(cb)
    {
        ScrollListener.disactive();

        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

}());