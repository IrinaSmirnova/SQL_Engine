define (require) ->
  DB = require 'SQL_Engine/SQL_DB'

  describe "SQL_Engine", ->
    db = null
    beforeEach ->
      db = new DB();
    it "should be defined", ->
      expect(DB).toBeDefined()

    it 'should have getTable method', ->
      expect(db.getTable).toEqual jasmine.any(Function)

    describe "getTable method", ->
      it 'should return the data of specified table', ->
        database =
            "movie": [
              {
                "id": 1,
                "title": "The A-Team",
                "year": 2010,
                "directorID": 1
              },
              {
                "id": 2,
                "title": "Avatar",
                "year": 2009,
                "directorID": 2
              }
            ]
            "director": [
              {
                "id": 1,
                "name": "Joe Carnahan"
              },
              {
                "id": 2,
                "name": "James Cameron"
              }
            ]
        db.structure = database
        expect(db.getTable('director')).toEqual [
          {
            "id": 1,
            "name": "Joe Carnahan"
          },
          {
            "id": 2,
            "name": "James Cameron"
          }
        ]