
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { languageTransformer } from '../util/language.transformer';
import Expression from './expression';
import Language from './language';

@Entity('translations')
export default class Translation {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    value: string;

    @Column()
    plural: string;

    @Column({ type: 'text', transformer: languageTransformer })
    language: Language;

    @ManyToOne(() => Expression, expression => expression.translations)
    @JoinColumn({ name: 'expression_id' })
    expression: Expression;
}