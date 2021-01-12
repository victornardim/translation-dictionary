"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionDao = void 0;
const sqlite3_1 = require("sqlite3");
const path = require('path');
class ExtensionDao {
    constructor() {
        this.database = null;
        this.settings = null;
    }
    init(settings) {
        this.settings = settings;
        let databasePath = settings.databasePath;
        if (!databasePath) {
            databasePath = path.join(__dirname, '..', '..', '..', '..', 'server', 'src', 'database', 'database.sqlite');
        }
        this.database = new sqlite3_1.Database(databasePath);
        if (!this.database) {
            throw Error(`Database ${databasePath} can\'t be loaded`);
        }
    }
    getExpressions(filter) {
        return new Promise((resolve, reject) => {
            this.database.all(this.getQuery(filter), [], (err, rows) => {
                if (err) {
                    reject(err.message);
                }
                resolve(rows);
            });
        });
    }
    getQuery(filter) {
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
    getExpressionsQuery(filter) {
        return `
            SELECT
                value, source_language as language, 'EXPRESSION' as type, false as isPlural
            FROM
                expressions
            WHERE
                value LIKE('${filter}%')
        `;
    }
    getTranslationsQuery(filter) {
        return `
            SELECT
                value, language, 'TRANSLATION' as type, false as isPlural
            FROM
                translations
            WHERE
                value LIKE('${filter}%')
        `;
    }
    getTranslationsPluralQuery(filter) {
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
exports.ExtensionDao = ExtensionDao;
//# sourceMappingURL=extension.dao.js.map