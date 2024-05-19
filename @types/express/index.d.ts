import {Logger} from 'src/server/utils';

declare global {
    namespace Express {
        interface Request {
            logger: Logger
            accessToken?: string;
            refreshToken?: string;
            isAuthenticated?: boolean;
        }
    }
}