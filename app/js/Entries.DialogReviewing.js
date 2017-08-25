(function(){

    var $container,
        $content,
        _tl,
        _isHiding = true,
        _shareEntrySerial;

    var self = window.Entries.DialogReviewing =
    {
        init: function($dom)
        {
            $container = $dom;

            $container.find(".btn-close").on(_CLICK_, function()
            {
                self.hide();
                SceneHandler.toHash("/Index");
            });

            $container.find(".btn-continue").on("click", function()
            {
                self.hide();
                SceneHandler.toHash("/Index");
            });

            $content = $container.find(".content");

            $container.detach();
        },

        setShareEntrySerial: function(serial)
        {
            _shareEntrySerial = serial;
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