(function(){

    var self = window.FBHelper =
    {
        _appId: null,
        _uid: null,
        _uname: null,
        _token: null,

        settings:
        {
            useRedirectLogin: false,
            permissions: []
        },

        init: function(appid, options, cb, onError, logLoginStatus)
        {

            var setting =
            {
                appId: appid,
                cookie: true,
                xfbml: true,
                status: false,
                version: "v2.8"
            };

            $.extend(self.settings, options);
    
            self._appId = setting.appId;
    
            window.fbAsyncInit = function()
            {
                FB.init(setting);
    
                if(logLoginStatus)
                {
                    FB.getLoginStatus(function(response) {
                        statusChangeCallback(response);
                    });
                }
    
                if(cb) cb.apply();
            };
    
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/zh_TW/sdk.js?v=1";
                fjs.parentNode.insertBefore(js, fjs);
    
                js.onerror = onError;
    
            }(document, 'script', 'facebook-jssdk'));
        },

        checkAccessToken: function()
        {
            if(location.hash.match("access_token") && location.hash.match("state"))
            {
                var string = location.hash.replace("#", "?");

                if(string)
                {
                    self._token = SiteUtils.getParameterByName("access_token", string);

                    var state = SiteUtils.getParameterByName("state", string);
                    window.location.hash = "#" + state;

                    removeFBParams(state);
                }
            }
        },

        loginFB: function(state, redirectUri, cb)
        {
            if(self._uid)
            {
                complete();
            }
            else
            {
                if(self.settings.useRedirectLogin)
                {
                    //doRedirectLogin(); return;

                    FB.getLoginStatus(function(response)
                    {
                        if (response.status === 'connected')
                        {
                            //checkPermissions(response.authResponse, true);
                            complete(response.authResponse);
                        }
                        else
                        {
                            doRedirectLogin();
                        }
                    });
                }
                else
                {
                    FB.login(function(response)
                        {
                            if(response.error)
                            {
                                complete(null, "登入 Facebook 失敗");
                            }
                            else if(response.authResponse)
                            {
                                complete(response.authResponse);
                            }
                            else
                            {
                                complete(null, 'unauthorized');
                            }
                        },
                        {
                            scope: Main.settings.fbPermissions,
                            return_scopes: true,
                            auth_type: "rerequest"
                        });
                }

            }

            function checkPermissions(authResponse, redirectToLogin)
            {
                FB.api('/me/permissions', function(response)
                {
                    if (response && response.data && response.data.length)
                    {

                        var i, obj, permObj = {};
                        for(i=0;i<response.data.length;i++)
                        {
                            obj = response.data[i];
                            permObj[obj.permission] = obj.status;
                        }

                        if (permObj.publish_actions != 'granted')
                        {
                            fail("您必須給予發佈權限才能製作分享影片");
                        }
                        else
                        {
                            complete(authResponse);
                        }
                    }
                    else
                    {
                        alert("fail when checking permissions");
                        Loading.hide();
                    }
                });

                function fail(message)
                {
                    alert(message);
                    //Loading.hide();
                    if(redirectToLogin) doRedirectLogin();
                }
            }

            function doRedirectLogin()
            {
                //console.log('do redirect login');

                if(Loading) Loading.hide();

                var uri = redirectUri?
                    encodeURI(redirectUrl):
                    encodeURI(window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace("?", ''));

                var url = "https://www.facebook.com/dialog/oauth?"+
                    "response_type=token"+
                    "&client_id="+Main.settings.fb_appid+
                    "&scope="+self.settings.permissions.join(",")+
                    "&state="+ state +
                    "&redirect_uri=" + uri;

                window.open(url, "_self");
            }


            function complete(authResponse, error)
            {
                if(authResponse)
                {
                    self._token = authResponse.accessToken;
                    self._uid = authResponse.userID;
                }

                //Loading.hide();
                if(cb) cb.call(null, error);
            }
        },

        getPublicProfile: function(cb)
        {
            FB.api('/me', function(response)
            {
                self._uname = response.name;
                cb.apply(null, [response]);
            });
        },

        checkLoginStatus: function(permissions, cb)
        {
            FB.getLoginStatus(function(response)
            {
                if (response.status === 'connected')
                {
                    if(permissions)
                    {
                        checkPermissions(response.authResponse);
                    }
                    else
                    {
                        cb.call(null, null, response.authResponse);
                    }
                }
                else
                {
                    //doRedirectLogin();
                    cb.call(null, {message:"no connect"}, null);
                }
            });

            function checkPermissions(authResponse)
            {
                var permissionDic = {},
                    necessaryCount = permissions.length,
                    matchedCount = 0;

                for(var i=0;i<permissions.length;i++)
                {
                    permissionDic[permissions[i]] = false;
                }

                FB.api('/me/permissions', function(response)
                {
                    if (response && response.data && response.data.length)
                    {

                        var i, obj;
                        for(i=0;i<response.data.length;i++)
                        {
                            obj = response.data[i];
                            if(permissionDic[obj.permission] !== undefined)
                            {
                                permissionDic[obj.permission] = true;
                                matchedCount++;
                            }
                        }

                        if(matchedCount < necessaryCount)
                        {
                            cb.call(null, {message:"lack permission", permissionDic: permissionDic}, null);
                        }
                        else
                        {
                            cb.call(null, null, authResponse);
                        }
                    }
                    else
                    {
                        cb.call(null, {message:"check permission fail"}, null);
                    }
                });
            }
        },

        postCanvasToFacebook: function(canvas, authToken, cb)
        {
            var imageData  = canvas.toDataURL("image/png");
            var blob;
            try{
                blob = dataURItoBlob(imageData);
            }catch(e){console.log(e);}
            var fd = new FormData();
            fd.append("access_token",authToken);
            fd.append("source", blob);
            //fd.append("message","Photo Text");
            try{
                $.ajax({
                    url:"https://graph.facebook.com/me/photos?access_token=" + authToken,
                    type:"POST",
                    data:fd,
                    processData:false,
                    contentType:false,
                    cache:false,
                    success:function(data){
                        //console.log("success " + data);
                        cb.call(null, null, data);
                    },
                    error:function(shr,status,data){
                        //console.log("error " + data + " Status " + shr.status);

                        cb.call(null, "error " + data + " Status " + shr.status);
                    },
                    complete:function(){
                        //console.log("Posted to facebook");
                    }
                })

            }catch(e){
                cb.call(null, e);
            }
        }
    };



    function removeFBParams(replaceWithHash)
    {
        if(history && history.replaceState)
        {
            var uri = SiteUtils.removeURLParameter(location.href, 'code');
            uri = SiteUtils.removeURLParameter(uri, 'state');

            var currentHash = window.location.hash.replace("#", "");
            uri = uri.replace('?#' + currentHash, '').replace('#' + currentHash, '');
            uri += "#" + replaceWithHash;

            window.history.replaceState({path: uri}, '', uri);
        }
    }

    // This is called with the results from from FB.getLoginStatus().
    function statusChangeCallback(response)
    {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
            console.log("connected");
        } else if (response.status === 'not_authorized') {
            console.log("not authorized");
        } else {
            console.log("not login");
        }
    }



    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/png' });
    }


}());

(function(){



    window.FBData = FBData;
    function FBData(api, apiParams, cbFetchComplete)
    {
        this.api = api;
        this.apiParams = apiParams;
        this.after = null;
        this.dataList = [];
        this.thereIsMore = true;
        this.cbFetchComplete = cbFetchComplete;
        this.lastFetchIndex = 0;
    }

    FBData.prototype.fetch = function()
    {
        var parent = this;

        if(!parent.thereIsMore)
        {
            console.log("warning: trying to fetch data where there is no more.");
            parent.cbFetchComplete.call(parent, parent.dataList);
        }

        parent.lastFetchIndex = parent.dataList.length;

        FB.api(parent.api, 'GET', parent.apiParams, function(response)
        {
            if(response.error)
            {
                console.error(response.error);
            }
            else
            {
                parent.dataList = parent.dataList.concat(response.data);

                parent.apiParams.after = Boolean(response.paging && response.paging.next)? response.paging.cursors.after: null;
                if(!parent.apiParams.after)
                {
                    delete parent.apiParams.after;
                    parent.thereIsMore = false;
                }
                else
                {
                    parent.thereIsMore = true;
                }

                parent.cbFetchComplete.call(parent, parent.dataList);
            }
        });

        return this;
    }

}());







