define (require) ->
  Engine = require 'SQL_Engine/SQL_Engine'
  Parser = require 'SQL_Engine/SQL_Parser'
  database =
    "structure":
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
    "getTable": (table) ->
      _.result(this.structure, table)

  describe "SQL_Engine", ->
    engine = null
    beforeEach ->
      engine = new Engine(new Parser(), database);
    it "should be defined", ->
      expect(Engine).toBeDefined()

    it 'should have execute method', ->
      expect(engine.execute).toEqual jasmine.any(Function)

    it 'should have setDb method', ->
      expect(engine.setDb).toEqual jasmine.any(Function)

    describe 'setDb method', ->
      it 'should be called with a parameter (database)', ->
        setDb = spyOn(engine, 'setDb');
        setDb(database)
        expect(setDb).toHaveBeenCalledWith(database)
      it 'should set DB structure', ->
        expect(engine.db.structure).toEqual database.structure

    describe 'execute method', ->
      it 'should use a query as a parameter', ->
        execute = spyOn(engine, 'execute')
        execute 'SELECT movie.title FROM movie'
        expect(execute).toHaveBeenCalledWith('SELECT movie.title FROM movie')

      it 'should return correct data for a select query with one field', ->
        expect(engine.execute('SELECT movie.title FROM movie')).toEqual [["The A-Team"],["Avatar"]]

      it 'should return correct data for a select query with a few fields', ->
        expect(engine.execute('SELECT movie.title, movie.id FROM movie')).toEqual [["The A-Team", 1],["Avatar", 2]]

      it 'should return correct data for a select query with all fields', ->
        expect(engine.execute('SELECT * FROM movie')).toEqual [[1,"The A-Team", 2010, 1],[2,"Avatar",2009,2]]

      it 'should return correct data for a select query with a join section', ->
        expect(engine.execute('SELECT movie.title, director.name FROM movie JOIN director ON director.id = movie.directorID')).toEqual [["The A-Team", "Joe Carnahan"], ["Avatar","James Cameron"]]
        expect(engine.execute('SELECT movie.title, director.name FROM movie JOIN director ON movie.directorID = director.id')).toEqual [["The A-Team", "Joe Carnahan"], ["Avatar","James Cameron"]]

      it 'should return correct data for a select query with  where section', ->
        expect(engine.execute('SELECT movie.id FROM movie WHERE movie.id = 2')).toEqual [[2]]
        expect(engine.execute('SELECT movie.id FROM movie WHERE movie.year > 2009')).toEqual [[1]]
        expect(engine.execute('SELECT movie.id FROM movie WHERE 2009 < movie.year')).toEqual [[1]]
        expect(engine.execute('SELECT movie.id FROM movie WHERE movie.year >= 2009')).toEqual [[1],[2]]
        expect(engine.execute('SELECT movie.id FROM movie 2009 <= WHERE movie.year ')).toEqual [[1],[2]]
        expect(engine.execute('SELECT movie.id FROM movie WHERE movie.year <= 2010')).toEqual [[1],[2]]
        expect(engine.execute('SELECT * FROM director WHERE director.id = 2')).toEqual [[2,'James Cameron']]
        expect(engine.execute('SELECT movie.id, movie.directorID FROM movie WHERE movie.id = movie.directorID')).toEqual [[1,1], [2,2]]
        expect(engine.execute('SELECT movie.title FROM movie WHERE movie.title LIKE ata')).toEqual [['Avatar']]

      it 'should return correct data for a select query with JOIN and WHERE section', ->
        expect(engine.execute('SELECT movie.id, movie.title, director.name FROM movie JOIN director ON director.id=movie.directorID WHERE movie.id < 2')).toEqual [[1, 'The A-Team', 'Joe Carnahan']]