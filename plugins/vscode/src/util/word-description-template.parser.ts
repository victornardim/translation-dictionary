import { Expression } from '../model/expression';
import { TemplateMatch } from './tempalate-match';

export class WordDescriptionTemplateParser {
    private regex = /%{([^}%]+)}(%[VPOLTt])/g;

    private expression: Expression = <any>null;
    private description = '';

    public parse(template: string, expression: Expression) {
        this.description = template;
        this.expression = expression;

        let match = this.match(template);
        while (!!match) {
            if (this.propertyIsPlural(match.property)) {
                this.getPluralDescription(match);
            } else if (this.propertyIsOriginal(match.property)) {
                this.getOriginalDescription(match);
            }

            match = this.match(template);
        }

        return this.replaceTemplateByExpression();
    }

    private match(template: string): TemplateMatch | null {
        const regex = this.regex.exec(template);

        if (!regex) {
            return null;
        }

        return {
            "expression": regex[0],
            "phrase": regex[1],
            "property": regex[2]
        }
    }

    private propertyIsPlural(property: string) {
        return (property === '%P');
    }

    private getPluralDescription(match: TemplateMatch) {
        if (!this.expression.isPlural) {
            this.description = this.description.replace(new RegExp(match.expression), '');
        } else {
            this.description = this.description.replace(new RegExp(match.expression), `${match.phrase}`);
        }
    }

    private propertyIsOriginal(property: string) {
        return (property === '%O');
    }

    private getOriginalDescription(match: TemplateMatch) {
        if (!this.expression.original) {
            this.description = this.description.replace(new RegExp(match.expression), '');
        } else {
            this.description = this.description.replace(new RegExp(match.expression), `${match.phrase}`)
        }
    }

    private replaceTemplateByExpression(): string {
        return this.description
            .replace(/%V/g, this.expression.value)
            .replace(/%v/g, this.expression.value.toLowerCase())
            .replace(/%P/g, this.expression.isPlural ? 'Plural' : '')
            .replace(/%p/g, this.expression.isPlural ? 'plural' : '')
            .replace(/%O/g, this.expression.original)
            .replace(/%o/g, this.expression.original.toLowerCase())
            .replace(/%L/g, this.expression.language)
            .replace(/%l/g, this.expression.language.toLowerCase())
            .replace(/%T/g, this.expression.type)
            .replace(/%t/g, this.expression.type.toLowerCase())
            .replace(/\s{2,}/g, ' ');
    }
}