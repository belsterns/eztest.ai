import fs from 'fs';
import path from 'path';

export class TodoController {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'todos.json');
  }

  private async loadData() {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    const data = await fs.promises.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  private async saveData(todos: { id: number; text: string; completed: boolean }[]) {
    await fs.promises.writeFile(this.filePath, JSON.stringify(todos, null, 2));
  }

  async getAllTodos() {
    const todos = await this.loadData();
    console.log("Loaded todos:", todos);
    return todos;
  }

  async getTodoById(id: number) {
    const todos = await this.loadData();
    const todo = todos.find((todo: any) => todo.id === id);
    if (!todo) throw { statusCode: 404, message: 'Todo not found' };
    return todo;
  }

  async addTodo(text: string) {
    if (!text) throw { statusCode: 422, message: 'Text is required' };
    const todos = await this.loadData();
    const newTodo = { id: Date.now(), text, completed: false }; // Using `Date.now()` as a unique ID
    todos.push(newTodo);
    await this.saveData(todos);
    console.log("Updated todos:", todos);
    return newTodo;
  }

  async deleteTodoById(id: number) {
    const todos = await this.loadData();
    const index = todos.findIndex((todo: any) => todo.id === id);
    if (index === -1) throw { statusCode: 404, message: 'Todo not found' };
    todos.splice(index, 1);
    await this.saveData(todos);
    return { success: true };
  }

  async updateTodoStatus(id: number, completed: boolean) {
    const todos = await this.loadData();
    const todo = todos.find((todo: any) => todo.id === id);
    if (!todo) throw { statusCode: 404, message: 'Todo not found' };
    todo.completed = completed;
    await this.saveData(todos);
    return todo;
  }
}
