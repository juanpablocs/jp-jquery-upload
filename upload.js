/**
 * Created by juanpablocs on 17/10/16.
 */
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {

    // abort if xhr progress is not supported
    if( !($.support.ajaxProgress = ("onprogress" in $.ajaxSettings.xhr()))) {
        return;
    }

    var _ajax = $.ajax;
    $.ajax = function ajax( url, options) {
        // If url is an object, simulate pre-1.5 signature
        if ( typeof( url) === "object" ) {
            options = url;
            url = options.url;
        }

        // Force options to be an object
        options = options || {};

        var deferred = $.Deferred();
        var _xhr = options.xhr || $.ajaxSettings.xhr;
        var jqXHR;
        options.xhr = function() {
            // Reference to the extended options object
            var options = this;
            var xhr = _xhr.call( $.ajaxSettings);
            if( xhr) {
                var progressListener = function( /*true | false*/upload) {
                    return function( event) {
                        /*
                         * trigger the global event.
                         * function handler( jqEvent, progressEvent, upload, jqXHR) {}
                         */
                        options.global && $.event.trigger( "ajaxProgress", [ event, upload, jqXHR]);

                        /*
                         * trigger the local event.
                         * function handler(jqXHR, progressEvent, upload)
                         */
                        $.isFunction( options.progress) && options.progress( jqXHR, event, upload);

                        deferred.notifyWith( jqXHR, [event, upload]);
                    };
                };

                xhr.upload.addEventListener( "progress", progressListener( true), false);
                xhr.addEventListener( "progress", progressListener( false), false);
            }
            return xhr;
        };

        jqXHR = _ajax.call( this, url, options);

        // delegate all jqXHR promise methods to our deferred
        for( var method in deferred.promise()) {
            jqXHR[ method]( deferred[ method]);
        }
        jqXHR.progress = deferred.progress;

        // overwrite the jqXHR promise methods with our promise and return the patched jqXHR
        return jqXHR;
    };

    $.upload = function( url, data, callback, type) {
        // shift arguments if data argument was omitted
        if ( $.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return $.ajax({
            /*
             * processData and contentType must be false to prevent jQuery
             * setting its own defaults ... which would result in nonsense
             */
            processData : false,
            contentType : false,
            type    : 'POST',
            url     : url,
            data    : data,
            success   : callback,
            dataType  : type
        });
    };

}));
