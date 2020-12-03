import { Request, Response } from 'express';
import LanguagesService from '../dao/languages.dao';

export default class LanguagesController {
    private languagesService: LanguagesService;

    constructor() {
        this.languagesService = new LanguagesService();
    }

    public index(request: Request, response: Response) {
        return response.status(200).json({ languages: this.languagesService.index() });
    }
}