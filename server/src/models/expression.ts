import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, ValueTransformer } from 'typeorm';
import { languageTransformer } from '../util/language.transformer';
import Language from './language';
import Translation from './translation';

@Entity('expressions')
export default class Expression {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    value: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'text', name: 'source_language', transformer: languageTransformer })
    sourceLanguage: Language;

    @OneToMany(() => Translation, translation => translation.expression, {
        cascade: ['insert', 'update']
    })
    @JoinColumn({ name: 'expression_id' })
    translations: Translation[];
}