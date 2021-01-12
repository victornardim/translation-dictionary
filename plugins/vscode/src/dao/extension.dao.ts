import { Database } from 'sqlite3';
import { Expression } from '../model/expression';
import { Settings } from '../model/settings';
const path = require('path');

export class ExtensionDao {
    private database: Database;
    private settings: Settings;

    constructor() {
        this.database = <any>null;
        this.settings = <any>null;
    }

    public init(settings: Settings) {
        this.settings = settings;

        let databasePath = settings.databasePath;

        if (!databasePath) {
            databasePath = path.join(__dirname, '..', '..', '..', '..', 'server', 'src', 'database', 'database.sqlite')
        }

        this.database = new Database(databasePath);

        if (!this.database) {
            throw Error(`Database ${databasePath} can\'t be loaded`);
        }
    }

    public getExpressions(filter: string): Promise<Expression[]> {
        return new Promise((resolve, reject) => {
            this.database.all(this.getQuery(filter), [], (err: Error, rows: any[]) => {
                if (err) {
                    reject(err.message);
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
                value, source_language as language, 'EXPRESSION' as type, false as isPlural
            FROM
                expressions
            WHERE
                value LIKE('${filter}%')
        `
    }

    private getTranslationsQuery(filter: string): string {
        return `
            SELECT
                value, language, 'TRANSLATION' as type, false as isPlural
            FROM
                translations
            WHERE
                value LIKE('${filter}%')
        `;
    }

    private getTranslationsPluralQuery(filter: string): string {
        return `
            SELECT
                plural as value, language, 'TRANSLATION' as type, true as isPlural
            FROM
                translations
            WHERE
                plural <> ''
                AND plural LIKE('${filter}%')
        `;
    }
}