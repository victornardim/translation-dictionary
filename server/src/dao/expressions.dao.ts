import { getRepository } from 'typeorm';
import Expression from '../models/expression';
import Translation from '../models/translation';

export default class ExpressionsDao {
    public async index(page: number, pageSize: number, order?: string, filter?: string) {
        const expressionsRepository = getRepository(Expression);

        const skipAmount = (pageSize * page) - pageSize;

        const query = expressionsRepository
            .createQueryBuilder('expression')
            .leftJoinAndSelect('expression.translations', 'translation')
            .skip(skipAmount)
            .take(pageSize)

        if (!!filter) {
            query
                .where('UPPER(expression.value) LIKE UPPER(:filter)')
                .orWhere(`expression.id IN (${this.getExpressionsByTranslationsQuery()} )`)
                .setParameter('filter', `%${filter}%`);
        }

        if (order !== 'NONE') {
            query
                .orderBy('expression.value', (order === 'ASC') ? 'ASC' : 'DESC');
        }

        return await query
            .getManyAndCount();
    }

    private getExpressionsByTranslationsQuery(): string {
        const translationsRepository = getRepository(Translation);
        return translationsRepository
            .createQueryBuilder('translation')
            .select('translation.expression_id')
            .where('UPPER(translation.value) LIKE UPPER(:filter)')
            .orWhere('UPPER(translation.plural) LIKE UPPER(:filter)')
            .getQuery();
    }

    public async create(data: Expression): Promise<Expression> {
        const expressionsRepository = getRepository(Expression);
        const expression = expressionsRepository.create(data);

        return await expressionsRepository.save(expression);
    }

    public async edit(expression: Expression) {
        const expressionsRepository = getRepository(Expression);

        const foundExpression = await expressionsRepository.findOne(expression.id);
        if (!!foundExpression) {
            expressionsRepository.merge(foundExpression, expression);
            expressionsRepository.save(foundExpression);
        }
    }

    public async delete(id: number) {
        const expressionsRepository = getRepository(Expression);
        await expressionsRepository.delete(id);
    }
}