import { NextRequest, NextResponse } from "next/server";
import { TodoController } from "../../../controllers/TodoController";

const todoController = new TodoController();

export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const todo = await todoController.getTodoById(parseInt(id));
    return NextResponse.json(todo, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode || 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: any) {
  try {
    const id = parseInt(context.params.id, 10);
    const { completed } = await request.json();
    const updatedTodo = await todoController.updateTodoStatus(id, completed);
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode || 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const id = parseInt(context.params.id, 10);
    const result = await todoController.deleteTodoById(id);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
