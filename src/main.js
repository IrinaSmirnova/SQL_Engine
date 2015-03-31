require.config({
    baseUrl: "/CDP_Testing/src",
    paths: {
        'jquery': '../bower_components/jquery/dist/jquery',
        'lodash': '../bower_components/lodash/lodash',
        'text': '../bower_components/text/text'
    },
    shim: {
        'jquery': {
            exports: ['$', 'jQuery']
        },
        'lodash' : {
            exports: '_'
        }
    }
});


define ('main', [
        'app'
    ], function (App) {
        'use strict';

        $(function () {
            App.initialize();

            /**
             * Submit button listener, gets query and renders results
             */
            $('#submit').on('click', function (e) {
                e.preventDefault();
                var query = $('#query').val();
                try {
                    App.render( App.getQueryData(query), App.getColumnsHeaders(query));
                } catch (e) {
                    console.log(e.message);
                    App.setInvalid();
                }
            });

            /**
             * Clear button 'click' listener, cleans input and result-holder, cleans invalid messages
             */
            $('#clear').on('click', function (e) {
                e.preventDefault();
                App.setValid();
                $('#query').val('');
                $('#table').html('');
            });

        });
    }
);