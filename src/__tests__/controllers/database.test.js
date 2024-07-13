// File: __tests__/database.test.js

jest.mock('sqlite3', () => {
    return {
      verbose: jest.fn().mockReturnThis(),
      Database: jest.fn((path, mode, callback) => {
        const err = path === "error.db" ? new Error("Failed to connect") : null;
        callback(err);
        return {
          close: jest.fn().mockImplementation((callback) => {
            const error = path === "error_close.db" ? new Error("Error closing database") : null;
            callback(error);
          }),
          on: jest.fn()
        };
      })
    };
  });
  
  const sqlite3 = require('sqlite3').verbose();
  
  describe('Database Module', () => {
      let db;
      let originalLog, originalError;
      let closeDatabase;

      beforeAll(() => {
          originalLog = console.log;
          originalError = console.error;
          console.log = jest.fn();
          console.error = jest.fn();
      });
  
      afterAll(() => {
          console.log = originalLog;
          console.error = originalError;
          jest.resetModules();
      });
  
      beforeEach(() => {
        jest.isolateModules(() => {
            db = require('../../controllers/database');
            closeDatabase = require('../../controllers/database').closeDatabase; // if exported separately
        });
      });
  
      it('should create database instance without error', () => {
          expect(sqlite3.Database).toHaveBeenCalledWith('src/tasks.db', sqlite3.OPEN_READWRITE, expect.any(Function));
      });
  
      it('should handle database initialization error', () => {
          jest.isolateModules(() => {
              sqlite3.Database.mockImplementationOnce((path, mode, callback) => callback(new Error("Failed to connect")));
              expect(() => require('../../controllers/database')).toThrow("Failed to connect");
          });
      });
  
      it('should close database on SIGINT', () => {
        process.emit('SIGINT');  // triggering a SIGINT event
        expect(db.close).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Closed the database connection.');
    });
  });
  
