define (require) ->
  Parser = require 'SQL_Engine/SQL_Parser'

  describe "SQL_Parser", ->
    parser = null
    beforeEach ->
      parser = new Parser();
    it "should be defined", ->
      expect(Parser).toBeDefined()

    it 'should have parse method', ->
      expect(parser.parse).toEqual jasmine.any(Function)

    it 'should be able to parse simple select query', ->
      result = parser.parse 'SELECT * FROM users'
      expect(result).toEqual
        select:
          columns: '*'
          from: 'users'

    it 'should be able to parse simple select query with specified property', ->
      result = parser.parse 'SELECT users.name FROM users'
      expect(result).toEqual
        select:
          columns:[
            table: 'users'
            column: 'name'
          ]
          from: 'users'

    it 'should be able to parse simple select query with several columns', ->
      result = parser.parse 'SELECT movies.title, movies.id FROM movies'
      expect(result).toEqual
        select:
          columns: [
            {
              table: 'movies'
              column: 'title'
            },
            {
              table: 'movies'
              column: 'id'
            }
          ]
          from: 'movies'

    it 'should be able to parse simple JOIN section', ->
      result = parser.parse 'JOIN movies ON users.id = movies.userID'
      expect(result).toEqual
        join: [
          table: 'movies'
          columns:
            left:
              table: 'users'
              column: 'id'
            right:
              table: 'movies'
              column: 'userID'
        ]
    it 'should be able to parse multiple join operations', ->
      result = parser.parse '''
        JOIN movies ON users.id = movies.userID
        JOIN actors ON actors.id = movies.actorID
'''
      expect(result).toEqual
      join: [
        {
          table: 'movies'
          columns:
            left:
              table: 'users'
              column: 'id'
            right:
              table: 'movies'
              column: 'userID'
        }
        {
          table: 'actors'
          columns:
            left:
              table: 'actors'
              column: 'id'
            right:
              table: 'movies'
              column: 'actorID'
        }
      ]

    describe 'WHERE', ->
      it 'should be able to parse WHERE', ->
        for comparator in ['>=', '<=', '>', '<', '<>', '=', 'LIKE']
          result = parser.parse "WHERE movies.id #{comparator} users.movieID"
          expect(result).toEqual
            where:
              left:
                table: 'movies'
                column: 'id'
              right:
                table: 'users'
                column: 'movieID'
              operand: comparator

      it 'should be able to parse numbers in where section', ->
        result = parser.parse "WHERE movies.id < 200"
        expect(result).toEqual
          where:
            left:
              table: 'movies'
              column: 'id'
            right: 200
            operand: '<'

      it 'should be able to parse numbers in where section', ->
        result = parser.parse "WHERE 200 > movies.id"
        expect(result).toEqual
          where:
            left: 200
            right:
              table: 'movies'
              column: 'id'
            operand: '>'

      it 'should be able to parse boolean in where section', ->
        result = parser.parse "WHERE movies.check = false"
        expect(result).toEqual
          where:
            left:
              table: 'movies'
              column: 'check'
            right: false
            operand: '='

      it 'should be able to parse null in where section', ->
        result = parser.parse "WHERE movies.check = null"
        expect(result).toEqual
          where:
            left:
              table: 'movies'
              column: 'check'
            right: null
            operand: '='

      it 'should be able to parse string in where section', ->
        result = parser.parse "WHERE movies.check = some"
        expect(result).toEqual
          where:
            left:
              table: 'movies'
              column: 'check'
            right: 'some'
            operand: '='

      it 'should be able to parse LIKE in where section', ->
        result = parser.parse "WHERE movies.title LIKE Avatar"
        expect(result).toEqual
          where:
            left:
              table: 'movies'
              column: 'title'
            right: 'Avatar'
            operand: 'LIKE'

    describe 'Complex Query', ->
      it 'should be able to parse complex query', ->
        result = parser.parse '''
          SELECT movies.title, movies.id
          FROM movies
          JOIN users ON users.id = movies.userID
          JOIN actors ON actors.id = movies.actorID
          WHERE movies.id <= users.movieID
'''
        expect(result).toEqual
          select:
            columns: [
              {
                table: 'movies'
                column: 'title'
              },
              {
                table: 'movies'
                column: 'id'
              }
            ]
            from: 'movies'
          join: [
            {
              table: 'users'
              columns:
                left:
                  table: 'users'
                  column: 'id'
                right:
                  table: 'movies'
                  column: 'userID'
            },
            {
              table: 'actors'
              columns:
                left:
                  table: 'actors'
                  column: 'id'
                right:
                  table: 'movies'
                  column: 'actorID'
            }
          ]
          where:
            left:
              table: 'movies'
              column: 'id'
            right:
              table: 'users'
              column: 'movieID'
            operand: '<='
