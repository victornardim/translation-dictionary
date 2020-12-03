import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createAccessTokens1604663645498 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'access_tokens',
            columns: [
                {
                    name: 'value',
                    type: 'varchar',
                    isPrimary: true,
                    isGenerated: false,
                    generationStrategy: 'increment'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('access_tokens');
    }

}
