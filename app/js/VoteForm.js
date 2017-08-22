(function ()
{
    var $doms = {},
        _votingSerial = null,
        _isInit = false;

    var self = window.VoteForm =
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
                        {url: "_vote_form.html", startWeight: 0, weight: 100, dom: null}
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

        setVotingSerial: function(serial)
        {
            _votingSerial = serial;
        },

        getVotingSerial: function()
        {
            return _votingSerial;
        },

        resize: function ()
        {

        }
    };


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#vote-form");

        $doms.btnSend = $doms.container.find(".btn-send").on(_CLICK_, function()
        {
            ga("send", "event", "投票表單", "按鈕點擊", "確認送出");
            trySend();
        });

        $doms.fields =
        {
            userName: $doms.container.find(".field-user-name"),
            phone: $doms.container.find(".field-phone"),
            email: $doms.container.find(".field-email"),
            ruleCheck: $doms.container.find('#participate-form-checkbox')
        };

        self.Success.init($('#vote-form-success'));
        self.ShareSuccess.init($('#vote-form-share-success'));

        //self.Success.show();

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
        //$doms.fields.userName.val('');
        //$doms.fields.phone.val('');
        //$doms.fields.email.val('');
        //$doms.fields.ruleCheck[0].checked = false;

        _votingSerial = null;
    }

    function trySend()
    {
        var formObj = checkForm();
        //var formObj = {};

        if(formObj)
        {
            if(_votingSerial === null)
            {
                alert('lack voting serial');
            }
            else
            {
                formObj.serial = _votingSerial;

                Loading.progress('資料傳輸中 ... 請稍候').show();


                ApiProxy.callApi("entries_vote", formObj, true, function(response)
                {
                    console.log(JSON.stringify(response));
                    if(response.error)
                    {
                        ga("send", "event", "投票表單", "資料送出失敗", response.error);
                        alert(response.error);
                    }
                    else
                    {
                        ga("send", "event", "投票表單", "資料送出失敗", _votingSerial);
                        VoteForm.Success.setShareEntrySerial(_votingSerial);
                        VoteForm.Success.setShareUrl(response.share_url);
                        VoteForm.Success.setAvaiableVotes(response.avaiable_votes);

                        reset();

                        VoteForm.Success.show();
                    }

                    Loading.hide();
                });
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

        dom = $doms.fields.userName[0];
        if(PatternSamples.onlySpace.test(dom.value))
        {
            alert('請輸入您的名稱'); dom.focus(); return;
        }else formObj.name = dom.value;

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