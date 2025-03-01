import { NextResponse } from "next/server";

export function handleError(error: any) {
  if (error.statusCode == 422) {
    return NextResponse.json(
      { message: error.message, data: error.data },
      { status: error.statusCode }
    );
  } else if (error.statusCode) {
    return NextResponse.json(
      { message: error.message, data: error.data },
      { status: error.statusCode }
    );
  } else {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
