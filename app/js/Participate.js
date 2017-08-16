(function ()
{
    var $doms = {},
        _defaultDescription = '請輸入作品說明(至少 20 字元, 最多 120 字元)',
        _isInit = false,
        _imageInput = {},
        _isImageReady = false,
        _isDescriptionReady = false,
        _isRuleConfirmed = false,
        _imageSetting =
        {
            raw: {w:7086, h:3543},
            preview: {w:456, h:228},
            thumb: {w:456, h:228}
        };

    var self = window.Participate =
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
                        {url: "_participate.html", startWeight: 0, weight: 100, dom: null}
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

        },


        getDescriptionInput: function()
        {
            var text = $doms.textArea.val();
            if(text == $doms.textArea.defaultText) text = '';
            return text;
        },

        getRawCanvas: function()
        {
            return self.getCanvas("raw");
        },

        getPreviewCanvas: function()
        {
            return self.getCanvas("preview");
        },

        getThumbCanvas: function()
        {
            return self.getCanvas("thumb");
        },

        getImage: function()
        {
            return _imageInput.image;
        },

        getCanvas: function(keyword)
        {
            var canvasName = keyword + "Canvas";
            if(!_imageInput[canvasName])
            {
                if(!_imageInput.image) return null;

                var size = _imageSetting[keyword];
                _imageInput[canvasName] = Helper.imageToCanvas(_imageInput.image, size.w, size.h);

                //_imageInput[canvasName].className = "canvas-test";
                //$("#scene-container").append(_imageInput[canvasName]);
            }

            return _imageInput[canvasName];

        },

        getIsInit: function()
        {
            return _isInit;
        },

        getIsReadySend: function()
        {
            return Boolean(_isImageReady && _isRuleConfirmed && _isDescriptionReady);
        },

        reset: function()
        {
            $doms.textArea.val(_defaultDescription);
            clearImage();
        }
    };


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#participate");


        setupDescription();
        setupImageInput();

        self.DialogIsReady.init($("#dialog-is-ready"));

        $doms.btnSend = $doms.container.find(".btn-send").on(_CLICK_, function()
        {

            if(!_isImageReady)
            {
                alert("請先選擇欲上傳的圖片");
            }
            else if(!_isDescriptionReady)
            {
                alert("請輸入 20 個字元以上的作品說明");
            }
            else if(!_isRuleConfirmed)
            {
                alert("您必須同意我們的活動辦法");
            }
            else
            {
                SceneHandler.toHash("/ParticipateForm");
            }


            //self.reset();
        });

        $doms.ruleCheckbox = $doms.container.find("#upload-checkbox").on("change", function()
        {
            update();
        });

        update();

        $doms.container.detach();
    }

    function update()
    {
        _isImageReady = self.getImage()? true: false;
        _isDescriptionReady = (self.getDescriptionInput().length >= 20);
        _isRuleConfirmed = $doms.ruleCheckbox[0].checked;

        var activeBtnSend = (_isImageReady && _isDescriptionReady && _isRuleConfirmed);

        $doms.btnSend.toggleClass("disactivated", !activeBtnSend);
    }

    function setupDescription()
    {
        $doms.textArea = $doms.container.find(".description");

        $doms.textArea.val(_defaultDescription);

        $doms.textArea.on("blur", function()
        {
            var v = $doms.textArea.val();
            if(PatternSamples.onlySpace.test(v))
            {
                $doms.textArea.val(_defaultDescription);
            }
        }).on('focus', function()
        {
            var v = $doms.textArea.val();
            if(v === _defaultDescription) $doms.textArea.val('');
        }).on("input propertychange", function()
        {
            update();
        });
    }

    function setupImageInput()
    {
        $doms.previewContainer = $doms.container.find(".preview");

        var inputDom = $doms.container.find(".image-input")[0];

        $doms.btnSelectImage = $doms.container.find(".btn-upload").on("click",   function()
        {
            inputDom.value = null;
            inputDom.click();
        });



        $(inputDom).on("change", function()
        {
            Loading.progress('empty').show();
            loadFile(inputDom, function()
            {
                update();
                Loading.hide();
            });

        });

        function loadFile(inputDom, cb)
        {
            if (inputDom.files && inputDom.files[0])
            {

                //console.log(_imageInput.input.files[0].size);
                var reader = new FileReader();

                reader.onload = function (event)
                {
                    loadImg(event.target.result, cb);
                };

                reader.readAsDataURL(inputDom.files[0]);
            }
        }

        function loadImg(src, cb)
        {
            clearImage();

            _imageInput.image = document.createElement("img");

            _imageInput.image.onload = function()
            {
                if(_imageInput.image.width != _imageSetting.raw.w || _imageInput.image.height != _imageSetting.raw.h)
                {
                    var string = "您所上傳的圖片尺寸 ( "+_imageInput.image.width+"px X "+_imageInput.image.height+"px ) "+
                        "和我們的作品規格 ( "+_imageSetting.raw.w+"px X "+_imageSetting.raw.h+"px ) 不同\n\n將自動裁切或縮放, 請預覽圖片確定內容是否正確.";
                    alert(string);
                }

                //console.log(self.getRawCanvas().toDataURL("image/jpeg", .95).replace(/^data:image\/jpeg;base64,/, ""));

                var previewCanvas = self.getPreviewCanvas();
                $doms.previewContainer.append(previewCanvas);

                if(cb) cb.call();
            };

            _imageInput.image.src = src;
        }
    }

    function clearImage()
    {
        if(_imageInput.image)
        {
            $(_imageInput.image).detach();
            _imageInput.image = null;
        }
        if(_imageInput.rawCanvas)
        {
            $(_imageInput.rawCanvas).detach();
            _imageInput.rawCanvas = null;
        }
        if(_imageInput.previewCanvas)
        {
            $(_imageInput.previewCanvas).detach();
            _imageInput.previewCanvas = null;
        }
        if(_imageInput.thumbCanvas)
        {
            $(_imageInput.thumbCanvas).detach();
            _imageInput.thumbCanvas = null;
        }
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
            self.DialogIsReady.show();
            cb.apply();
        });
    }

    function hide(cb)
    {
        self.DialogIsReady.hide();

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

    var $container,
        $content,
        _tl,
        _isHiding = true;

    var self = window.Participate.DialogIsReady =
    {
        init: function($dom)
        {
            $container = $dom;

            $container.find(".btn-close").on(_CLICK_, function()
            {
                self.hide();
            });

            $container.find(".btn-yes").on(_CLICK_, function()
            {
                self.hide();
            });

            $container.find(".btn-no").on(_CLICK_, function()
            {
                self.hide();
            });

            $content = $container.find(".container");


            $container.detach();
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