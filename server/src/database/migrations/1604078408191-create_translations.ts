import {MigrationInterface, QueryRunner, Table, TableUnique} from "typeorm";

export class createTranslations1604078408191 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'translations',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'value',
                    type: 'varchar'
                },
                {
                    name: 'plural',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'language',
                    type: 'varchar'
                },
                {
                    name: 'expression_id',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'ExpressionTranslation',
                    columnNames: ['expression_id'],
                    referencedTableName: 'expressions',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('translations');
    }

}
