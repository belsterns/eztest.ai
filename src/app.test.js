const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = require('./app'); // Assuming app.js exports the app
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Clean up tasks.json before each test
beforeEach(() => {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
});

afterAll(() => {
    // Close server or other connections if necessary
});

describe('Task API', () => {
    it('should fetch all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should create a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app).post('/tasks').send(newTask);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newTask.title);
    });

    it('should update an existing task', async () => {
        // First, create a task
        const newTask = { title: 'Test Task' };
        const createResponse = await request(app).post('/tasks').send(newTask);
        const taskId = createResponse.body.id;

        // Now, update the task
        const updatedTask = { title: 'Updated Task' };
        const updateResponse = await request(app).put(`/tasks/${taskId}`).send(updatedTask);
        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.title).toBe(updatedTask.title);
    });

    it('should delete a task', async () => {
        // First, create a task
        const newTask = { title: 'Test Task' };
        const createResponse = await request(app).post('/tasks').send(newTask);
        const taskId = createResponse.body.id;

        // Now, delete the task
        const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
        expect(deleteResponse.statusCode).toBe(204);

        // Verify the task is deleted
        const fetchResponse = await request(app).get('/tasks');
        expect(fetchResponse.body).toHaveLength(0);
    });

    it('should return 404 for updating a non-existing task', async () => {
        const response = await request(app).put('/tasks/999').send({ title: 'Non-existing Task' });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });

    it('should return 404 for deleting a non-existing task', async () => {
        const response = await request(app).delete('/tasks/999');
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: 'Task not found' });
    });
});