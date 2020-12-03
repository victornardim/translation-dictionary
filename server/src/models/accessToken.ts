import { Entity, PrimaryColumn } from 'typeorm';

@Entity('access_tokens')
export default class AccessToken {
    @PrimaryColumn()
    value: string;
}