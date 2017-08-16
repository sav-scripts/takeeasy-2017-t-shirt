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
                window.open("http://uniform.wingzero.tw/generators/clothes", '_blank');
                self.hide();
            });

            $content = $container.find(".content");


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