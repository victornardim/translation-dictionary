import { Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import AuthController from './controllers/auth.controller';

const authController = new AuthController();

async function auth(request: Request, response: Response, next: any): Promise<any> {
    if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') === -1) {
        return next(getEmptyTokenError());
    }

    const base64Credentials = request.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [firstToken, secondToken] = credentials.split(':');

    if (!firstToken || !secondToken) {
        return next(getEmptyTokenError());
    }

    if (secondToken !== 'api_token') {
        return next(getInvalidTokenError());
    }

    const authenticated = await authController.authenticate(firstToken);
    if (!authenticated) {
        return next(getInvalidTokenError());
    } else {
        next();
    }
}

function getEmptyTokenError(): HttpError {
    return createHttpError(401, 'Opa! Você não informou o token de acesso :(');
}

function getInvalidTokenError(): HttpError {
    return createHttpError(401, 'Opa! Seu token de acesso não é válido :(');
}

module.exports = auth;