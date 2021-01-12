import { ExtensionDao } from '../dao/extension.dao';
import { Expression } from '../model/expression';
import { SettingsService } from './settings.service';

export class ExtensionService {
    private dao: ExtensionDao;
    private settingsService: SettingsService;

    constructor() {
        this.dao = new ExtensionDao();
        this.settingsService = <any>null;
    }

    public init(settingsService: SettingsService) {
        this.settingsService = settingsService;
        this.dao.init(this.settingsService.getSettings());
    }

    public async getExpressions(filter: string): Promise<Expression[]> {
        const rows = await this.dao.getExpressions(filter);

        return rows.map((row: any) => {
            return {
                value: row.value,
                plural: row.plural,
                language: row.language,
                isPlural: row.isPlural,
                type: row.type
            } as Expression
        });
    }
}