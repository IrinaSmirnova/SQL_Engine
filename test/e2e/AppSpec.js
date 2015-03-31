'use strict';

var SQL_Engine_Page = require('./SQL_Engine_Page.js');

describe('querying', function () {
  var page;

  beforeEach(function () {
    page = new SQL_Engine_Page();
  });

  it ('should have a title', function() {
    expect(browser.getTitle()).toEqual('Simple SQL Engine');
  });

  it('should show correct number of tables from DB', function(){
    browser.wait(function() {
      return browser.driver.isElementPresent(by.css('#structure table'));
    }, 1000);
    expect(page.structureTable.count()).toBe(4);
  });

  it ('should make a query and get results', function () {
    page.query('SELECT movie.id FROM movie');
    expect(page.resultRows.count()).toEqual(18);
  });

  it ('gets a correct columns', function () {
    page.query('SELECT movie.title, movie.id FROM movie');
    expect(page.columnHeaders.count()).toEqual(2);
    expect(page.queryInput.getAttribute('value')).toEqual('SELECT movie.title, movie.id FROM movie');

  });

  it ('should make input invalid when entered incorrect query', function () {
    page.query('fk kdk dk');
    expect(page.queryInput.getAttribute('class')).toMatch('has-error');
    expect(page.notValid.isDisplayed()).toBe(true);
  });

  it ('should clear results and input when click cear button', function () {
    page.query('SELECT movie.title, movie.id FROM movie');
    page.clearButton.click();
    expect(page.resultRows.count()).toEqual(0);
    expect(page.queryInput.getAttribute('value')).toEqual('');
  });

});

