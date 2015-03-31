define ('SQL_Engine/SQL_Engine', [
    'lodash'
], function (_) {
    'use strict';

    var SQL_Engine = function (parser, db) {
        this.parser = parser;
        this.db = db;
    };

    SQL_Engine.prototype = {
        constructor: SQL_Engine,
        /**
         * Returns an array of names of columns to select
         * @param query {String}
         * @returns {Array | Boolean}
         */
        getColumns: function (query) {
            var columns = [];

            try {
                var table = this.db.getTable(this.getParsed(query).select.from);
            } catch(e) {
                console.log(e.message);
                return false;
            }

            if (this.getParsed(query).select.columns === '*') {
                var col = [];
                _.forEach(_.keys(table[0]), function (el) {
                    col.push({'column': el, 'table': this.getParsed(query).select.from});
                }.bind(this));
                return col;
            }
            return  _(this.getParsed(query).select.columns).forEach(function(col) {
                columns.push(col.column);
            }).value();

        },
        /**
         * Parses a query string
         * @param query {String}
         * @returns {Object}
         */
        getParsed: function (query) {
            return this.parser.parse(query);
        },
        /**
         * Executes join section if it is specified by conditions
         * @param parsed
         * @private
         */
        _joinSection: function (parsed) {
            var joinedAll;
            var joinedFinal = [];
            var obj = {};

            this.table2 = this.db.getTable(parsed.join[0].table);

            _(this.table).forEach(function (row) {
                obj[parsed.join[0].columns.left.column] = row[parsed.join[0].columns.right.column];
                joinedAll =_.where(this.table2, obj);
                console.log(joinedAll);
                joinedFinal.push(_.pick(joinedAll[0], parsed.select.columns[1].column));
            }.bind(this)).value();

            _.merge(this.table, joinedFinal);

            if(parsed.join[1]) {
                this.table3 = this.db.getTable(parsed.join[1].table);
                joinedFinal = [];

                _(this.table).forEach(function (row) {
                    obj[parsed.join[1].columns.left.column] = row[parsed.join[1].columns.right.column];
                    joinedAll =_.where(this.table3, obj);
                    joinedFinal.push(_.pick(joinedAll[0], parsed.select.columns[1].column));
                }.bind(this)).value();
                _.merge(this.table, joinedFinal);
                console.log(this.table);
            }

        },
        _whereSection: function (parsed, columns) {
            var filteredWhere;
            var finalFiltered = [];
            var sign = {
                '>': function (a, b) {
                    return a > b;
                },
                '<': function (a, b) {
                    return a < b;
                },
                '=': function (a, b) {
                    return a === b;
                },
                '>=': function (a, b) {
                    return a >= b;
                },
                '<=': function (a, b) {
                    return a <= b;
                },
                'LIKE': function (a, b) {
                    return (a.indexOf(b, 0) !== -1);
                }
            };

            filteredWhere = _.filter(this.table, function (n) {
                return sign[parsed.where.operand](n[parsed.where.left.column] || parsed.where.left, n[parsed.where.right.column] || parsed.where.right);
            });

            _(filteredWhere).forEach(function (row) {
                finalFiltered.push(_.pick(row, _.pluck(columns, 'column')));
            }.bind(this)).value();

            return finalFiltered;
        },

        /**
         * Executes query and returns result for rendering
         * @param query
         * @returns {Array}
         */
        execute: function (query) {
            var parsed = this.getParsed(query);
            var finalFiltered = [];
            var result = [];
            var columns = this.getColumns(query);
            this.table = this.db.getTable(parsed.select.from);

            if (parsed.join) {
                this._joinSection(parsed);
            }

            if (parsed.where) {
                finalFiltered = this._whereSection(parsed, columns);

            } else {

                _(this.table).forEach(function (row) {
                    finalFiltered.push(_.pick(row, _.pluck(columns, 'column')));
                }.bind(this)).value();
            }

            //Final transform array of objects to array of arrays for further rendering
            _(finalFiltered).forEach(function (row) {
                result.push( _.values(row));
            }).value();

            return result;
        },

        /**
         * Sets database to work with
         * @param data {Object}
         */
        setDb: function (data) {
            this.db.structure = data || {};
        }

    };

    return SQL_Engine;

});

