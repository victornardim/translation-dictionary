import { Database } from 'sqlite3';
import { Expression } from '../../model/expression';
import { Settings } from '../../model/settings';

const path = require('path');

export class DatabaseDao {
    private database: Database;
    private settings: Settings;

    constructor() {
        this.database = <any>null;
        this.settings = <any>null;
    }

    public async init(settings: Settings): Promise<any> {
        return new Promise((resolve, reject) => {
            this.settings = settings;

            let databasePath = settings.databasePath;

            if (!databasePath) {
                databasePath = path.join(__dirname, '..', '..', '..', '..', '..', 'server', 'src', 'database', 'database.sqlite')
            }

            this.database = new Database(databasePath, (err) => {
                if (!!err) {
                    throw new Error(`TRANSLATION_DICTIONARY: Database "${databasePath}" can\'t be loaded.`);
                }

                resolve(null);
            });
        });
    }

    public getExpressions(filter: string): Promise<Expression[]> {
        return new Promise((resolve, reject) => {
            this.database.all(this.getQuery(filter), [], (err: Error, rows: any[]) => {
                if (err) {
                    throw err;
                }

                resolve(rows);
            });
        });
    }

    private getQuery(filter: string) {
        const query = [];

        if (this.settings.useExpressions) {
            query.push(this.getExpressionsQuery(filter));
        }

        if (this.settings.useTranslations) {
            query.push(this.getTranslationsQuery(filter));
        }

        if (this.settings.useTranslationsPlural) {
            query.push(this.getTranslationsPluralQuery(filter));
        }

        return query.join(' UNION ');
    }

    private getExpressionsQuery(filter: string): string {
        return `
            SELECT
                value, '' as original, source_language as language, 'EXPRESSION' as type, false as isPlural
            FROM
                expressions
            WHERE
                value LIKE('${filter}%')
        `
    }

    private getTranslationsQuery(filter: string): string {
        return `
            SELECT
                t.value, e.value as original, t.language, 'TRANSLATION' as type, false as isPlural
            FROM
                translations as t
            INNER JOIN
                expressions as e
            ON
                t.expression_id = e.id
            WHERE
                t.value LIKE('${filter}%')
        `;
    }

    private getTranslationsPluralQuery(filter: string): string {
        return `
            SELECT
                t.plural as value, e.value as original, t.language, 'TRANSLATION' as type, true as isPlural
            FROM
                translations as t
            INNER JOIN
                expressions as e
            ON
                t.expression_id = e.id
            WHERE
                t.plural <> ''
                AND t.plural LIKE('${filter}%')
        `;
    }
}