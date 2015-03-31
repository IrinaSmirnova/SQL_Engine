define('app', [
        './SQL_Engine/SQL_Engine',
        './text!table.html',
        './text!structure.html',
        './SQL_Engine/SQL_Parser',
        './SQL_Engine/SQL_DB',
        './lodash',
        './text',
        './jquery'
    ],
    function ( SQL_Engine, tableTemplate, structureTemplate, Parser, SQL_DB, _) {
        'use strict';
        var parser = new Parser(),
            sql_db = new SQL_DB(),
            _sqlEngine = new SQL_Engine(parser, sql_db),
            db,
            $structure = $('#structure'),
            $table = $('#table'),
            $query = $('#query'),
            $notValid = $('.not-valid');

        return {
            /**
             * Gets JSON, sets database structure and renders structure of tables
             * @returns {*}
             */
            initialize : function () {
                return $.getJSON("fixtures/db.json", function (data) {
                    _sqlEngine.setDb(data);
                    var structure = [];
                    _.forIn(data, function (value, key) {
                        structure.push({'title':key, 'column': _.keys(value[0])});
                    });
                    this.renderStructure(structure);
                }.bind(this));
            },
            /**
             * Sets border of input red and shows message that query is invalid
             */
            setInvalid: function () {
                $query.addClass('has-error');
                $notValid.removeClass('hidden');
            },
            /**
             * Removes red border-color and message that query is invalid
             */
            setValid: function () {
                $query.removeClass('has-error');
                $notValid.addClass('hidden');
            },
            /**
             * Returns column headers for results
             * @param query
             * @returns {Array}
             */
            getColumnsHeaders: function (query) {
                return _.map(_sqlEngine.getColumns(query), function (item) {
                    return item.table + '.' + item.column;
                });
            },
            /**
             * Executes query
             * @param q
             * @returns {*|Array}
             */
            getQueryData: function (q) {
                return _sqlEngine.execute(q);
            },
            /**
             * Renders structure of database
             * @param structure {Array}
             */
            renderStructure: function (structure) {
                this.structure_tpl = _.template(structureTemplate);
                $structure.html(this.structure_tpl({
                    table: structure
                }));
            },
            /**
             * Renders results of a query
             * @param item {Array}
             * @param th {Array}
             */
            render: function (item, th) {
                this.table_tpl = _.template(tableTemplate);
                $table.html(this.table_tpl({
                    item: item,
                    th: th
                }));
            }
        };
    });
