(function ()
{
    var $doms = {},
        _isInit = false;

    var self = window.Index =
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
                        {url: "_index.html", startWeight: 0, weight: 40, dom: null}
                    ];

                SceneHandler.loadTemplate(null, templates, function loadComplete()
                {
                    build(templates, function()
                    {
                        _isInit = true;
                        Loading.hide();
                        cb.apply(null);
                    });
                }, true, false);
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


    function build(templates, cb)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#index");

        $doms.container.find(".btn-participate").on(_CLICK_, function()
        {
            SceneHandler.toHash("/Participate");
        });

        $doms.container.find(".btn-to-entries").on(_CLICK_, function()
        {
            SceneHandler.toHash("/Entries");
        });

        self.Examples.init($doms.container.find(".examples"), function()
        {

            $doms.container.detach();
            cb.call();
        });
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
            cb.apply();
        });
    }

    function hide(cb)
    {
        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

}());

(function(){

    var _startWeight = 60,
        _myWeigtht = 40,
        _currentIndex = 0,
        _numExamples = 0,
        _exampleList,
        _exampleImages = [],
        _currentImage,
        _isLocking = true;

    var self = window.Index.Examples =
    {
        init: function($container, cb)
        {
            var $exampleContainer = $container.find(".user-example");

            $container.find(".arrow-prev").on(_CLICK_, function()
            {
                if(_isLocking) return;

                var index = _currentIndex - 1;
                if(index < 0) index = _numExamples - 1;
                toIndex(index, -1);
            });

            $container.find(".arrow-next").on(_CLICK_, function()
            {
                if(_isLocking) return;

                var index = _currentIndex + 1;
                if(index >= _numExamples) index = 0;
                toIndex(index, 1);

            });

            ApiProxy.callApi('index_get_examples', {}, true, function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _exampleList = response.examples;
                    _numExamples = _exampleList.length;
                    loadImages(function()
                    {
                        setup();
                        cb.call();
                    });
                }
            });

            function setup()
            {
                _isLocking = false;
                toIndex(0, 0, true);
            }

            function loadImages(cb)
            {
                var index = 0;

                loadOne();

                function loadOne()
                {
                    if(index >= _exampleList.length)
                    {
                        cb.call();
                        return;
                    }

                    var img = new Image();
                    img.onload = function()
                    {
                        index++;

                        _exampleImages.push(img);

                        var progress = parseInt(_startWeight + _myWeigtht * (index / _numExamples)) / 100;
                        Loading.progress(progress);

                        loadOne();
                    };

                    img.src = _exampleList[index];
                }
            }

            function toIndex(index, direction, forceExecute)
            {
                if(direction === undefined) direction = 0;
                if(_isLocking) return;
                if(!forceExecute && index === _currentIndex) return;

                _isLocking = true;

                _currentIndex = index;

                var oldImage = _currentImage;
                _currentImage = _exampleImages[_currentIndex];

                var offsetX = 100 * direction;

                if(oldImage)
                {
                    TweenMax.to(oldImage,.5,{opacity: 0, left: -offsetX, onComplete: function()
                    {
                        $(oldImage).detach();
                    }});
                }

                $exampleContainer.append(_currentImage);

                var tl = new TimelineMax;
                tl.set(_currentImage, {opacity: 0, left: offsetX});

                tl.to(_currentImage,.5,{opacity: 1, left: 0});
                tl.add(function()
                {
                    _isLocking = false;
                })

            }
        }
    };

}());