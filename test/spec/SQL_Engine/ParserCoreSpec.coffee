define (require) ->
  Patterns = require 'SQL_Engine/ParserCore'
  describe "ParserCore", ->
    it "should be defined", ->
      expect(Patterns).toBeDefined()

    describe 'txt', ->
      it 'should be a function', ->
        expect(Patterns.txt).toEqual jasmine.any(Function)

      it 'should read predefined text', ->
        hello = Patterns.txt 'hello'

        expect(hello.exec('hello',0)).toEqual
          res: 'hello',
          end: 5

      it 'should return undefined when text does not match', ->
        hello = Patterns.txt 'hello'
        expect(hello.exec('hloo',0)).toBeUndefined()

      it 'should read from the specified position', ->
        hello = Patterns.txt 'hello'
        expect(hello.exec('qwqhello',3)).toEqual
          res: 'hello',
          end: 8

    describe 'rgx', ->
      it 'should be a function', ->
        expect(Patterns.rgx).toEqual jasmine.any(Function)

      it 'should read predefined rgx', ->
        expect(Patterns.rgx(/\d+/).exec('123456ffbf',0)).toEqual
          res: '123456',
          end: 6

      it 'should return undefined when regexp isn\'t match', ->
        expect(Patterns.rgx(/\d+/).exec('ffbf',0)).toBeUndefined()

      it 'should read from the specified position', ->

        expect(Patterns.rgx(/\d+/).exec('qwq123hhj',3)).toEqual
          res: '123',
          end: 6

    describe 'opt', ->
      it 'should be a function', ->
        expect(Patterns.opt).toEqual jasmine.any(Function)

      it 'should make pattern optional', ->
        select = Patterns.txt 'SELECT'
        optSelect = Patterns.opt(select)
        expect(optSelect.exec 'SELECT * FROM', 0).toEqual {
          res: 'SELECT'
          end: 6
        }

        expect(optSelect.exec 'SELCT * FROM', 0).toEqual {
          res: undefined
          end: 0
        }

    describe 'exc', ->
      it 'should be a function', ->
        expect(Patterns.exc).toEqual jasmine.any(Function)

      it 'should parse what the first pattern can parse and the second pattern can not parse', ->
        expect(Patterns.exc(Patterns.rgx(/[A-Z]/), Patterns.txt("H")).exec("R",0)).toEqual {
          res: 'R'
          end: 1
        }
        
      it 'should return false if second pattern can parse', ->
        expect(Patterns.exc(Patterns.rgx(/[A-Z]/), Patterns.txt("H")).exec("H",0)).toBeFalsy()

    describe 'any', ->
      it 'should be a function', ->
        expect(Patterns.any).toEqual jasmine.any(Function)

      it 'should parse what can parse any pattern (first)', ->
        expect(Patterns.any(Patterns.txt("abc"), Patterns.txt("def")).exec('abc',0)).toEqual {
          res: 'abc'
          end: 3
        }

      it 'should parse what can parse any pattern (second)', ->
        expect(Patterns.any(Patterns.txt("abc"), Patterns.txt("def")).exec('def',0)).toEqual {
          res: 'def'
          end: 3
        }

      it 'should return false if none of patterns can parse', ->
        expect(Patterns.any(Patterns.txt("abc"), Patterns.txt("def")).exec('ABC',0)).toBeFalsy()

    describe 'seq', ->
      it 'should be a function', ->
        expect(Patterns.seq).toEqual jasmine.any(Function)
        
      it 'should parse text by sequence of patterns and return an array of results', ->
        expect(Patterns.seq(Patterns.txt("abc"), Patterns.txt("def")).exec("abcdef",0)).toEqual {
          res: ["abc", "def"],
          end: 6
        }

      it 'should return false if some pattern can not parse', ->
        expect(Patterns.seq(Patterns.txt("abc"), Patterns.txt("def")).exec("abcde7",0)).toBeUndefined()

    describe 'rep', ->
      it 'should be a function', ->
        expect(Patterns.rep).toEqual jasmine.any(Function)
        
      it 'should return an array of parsed results of text separated by second pattern', ->
        expect(Patterns.rep(Patterns.rgx(/\d+/), Patterns.txt(",")).exec("1,23,456", 0)).toEqual {
          res: ["1", "23", "456"],
          end: 8
        }

      it 'should return result that it could parse', ->
        expect(Patterns.rep(Patterns.rgx(/\d+/), Patterns.txt(",")).exec("123ABC", 0)).toEqual {
          res: ['123'],
          end: 3
        }

      it 'should return empty result if it can not parse', ->
        expect(Patterns.rep(Patterns.rgx(/\d+/), Patterns.txt(",")).exec("ABC", 0)).toEqual {
          res: [],
          end: 0
        }