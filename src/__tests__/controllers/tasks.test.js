const sqlite3 = require('sqlite3').verbose();
const httpMocks = require('node-mocks-http');

// Mock sqlite3 methods
jest.mock('sqlite3', () => {
    const mDatabase = {
        all: jest.fn(),
        get: jest.fn(),
        run: jest.fn(),
        close: jest.fn()
    };
    function Database() {
        return mDatabase;
    }
    return { verbose: jest.fn(() => ({ Database })) };
});

const { getAllTasks, getTask, createTask, updateTask, deleteTask } = require('../../controllers/taskController');
const db = require('../../controllers/database');

describe('Tasks Controller', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('getAllTasks', () => {
        it('should return a list of tasks', async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: '/tasks',
                query: {
                    status: 'draft'
                }
            });
            const res = httpMocks.createResponse();
            db.all.mockImplementation((sql, params, callback) => {
                callback(null, [{ id: 1, title: 'Test Task', status: 'draft' }]);
            });

            await getAllTasks(req, res);
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res._getData())).toEqual([{ id: 1, title: 'Test Task', status: 'draft' }]);
            expect(db.all).toHaveBeenCalledWith(expect.anything(), ['draft'], expect.any(Function));
        });

        it('should handle errors', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const errorMessage = 'Failed to fetch data';

            db.all.mockImplementation((sql, params, callback) => {
                callback(new Error(errorMessage), null);
            });

            await getAllTasks(req, res);
            expect(res.statusCode).toBe(400);
            expect(res._getData()).toBe(errorMessage);
        });
    });


    describe('getTask', () => {
        it('should return a single task when found', async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                params: { id: 1 }
            });
            const res = httpMocks.createResponse();
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, { id: 1, title: 'Test Task' });
            });
    
            await getTask(req, res);
            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res._getData())).toEqual({ id: 1, title: 'Test Task' });
            expect(db.get).toHaveBeenCalledWith("SELECT * FROM tasks WHERE id = ?", [1], expect.any(Function));
        });
    
        it('should return 404 when task is not found', async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                params: { id: '2' }
            });
            const res = httpMocks.createResponse();
            db.get.mockImplementation((sql, params, callback) => {
                callback(null, undefined);
            });
    
            await getTask(req, res);
            expect(res.statusCode).toBe(404);
            expect(res._getData()).toBe('Task not found');
        });
    });
    
});

