  (function($) {
    /* a fun little plugin.
      options:  fade_in
                fade_out
                no_background

      call $(selector).loading_overlay(options); to start
      call $(selector).loading_overlay('stop'); to stop */
    var plugin_name = 'loading_overlay';
    var percentage;
    var methods = {
      init: function(options) {
        return this.each(function() {
          var $this = $(this),
            data = $this.data(plugin_name);
          // If the plugin hasn't been initialized yet
          if (!data) {
            var divs = [];
            var overlay = $('<div/>')
              .css({
              'position': 'absolute',
              'top': 0,
              'bottom': 0,
              'left': 0,
              'right': 0,
              'background-color': "#bbbbbb",
              'zIndex': 5000,
              'opacity': (options && options.no_background === true) ? 0 : 0.5
            })
              .attr({
              'class': 'loading_overlay'
            })
            .appendTo($this);
            divs.push(overlay);

            if(options && options.title){
              var title = $('<div/>')
                .addClass('loading_overlay_title')
                .text(options.title)
                .css({
                  'position': 'absolute',
                  'zIndex': 5001,
                  'top': $this.height() / 2 - 32 - 32,
                  'opacity': 1
                })
                .appendTo($this);
                divs.push(title);
            }
            if(options && options.show_percentage){
              percentage = $('<div/>')
                .addClass('loading_overlay_percentage')
                .text('0%')
                .css({
                  'position': 'absolute',
                  'zIndex': 5001,
                  'top': $this.height() / 2 + 32 + 12,
                  'opacity': 1
                })
                .appendTo($this);
                divs.push(percentage);
            }
            var spinner = $('<div/>')
              .addClass('loading_spinner')
              .css({
                'position': 'absolute',
                'zIndex': 5001,
                'left': $this.width() / 2 - 32,
                'top': $this.height() / 2 - 32,
                'width': 64,
                'height': 64,
                'background-image': 'url(file-spinner-octo.gif)',
                'background-repeat': 'no-repeat',
                'opacity': 1
              })
              .appendTo($this);
            divs.push(spinner);

            if (options && options.fade_in === true) {
              _.each(divs, function(e){
                e.hide().fadeIn();
              });
            }

            $(this).data(plugin_name, {
              target: $this,
              divs: divs,
              options: options
            });
          }
        });
      },
      stop: function() {
        return this.each(function() {

          var $this = $(this),
            data = $this.data(plugin_name);

          if (data && data.options && data.options.fade_out === true) {
            $.when.apply($, $.map(data.divs, function(e) {
              return e.stop().fadeOut().promise();
            }))
              .done(function() {
              $(data.divs).each(function(i, e) {
                e.remove();
              });
              $this.removeData(plugin_name);
              if (data.options.finished) data.options.finished();
            });
          } else if (data) {

            $(data.divs).each(function(i, e) {
              e.remove();
            });
            $this.removeData(plugin_name);
            if (data.options && data.options.finished) data.options.finished();
          }
        });
      },
      percentage: function(value) {
        if(percentage){
            percentage.text(value.toFixed(0)+'%');
        }
      }
    };

    $.fn[plugin_name] = function(method) {
      // Method calling logic
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('Method ' + method + ' does not exist');
      }
    };

  })(jQuery);