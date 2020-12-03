import AuthDao from '../dao/auth.dao';

export default class AuthService {
    private dao: AuthDao;

    constructor() {
        this.dao = new AuthDao();
    }

    public async authenticate(token: string): Promise<boolean> {
        return this.dao.authenticate(token);
    }
}