import { StatusCode } from "./status-enum";

export abstract class AppException {
    public readonly status: number;
    public readonly message: string;

    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}

export class ValidationError extends AppException {
    constructor(message: string) {
        super(StatusCode.BadRequest, message);        
    }
}

export class NotFoundError extends AppException {
    constructor(message: string) {
        super(StatusCode.NotFound, message);        
    }
}

export class UnauthorizedError extends AppException {
    constructor(message?: string) {
        super(StatusCode.Unauthorized, message? message : "credential/token is missing or wrong");
    }
}

export class UnknownError extends AppException {
    constructor(message: string) {
        // todo: should hide the message from user?
        super(StatusCode.ServerError, message);
    }
}