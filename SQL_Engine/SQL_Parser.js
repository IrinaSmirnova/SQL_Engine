define ('SQL_Engine/SQL_Parser', [
    'SQL_Engine/ParserPattern',
    'SQL_Engine/ParserCore'
], function (Pattern, Core) {
    'use strict';

    var txt = Core.txt;
    var rgx = Core.rgx;
    var opt = Core.opt;
    var any = Core.any;
    var seq = Core.seq;
    var rep = Core.rep.bind(Core);
    var SELECT = txt('SELECT');
    var FROM = txt('FROM');
    var JOIN = txt('JOIN');
    var WHERE = txt('WHERE');
    var ON = txt('ON');
    var equal = txt('=');

    //Whitespace
    var ws = rgx(/\s+/);

    //Number
    var num =rgx(/\d+/).then(function (res) {
        return parseFloat(res);
    });

    //String
    var strp = rgx(/\w+/);

    //Boolean
    var boolean = rgx(/true|false/i).then(function (res) {
        return (res === 'true') || false;
    });

    //Null
    var nullp = txt('null').then(function () {
        return null;
    });

    //Optional whitespace
    var wso = opt(ws);

    //Name of table
    var table = rgx(/[a-z][a-z0-9_]*/i);

    //Name of column
    var column = table;

    //Table column
    var tableColumn = seq(
        table,
        txt('.'),
        column
    ).then(function (res) {
            return {
                table: res[0],
                column: res[2]
            };
        });

    //List of table columns
    var tableColumnList = rep(
        tableColumn,
        seq(
            txt(','),
            wso
        )
    );

    //Parses select section
    var selectSection = seq(
        SELECT, ws,
        any (txt('*'), tableColumnList), ws,
        FROM, ws,
        table
    ).then (function (res) {
        return {
            select: {
                columns: (res[2] === '*')? '*' : res[2],
                from: res[6]
            }
        };
    });

    //Parses ON expression in JOIN section
    var joinON = seq (
        tableColumn, wso,
        equal, wso,
        tableColumn
    ).then(function (res) {
            return {
                left: res[0],
                right: res[4]
            };
        });

    //Parses whole join section
    var joinSection = seq(
        JOIN, ws,
        table, ws,
        ON, ws,
        joinON
    ).then(function (res) {
            return {
                table: res[2],
                columns: res[6]
            };
        });

    //Parses comparison in where section
    var whereComparison = seq (
        any(tableColumn, num, boolean, nullp, strp), wso,
        any (
            txt('>='),
            txt('<='),
            txt('<>'),
            txt('>'),
            txt('<'),
            txt('='),
            txt('LIKE')
        ), wso,
        any(tableColumn, num, boolean, nullp, strp)
    ).then(function (res) {
            return {
                left: res[0],
                right: res[4],
                operand: res[2]
            };
        });

    //Parses whole WHERE section
    var whereSection = seq(
        WHERE, ws,
        whereComparison
    ).then(function (res) {
            return res[2];
        });

    //Parses whole query
    var wholeQuery = seq(
        opt(selectSection), wso,
        opt(
            rep (
                joinSection, ws
            )
        ),wso,
        opt(whereSection)
    ).then(function (res) {
            var query = {};
            if (res[0]) {
                query.select = res[0].select;
            }
            if (!(res[2].length === 0)) {
                query.join = res[2];
            }
            if (res[4]) {
                query.where = res[4];
            }
            return query;
        });

    /**
     * SQL_Parser class
     * @constructor
     */
    var SQL_Parser = function () {};

    /**
     * Parses whole query
     * @param str
     * @returns {Object | undefined}
     */
    SQL_Parser.prototype.parse = function (str) {
        var result = wholeQuery.exec(str,0);
        if (result) {
            return result.res;
        }
    };

    return SQL_Parser;

});


