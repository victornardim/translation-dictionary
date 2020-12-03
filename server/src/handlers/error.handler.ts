import { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import { QueryFailedError } from 'typeorm';
import { ValidationError } from 'yup';

const {
    wrapError,
    DBError,
    UniqueViolationError,
    NotNullViolationError
} = require('db-errors');

interface DefaultError {
    code: string;
    message: string;
    errors: string[];
    extra?: any;
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    if (isDatabaseError(error)) {
        const err = wrapError(error);
        if (err instanceof UniqueViolationError) {
            return response.status(400).json(getUniqueViolationError(err));
        }
    }

    if ((error instanceof ValidationError)) {
        return response.status(400).json(getValidationErrors(error));
    }

    if (error instanceof QueryFailedError) {
        return response.status(400).json(getQueryFailedErrors(error));
    }

    if (error instanceof HttpError) {
        if (error.status === 401) {
            return response.status(401).json(getUnauthorizedErrors(error));
        }
    }

    return response.status(500).json(getDefaultError(error));
};

function isDatabaseError(error: any): boolean {
    const err = wrapError(error);

    return (err instanceof UniqueViolationError ||
        err instanceof NotNullViolationError ||
        err instanceof DBError);
}

function getUniqueViolationError(error: any): DefaultError {
    return {
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        message: 'Unique constraint violation',
        errors: [error.message],
        extra: {
            table: error.table,
            columns: error.nativeError.columns,
            data: error.nativeError.parameters
        }
    };
}

function getValidationErrors(error: ValidationError): DefaultError {
    return {
        code: 'VALIDATION_FAILED_ERROR',
        message: 'Validation failed',
        errors: error.errors
    };
}

function getQueryFailedErrors(error: QueryFailedError): DefaultError {
    return {
        code: 'QUERY_FAILED_ERROR',
        message: 'Query failed',
        errors: [error.message]
    };
}

function getUnauthorizedErrors(error: HttpError): DefaultError {
    return {
        code: 'AUTHORIZATION_FAILED_ERROR',
        message: 'Unauthorized',
        errors: [error.message]
    };
}

function getDefaultError(error: Error): DefaultError {
    return {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        errors: [error.message]
    };
}

export default errorHandler;