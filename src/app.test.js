const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./app'); // Assuming app.js exports the app

const DATA_FILE = path.join(__dirname, 'tasks.json');

// Clean up the tasks.json file before each test
beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

afterAll(() => {
    // Clean up any open connections or resources
});

describe('Task API', () => {
    test('GET /tasks - should return an empty array initially', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /tasks - should add a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app)
            .post('/tasks')
            .send(newTask);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task');
    });

    test('PUT /tasks/:id - should update an existing task', async () => {
        const newTask = { title: 'Test Task' };
        const postResponse = await request(app)
            .post('/tasks')
            .send(newTask);
        const taskId = postResponse.body.id;

        const updatedTask = { title: 'Updated Task' };
        const response = await request(app)
            .put(`/tasks/${taskId}`)
            .send(updatedTask);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Task');
    });

    test('DELETE /tasks/:id - should delete an existing task', async () => {
        const newTask = { title: 'Test Task' };
        const postResponse = await request(app)
            .post('/tasks')
            .send(newTask);
        const taskId = postResponse.body.id;

        const response = await request(app)
            .delete(`/tasks/${taskId}`);

        expect(response.status).toBe(204);

        // Verify task is deleted
        const tasksResponse = await request(app).get('/tasks');
        expect(tasksResponse.body).toHaveLength(0);
    });

    test('PUT /tasks/:id - should return 404 for a non-existing task', async () => {
        const response = await request(app)
            .put('/tasks/9999')
            .send({ title: 'Non-existing Task' });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });

    test('DELETE /tasks/:id - should return 404 for a non-existing task', async () => {
        const response = await request(app)
            .delete('/tasks/9999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });
});