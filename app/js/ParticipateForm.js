(function ()
{
    var $doms = {},
        _isInit = false;

    var self = window.ParticipateForm =
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
                        {url: "_participate_form.html", startWeight: 0, weight: 100, dom: null}
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


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#participate-form");

        $doms.btnSend = $doms.container.find(".btn-send").on(_CLICK_, function()
        {
            trySend();
        });

        $doms.fields =
        {
            schoolName: $doms.container.find(".field-school-name"),
            className: $doms.container.find(".field-class-name"),
            userName: $doms.container.find(".field-user-name"),
            phone: $doms.container.find(".field-phone"),
            email: $doms.container.find(".field-email"),
            ruleCheck: $doms.container.find('#participate-form-checkbox')
        };

        self.Success.init($('#participate-form-success'));

        $doms.container.detach();
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
        self.Success.hide();

        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

    /* send */

    function reset()
    {
        $doms.fields.schoolName.val('');
        $doms.fields.className.val('');
        $doms.fields.userName.val('');
        $doms.fields.phone.val('');
        $doms.fields.email.val('');
        $doms.fields.ruleCheck[0].checked = false;
    }

    function trySend()
    {
        var formObj = checkForm();
        //var formObj = {};

        if(formObj)
        {
            var canvas, imageData;


            canvas = Participate.getRawCanvas();

            if(canvas)
            {
                imageData = canvas.toDataURL("image/jpeg", .95).replace(/^data:image\/jpeg;base64,/, "");

                formObj.image_data = imageData;
                formObj.description = Participate.getDescriptionInput();

                Loading.progress('資料傳輸中 ... 請稍候').show();

                ApiProxy.callApi("participate", formObj, true, function(response)
                {
                    if(response.error)
                    {
                        alert(response.error);
                    }
                    else
                    {
                        self.Success.setShareEntrySerial(response.serial);
                        self.Success.show();
                    }

                    Loading.hide();
                });

            }
            else
            {
                alert('lack image data');
            }
        }
    }

    function checkForm()
    {
        var formObj={};
        var dom;

        if(!$doms.fields.ruleCheck.prop("checked"))
        {
            alert('您必須同意 "授權主辦單位使用本人個人資料" 才能參加活動');
            return;
        }

        dom = $doms.fields.schoolName[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入學校名稱'); dom.focus(); return;
        }else formObj.school_name = dom.value;

        dom = $doms.fields.className[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入您的班級(系級)'); dom.focus(); return;
        }else formObj.class_name = dom.value;

        dom = $doms.fields.userName[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入您的名稱'); dom.focus(); return;
        }else formObj.user_name = dom.value;

        dom = $doms.fields.phone[0];
        if(!PatternSamples.phone.test(dom.value))
        {
            alert('請輸入正確的手機號碼'); dom.focus(); return;
        }
        else formObj.phone = dom.value;

        dom = $doms.fields.email[0];
        if(!PatternSamples.email.test(dom.value))
        {
            alert('請輸入您的電子郵件信箱'); dom.focus(); return;
        }
        else formObj.email = dom.value;

        formObj.fb_uid = FBHelper._uid;
        formObj.fb_token = FBHelper._token;

        return formObj;

    }


}());