exports.config = {

    seleniumAddress: 'http://localhost:4444/wd/hub',

    specs: ['test/e2e/AppSpec.js'],

    capabilities: {
        "browserName": "chrome",
        "chromeOptions": {
            binary: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
            args: [],
            extensions: []
        }
    },

    onPrepare: function () {
        global.isAngularSite = function (flag) {
            browser.ignoreSynchronization = !flag;
            };
        }
};
