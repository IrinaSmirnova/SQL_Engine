define('SQL_Engine/ParserPattern', [], function() {
    /**
     * Pattern class
     * @param {Function} exec
     * @constructor
     */

    'use strict';
    var Pattern = function (exec) {
        this.exec = exec;

    };
    Pattern.prototype = {
        constructor: Pattern,
        /**
         * Is used when result should be transformed in some way
         * @param transformFn {Function} Transform function that will be applied to the result
         * @returns {Pattern}
         */
        then: function (transformFn) {
            var exec = this.exec;
            return new Pattern(function (str, pos) {
                var r = exec(str, pos || 0);
                return r && {
                        res: transformFn(r.res),
                        end: r.end };
            });
        }

    };
    return Pattern;

});
