const request = require('supertest');
const fs = require('fs');
const app = require('./app'); // Assuming the express app is exported from app.js

const DATA_FILE = 'src/tasks.json';

// Clean up tasks.json before each test
beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

// Close the server after all tests
afterAll((done) => {
    // If you have any active connections, close them here
    done();
});

describe('Task API', () => {
    it('should retrieve all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should add a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update an existing task', async () => {
        const newTask = { title: 'Task to Update' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;

        const updatedTask = { title: 'Updated Task' };
        const response = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    it('should delete a task', async () => {
        const newTask = { title: 'Task to Delete' };
        const postResponse = await request(app).post('/tasks').send(newTask);
        const taskId = postResponse.body.id;

        const response = await request(app).delete(`/tasks/${taskId}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 for deleting a non-existing task', async () => {
        const response = await request(app).delete('/tasks/999999'); // Non-existing ID
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Task not found');
    });
});