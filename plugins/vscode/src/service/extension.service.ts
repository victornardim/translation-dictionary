import { ExtensionDao } from '../dao/extension.dao';
import { Expression } from '../model/expression';
import { Settings } from '../model/settings';

export class ExtensionService {
    private dao: ExtensionDao;
    private settings: Settings;

    constructor() {
        this.dao = new ExtensionDao();
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
                value: (this.settings.expressionsToLowerCase) ? row.value.toLowerCase() : row.value,
                original: row.original,
                language: row.language,
                isPlural: row.isPlural,
                type: row.type
            } as Expression
        });
    }
}