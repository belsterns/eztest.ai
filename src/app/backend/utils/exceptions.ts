class CustomException extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class UnauthorizedException extends CustomException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class BadRequestException extends CustomException {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export class InternalServerErrorException extends CustomException {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export class ForbiddenException extends CustomException {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundException extends CustomException {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}
