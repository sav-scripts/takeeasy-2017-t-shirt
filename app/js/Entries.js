(function ()
{
    var $doms = {},
        _keyword,
        _isLocking,
        _isActive = false,
        _pageSize = 10,
        _currentData,
        _sortType = "date",
        _isFirstSearchExecuted = false,
        _lastSearchSetting,
        _lastResponse,
        _isInit = false;

    var self = window.Entries =
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
                        {url: "_entries.html", startWeight: 0, weight: 100, dom: null}
                    ];

                SceneHandler.loadTemplate(null, templates, function loadComplete()
                {
                    build(templates);
                    _isInit = true;
                    cb.apply(null);
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

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize();

        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .4, {autoAlpha: 1});
        tl.add(function ()
        {
            active();



            if(!_isFirstSearchExecuted)
            {
                _isFirstSearchExecuted = true;
                $doms.keywordInput.val('');
                _keyword = '';
                doSearch(0, true);
            }

            //checkFirstEntry();


            cb.apply();
        });
    }

    function hide(cb)
    {
        disactive();

        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#entries");

        self.Creator.init($doms.container.find('.entries-container'));

        self.DialogReviewing.init($('#dialog-reviewing'));
        self.DialogUnapproved.init($('#dialog-unapproved'));

        $doms.keywordInput = $doms.container.find(".search-input").on("keyup", function(event)
        {
            if(event.keyCode == 13)
            {
                $doms.btnSearchName.click();
            }
        });

        $doms.btnSearchName = $doms.container.find(".btn-search-name").on("click", function()
        {
            if(_isLocking) return;

            var v = $doms.keywordInput.val();

            //$doms.keywordInput.val('');

            if(!PatternSamples.onlySpace.test(v))
            {
                _keyword = v;
                doSearch(0, true);
            }


        });

        $doms.btnSearchSerial = $doms.container.find(".btn-search-serial").on("click", function()
        {
            if(_isLocking) return;


            var v = parseInt($doms.keywordInput.val());

            if(!isNaN(v))
            {
                _keyword = v;

                $doms.keywordInput.val('');
                doSearch(0, true, null, true);
            }
            else
            {
                alert('請輸入數字編碼');
            }
        });

        $doms.btnSortByDate = $doms.container.find(".tab-latest").on("click", function()
        {
            if(_isLocking) return;

            changeSortType("date");
        });

        $doms.btnSortByRank = $doms.container.find(".tab-popular").on("click", function()
        {
            if(_isLocking) return;

            changeSortType("votes");
        });

        $doms.bottomBleed = $doms.container.find(".bleed");


        $doms.container.detach();
    }

    /* active scroll listening */
    function active()
    {
        _isActive = true;

        $(window).on('scroll', updateScrollTop);
    }

    function disactive()
    {
        _isActive = false;

        $(window).unbind('scroll', updateScrollTop);
    }


    function updateScrollTop()
    {
        if(_isLocking) return;
        if(!_isActive) return;

        var bleedBottom = $doms.bottomBleed[0].getBoundingClientRect().bottom - 40,
            windowBottom = Main.viewport.height;

        //console.log(windowBottom);

        if(bleedBottom < windowBottom)
        {
            if(_lastResponse)
            {
                var numPages = parseInt(_lastResponse.num_pages),
                    lastPageIndex = parseInt(_lastResponse.page_index),
                    nextPageIndex = lastPageIndex + 1;

                if(nextPageIndex < numPages)
                {
                    doSearch(nextPageIndex, false, null, false);
                }
            }
        }


    }

    /* search functions */
    function doSearch(pageIndex, isNewSearch, oldPageIndex, isSearchSerial)
    {
        if(!_isActive) return;
        if(_isLocking) return;
        _isLocking = true;

        if(isNewSearch)
        {
            self.Creator.clear();
            _lastResponse = null;
        }

        //console.log('searching on page: ' + pageIndex);

        loadingShow();

        //return;

        var serachingKeyword = _keyword;

        var params =
        {
            "keyword": _keyword,
            "search_type": isSearchSerial? "serial": "user_name",
            "status": isSearchSerial? "": "approved",
            "sort_type": _sortType,
            "page_index": pageIndex,
            "page_size": _pageSize
        };

        if(isSearchSerial)
        {
            ApiProxy.callApi("entries_search", params, 'entries_search.serial', function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _lastResponse = response;

                    if(response.data.length == 0)
                    {
                        alert("很抱歉, 作品編號 ["+serachingKeyword+"] 並不存在");
                    }
                    else
                    {
                        var dataObj = response.data[0];
                        if(dataObj.status == 'approved')
                        {
                            self.Creator.insertEntries(response.data, true);
                        }
                        else if(dataObj.status == 'reviewing')
                        {
                            Entries.DialogReviewing.show();
                        }
                        else if(dataObj.status == 'unapproved')
                        {
                            Entries.DialogUnapproved.show();
                        }
                    }
                }

                loadingHide();
                _isLocking = false;
            });
        }
        else
        {
            _lastSearchSetting = params;

            ApiProxy.callApi("entries_search", params, 'entries_search', function(response)
            {
                if(response.error)
                {
                    alert(response.error);
                }
                else
                {
                    _lastResponse = response;

                    self.Creator.insertEntries(response.data);
                    _isLocking = false;
                }

                loadingHide();
            });
        }
    }

    function changeSortType(newType)
    {
        if(newType == _sortType) return;
        if(_isLocking) return;

        _sortType = newType;

        if(_sortType == "date")
        {
            $doms.btnSortByDate.toggleClass("active-mode", true);
            $doms.btnSortByRank.toggleClass("active-mode", false);
        }
        else
        {
            $doms.btnSortByDate.toggleClass("active-mode", false);
            $doms.btnSortByRank.toggleClass("active-mode", true);
        }

        //_keyword = $doms.keywordInput.val();
        doSearch(0, true);
    }


    function loadingShow()
    {
        //$doms.loadingHint.css("display", "block");
        //$doms.pageIndexContainer.css("display", "none");
        //
        //$doms.arrowLeft.css("visibility", "hidding");
        //$doms.arrowRight.css("visibility", "hidding");

        $doms.bottomBleed.toggleClass('active-mode', true);

        //Loading.progress('').show();
    }

    function loadingHide()
    {
        //$doms.arrowLeft.css("visibility", "visible");
        //$doms.arrowRight.css("visibility", "visible");
        //
        //var array = [$doms.arrowLeft, $doms.arrowRight, $doms.pageIndexContainer];
        //
        //var tl = new TimelineMax;
        //tl.set(array, {opacity:0});
        //tl.to(array,.4, {opacity:1});
        //
        //$doms.loadingHint.css("display", "none");
        //$doms.pageIndexContainer.css("display", "block");

        $doms.bottomBleed.toggleClass('active-mode', false);

        //Loading.hide();

    }

}());

(function(){

    var $_sample,
        $_container,
        _isOpen = false,
        _entryList = [];

    var self = window.Entries.Creator =
    {
        init: function($container)
        {
            $_container = $container;
            $_sample = $container.find(".entry").detach();

            //self.insertEntries();

        },

        insertEntries: function(dataList, openDescription)
        {
            var i;

            for(i=0;i<dataList.length;i++)
            {
                self.createOne(dataList[i], openDescription);
            }
        },

        createOne: function(data, openDescription)
        {
            var entry = new Entries.Entry($_sample, $_container, openDescription);
            entry.applyData(data);
            _entryList.push(entry);
        },

        clear: function()
        {
            var i, entry;
            for(i=0;i<_entryList.length;i++)
            {
                entry = _entryList[i];
                entry.destroy();
            }

            _entryList = [];
        }

    };

}());

(function(){

    var Entry = window.Entries.Entry = function($_sample, $_container, openDescription)
    {
        var self = this;

        var $dom = self.$dom = $_sample.clone();
        $_container.append($dom);

        $dom.find(".btn-switch").on(_CLICK_, switchDescription);

        function switchDescription()
        {
            self._isOpen = !self._isOpen;
            self.$dom.toggleClass('open-mode', self._isOpen);
        }

        if(openDescription) switchDescription();
    };

    Entry.prototype =
    {
        _isOpen: false,
        $dom: null,
        $divLine: null,
        $description: null,

        applyData: function(data)
        {
            this.$dom.find(".num-votes").text(data.num_votes);
            this.$dom.find(".school-name").text(data.school_name);
            this.$dom.find(".class-name").text(data.class_name);
            this.$dom.find(".user-name").text(data.user_name);

            this.$dom.find(".description").text(data.description);

            this.$dom.find('.btn-vote').on(_CLICK_, function()
            {
                Main.loginFB(null, null, function()
                {
                    VoteForm.setVotingSerial(data.serial);
                    SceneHandler.toHash("/VoteForm");
                });
            });

            var self = this;

            var img = new Image();
            img.onload = function()
            {
                self.$dom.find(".thumb").append(img);
                TweenMax.from(img,.5,{autoAlpha:0});
            };
            img.src = data.thumb_url;
        },

        destroy: function()
        {
            this.$dom.detach();
        }
    };

}());