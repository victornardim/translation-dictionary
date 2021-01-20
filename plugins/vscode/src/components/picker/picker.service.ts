import { QuickPickItem } from 'vscode';
import { Expression } from '../../model/expression';
import { Settings } from '../../model/settings';
import { WordDescriptionTemplateParser } from '../../util/word-description-template.parser';
import { DatabaseService } from '../database/database.service';

export class PickerService {
    private databaseService: DatabaseService;
    private settings: Settings;

    private readonly DEFAULT_TEMPLATE = '%t %{of }%O %o in %L %{in the }%P %p';

    constructor() {
        this.databaseService = new DatabaseService();
        this.settings = <any>null;
    }

    public async init(settings: Settings) {
        this.settings = settings;
        await this.databaseService.init(this.settings);
    }

    public async getOptions(filter: string): Promise<QuickPickItem[]> {
        const expressions = await this.databaseService.getExpressions(filter);

        return expressions.map((expression: Expression) => {
            return {
                label: expression.value,
                description: this.getOptionDescription(expression)
            };
        });
    }

    private getOptionDescription(expression: Expression): string {
        const parser = new WordDescriptionTemplateParser();

        if (!this.settings.wordDescriptionTemplate) {
            return parser.parse(this.DEFAULT_TEMPLATE, expression);
        }

        return parser.parse(this.settings.wordDescriptionTemplate, expression);
    }
}