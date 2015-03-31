define ('SQL_Engine/SQL_DB', [

    'lodash'

], function () {
    'use strict';

    /**
     * SQL_DB class
     * @constructor
     */
    var SQL_DB = function () {
        this.structure = '';
    };

    SQL_DB.prototype = {
        constructor: SQL_DB,
        /**
         * Returns an array of objects - all data of specified table
         * @param table
         * @returns {Array}
         */
        getTable: function (table) {
            return _.result(this.structure, table);
        }
    };

    return SQL_DB;

});

