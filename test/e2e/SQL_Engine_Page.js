'use strict';
var SQL_Engine_Page = function () {
    global.isAngularSite(false);
    browser.get('http://localhost:63342/CDP_Testing/src/index.html');
};

SQL_Engine_Page.prototype = Object.create ({}, {
    queryInput: {
        get: function () {
            return element(by.css('#query'));
        }
    },
    submitButton: {
        get: function () {
            return element(by.css('#submit'));
        }
    },
    clearButton: {
        get: function () {
            return element(by.css('#clear'));
        }
    },
    structureTable: {
        get: function () {
            return element.all(by.css('#structure table'));
        }
    },
    columnHeaders: {
        get: function () {
            return element.all(by.css('#result thead th'));
        }
    },
    resultRows: {
        get: function () {
            return element.all(by.css('#result tbody tr'));
        }
    },
    notValid: {
        get: function () {
            return element(by.css('.not-valid'));
        }
    },
    query: {
        value: function (keys) {
            this.queryInput.sendKeys (keys);
            this.submitButton.click();
        }
    }

});

module.exports = SQL_Engine_Page;