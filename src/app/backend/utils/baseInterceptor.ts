import { NextRequest, NextResponse } from "next/server";


export type BaseApiMethod<T extends NextRequest = NextRequest> = (request: T, context: any) => Promise<any>;

export function baseInterceptor<T extends NextRequest>(apiMethod: BaseApiMethod<T>): BaseApiMethod<T> {
  return async (request, context) => {
    try {
      const response = await apiMethod(request, context);

      if(response instanceof NextResponse) {
        return response;
      }

      return NextResponse.json(response, { status: 200 });
    } catch (err: any) {

      if (err.statusCode === 422) {
        return NextResponse.json(
          { message: err.message, data: err.data },
          { status: err.statusCode }
        );
      } else if (err.statusCode) {
        return NextResponse.json(
          { message: err.message, data: err.data || null },
          { status: err.statusCode }
        );
      } else {
        return NextResponse.json({ message: err.message }, { status: 500 });
      }
    }
  };
}
