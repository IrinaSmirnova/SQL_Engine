define ('SQL_Engine/ParserCore', [
    'SQL_Engine/ParserPattern'
], function (Pattern) {
    'use strict';
    return {
        /**
         * Pattern for parsing predefined text
         * @param text
         * @returns {Pattern}
         */
        txt: function (text) {
            return new Pattern(function (str, pos) {
                if (str.substr(pos, text.length) === text) {
                    return {res: text, end: pos + text.length};
                }
            });
        },
        /**
         * Pattern for parsing with regexp
         * @param rgx
         * @returns {Pattern}
         */
        rgx: function (rgx) {
            return new Pattern(function (str, pos) {
                var m = rgx.exec(str.slice(pos));
                if (m && m.index === 0) {
                    return {res: m[0], end: pos + m[0].length};
                }
            });
        },
        /**
         * Makes pattern optional
         * @param pattern
         * @returns {Pattern}
         */
        opt: function (pattern) {
            return new Pattern(function (str, pos) {
                return pattern.exec(str, pos) || {res: void 0, end: pos};
            });
        },
        /**
         * Parses what first pattern can exec and the second can't
         * @param pattern
         * @param except
         * @returns {Pattern}
         */
        exc: function (pattern, except) {
            return new Pattern(function (str, pos) {
                return !except.exec(str, pos) && pattern.exec(str, pos);
            });
        },
        /**
         * Executes first of listed Patterns that can be executed
         * @returns {Pattern}
         */
        any: function () {
            var patterns = [].slice.call(arguments, 0);
            return new Pattern(function (str, pos) {
                for (var r, i = 0; i < patterns.length; i++) {
                    if (r = patterns[i].exec(str, pos)) {
                        return r;
                    }
                }
            });
        },
        /**
         * Executes listed Patterns one by one and returns array of results
         * @returns {Pattern}
         */
        seq: function () {
            var patterns = [].slice.call(arguments, 0);
            return new Pattern(function (str, pos) {
                var i, r, end = pos, res = [];

                for (i = 0; i < patterns.length; i++) {
                    r = patterns[i].exec(str, end);
                    if (!r) {
                        return;
                    }
                    res.push(r.res);
                    end = r.end;
                }
                return { res: res, end: end };
            });
        },
        /**
         * Repeatable Pattern, separated by separator
         * @param pattern
         * @param separator
         * @returns {Pattern}
         */
        rep: function (pattern, separator) {
            var separated = !separator ? pattern :
                this.seq(separator, pattern).then(function(res) {
                    return res[1];
                });

            return new Pattern(function (str, pos) {
                var res = [], end = pos, r = pattern.exec(str, end);

                while (r && r.end > end) {
                    res.push(r.res);
                    end = r.end;
                    r = separated.exec(str, end);
                }

                return { res: res, end: end };
            });
        }
    };
});
