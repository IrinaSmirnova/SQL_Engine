define (require) ->
  Pattern = require 'SQL_Engine/ParserPattern'
  describe "ParserPattern", ->
    it "should be defined", ->
      expect(Pattern).toBeDefined();

    it 'should accept exec function', ->
      execFn = jasmine.createSpy();
      txt = new Pattern(execFn);
      txt.exec('hello',0);
      expect(execFn).toHaveBeenCalledWith('hello',0);

    it 'should be able to transform result', ->
      txt = new Pattern (str, pos) ->  {res: str, end: 2}
        .then((res) ->
          "transformed#{res}")
      expect(txt.exec('hello', 0)).toEqual
        res: 'transformedhello',
        end: 2

