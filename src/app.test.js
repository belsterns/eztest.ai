const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./app'); // Assuming app.js exports the express app

const DATA_FILE = path.join(__dirname, 'tasks.json');

// Clean up the tasks.json file before each test
beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

// Close any active connections after all tests
afterAll((done) => {
    // If you have any active connections to close, do it here
    done();
});

describe('Task API', () => {
    it('should return an empty array when no tasks exist', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should create a new task', async () => {
        const newTask = { title: 'Test task' };
        const response = await request(app)
            .post('/tasks')
            .send(newTask);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update an existing task', async () => {
        const newTask = { title: 'Test task' };
        const createdResponse = await request(app)
            .post('/tasks')
            .send(newTask);
        const taskId = createdResponse.body.id;

        const updatedTask = { title: 'Updated task' };
        const response = await request(app)
            .put(`/tasks/${taskId}`)
            .send(updatedTask);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updatedTask.title);
    });

    it('should return 404 for updating a non-existent task', async () => {
        const response = await request(app)
            .put('/tasks/999999')
            .send({ title: 'Non-existent task' });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should delete an existing task', async () => {
        const newTask = { title: 'Test task' };
        const createdResponse = await request(app)
            .post('/tasks')
            .send(newTask);
        const taskId = createdResponse.body.id;

        const response = await request(app)
            .delete(`/tasks/${taskId}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 for deleting a non-existent task', async () => {
        const response = await request(app).delete('/tasks/999999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Task not found');
    });
});
