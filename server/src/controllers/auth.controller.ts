import { Request, Response } from 'express';

import AuthService from '../services/auth.service';

export default class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    public async validate(request: Request, response: Response) {
        return response.json({ authenticated: true });
    }

    public async authenticate(token: string) {
        return this.service.authenticate(token);
    }
}