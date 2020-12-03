import Expression from "../models/expression";

import * as Yup from 'yup';
import { Languages } from '../enums/languages';

import ExpressionsDao from '../dao/expressions.dao';
import TranslationsService from './translations.service';

export default class ExpressionsService {
    private dao: ExpressionsDao;
    private translationsService: TranslationsService;

    constructor() {
        this.dao = new ExpressionsDao();
        this.translationsService = new TranslationsService();
    }

    public async index(page: number, pageSize: number, order: string, filter: string) {
        return await this.dao.index(page, pageSize, order, filter);
    }

    public async create(expression: Expression) {
        const schema = this.getValidationSchema();
        await schema.validate(expression, {
            abortEarly: false
        });

        return await this.dao.create(expression);
    }

    public async edit(expression: Expression) {
        const schema = this.getValidationSchema();
        await schema.validate(expression, {
            abortEarly: false
        });

        await this.translationsService.removeMany(
            await this.translationsService.getTranslationsToDelete(expression.id, expression.translations)
        );

        return await this.dao.edit(expression);
    }

    private getValidationSchema(): Yup.ObjectSchema {
        return Yup.object().shape({
            value: Yup.string().required(),
            translations: Yup.array(Yup.object().shape({
                value: Yup.string().required(),
                language: Yup.string().required().oneOf([
                    Languages.Amharic, Languages.Arabic, Languages.Basque,
                    Languages.Bengali, Languages.English_UK, Languages.Portuguese_Brazil,
                    Languages.Bulgarian, Languages.Catalan, Languages.Cherokee,
                    Languages.Croatian, Languages.Czech, Languages.Danish,
                    Languages.Dutch, Languages.English_US, Languages.Estonian,
                    Languages.Filipino, Languages.Finnish, Languages.French,
                    Languages.German, Languages.Greek, Languages.Gujarati,
                    Languages.Hebrew, Languages.Hindi, Languages.Hungarian,
                    Languages.Icelandic, Languages.Indonesian, Languages.Italian,
                    Languages.Japanese, Languages.Kannada, Languages.Korean,
                    Languages.Latvian, Languages.Lithuanian, Languages.Malay,
                    Languages.Malayalam, Languages.Marathi, Languages.Norwegian,
                    Languages.Polish, Languages.Portuguese_Portugal, Languages.Romanian,
                    Languages.Russian, Languages.Serbian, Languages.Chinese_PRC,
                    Languages.Slovak, Languages.Slovenian, Languages.Spanish,
                    Languages.Swahili, Languages.Swedish, Languages.Tamil,
                    Languages.Telugu, Languages.Thai, Languages.Chinese_Taiwan,
                    Languages.Turkish, Languages.Urdu, Languages.Ukrainian,
                    Languages.Vietnamese, Languages.Welsh
                ])
            }))
        });
    }

    public async delete(id: number) {
        await this.dao.delete(id);
    }
}