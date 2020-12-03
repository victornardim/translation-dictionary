import { Request, Response } from 'express';
import Expression from "../models/expression";
import ExpressionsService from '../services/expressions.service';

export default class ExpressionsController {
    private readonly DEFAULT_PAGE: number = 1;
    private readonly DEFAULT_PAGE_SIZE: number = 25;
    private readonly DEFAULT_ORDER: string = 'NONE';

    private service: ExpressionsService;

    constructor() {
        this.service = new ExpressionsService();
    }

    public async index(request: Request, response: Response) {
        const page = Number(request.query.page) || this.DEFAULT_PAGE;
        const pageSize = Number(request.query.page_size) || this.DEFAULT_PAGE_SIZE;
        const order = (request.query.order || this.DEFAULT_ORDER) as string;
        const filter = request.query.filter as string;

        const [data, count] = await this.service.index(page, pageSize, order, filter);

        return response.status(200).json({ data, count });
    }

    public async create(request: Request, response: Response) {
        const data = {
            value: request.body.value,
            sourceLanguage: request.body.sourceLanguage,
            description: request.body.description,
            translations: request.body.translations
        } as Expression;

        const expression = await this.service.create(data);

        return response.status(201).json(expression);
    }

    public async edit(request: Request, response: Response) {
        const data = {
            id: request.body.id,
            value: request.body.value,
            sourceLanguage: request.body.sourceLanguage,
            description: request.body.description,
            translations: request.body.translations
        } as Expression;

        const expression = await this.service.edit(data)

        return response.status(200).json(expression);
    }

    public async delete(request: Request, response: Response) {
        const id = Number(request.params.id);
        await this.service.delete(id);

        return response.status(200).json({ status: true });
    }
}