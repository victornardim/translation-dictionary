import { getRepository } from 'typeorm';
import AccessToken from '../models/accessToken';

export default class AuthDao {
    public async authenticate(token: string) {
        const authRepository = getRepository(AccessToken);

        const foundToken = await authRepository
            .count({
                where: {
                    value: token
                }
            });

        return (!!foundToken);
    }
}