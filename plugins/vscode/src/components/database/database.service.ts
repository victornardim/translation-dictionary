import { DatabaseDao } from './database.dao';
import { Expression } from '../../model/expression';
import { Settings } from '../../model/settings';

export class DatabaseService {
    private dao: DatabaseDao;
    private settings: Settings;

    constructor() {
        this.dao = new DatabaseDao();
        this.settings = <any>null;
    }

    public async init(settings: Settings) {
        this.settings = settings;
        await this.dao.init(this.settings);
    }

    public async getExpressions(filter: string): Promise<Expression[]> {
        const rows = await this.dao.getExpressions(filter);

        return rows.map((row: any) => {
            return {
                value: row.value,
                original: row.original,
                language: row.language,
                isPlural: row.isPlural,
                type: row.type
            } as Expression
        });
    }
}