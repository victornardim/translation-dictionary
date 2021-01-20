import { Expression } from '../model/expression';
import { ExpressionPropertyCode } from '../model/enum/expression-property-code.enum';
import { ExpressionProperty } from '../model/enum/expression-property.enum';
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
            if (match.property === ExpressionPropertyCode.PLURAL) {
                this.replaceMatchExpressionForPhrase(match, ExpressionProperty.PLURAL);
            } else if (match.property === ExpressionPropertyCode.ORIGINAL) {
                this.replaceMatchExpressionForPhrase(match, ExpressionProperty.ORIGINAL);
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

    private replaceMatchExpressionForPhrase(match: TemplateMatch, property: ExpressionProperty) {
        if (!this.expression[property]) {
            this.description = this.description.replace(new RegExp(match.expression), '');
        } else {
            this.description = this.description.replace(new RegExp(match.expression), `${match.phrase}`);
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