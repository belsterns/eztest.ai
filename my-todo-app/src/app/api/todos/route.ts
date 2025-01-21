import { NextRequest, NextResponse } from 'next/server';
import { TodoController } from '../../controllers/TodoController';

const todoController = new TodoController();

export async function GET() {
  try {
    const todos = await todoController.getAllTodos();
    return NextResponse.json(todos, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const newTodo = await todoController.addTodo(text);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
